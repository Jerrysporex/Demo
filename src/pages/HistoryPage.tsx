import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AnalysisFilter from '../components/AnalysisFilter';
import AnalysisCard from '../components/AnalysisCard';
import { LogAnalysis } from '../lib/supabase';

// Mock data for analysis history
const mockAnalysisHistory: LogAnalysis[] = [
  {
    id: '1',
    user_id: 'user-1',
    filename: 'apache_access.log',
    file_size: 2500000,
    file_type: '.log',
    upload_date: new Date().toISOString(),
    analysis_date: new Date().toISOString(),
    llm_provider: 'Abacus.AI',
    severity: 'High',
    summary: 'Multiple failed login attempts detected from IP 192.168.1.100. Possible brute force attack targeting admin account.',
    anonymized: true,
    analysis_complete: true,
  },
  {
    id: '2',
    user_id: 'user-1',
    filename: 'firewall.log',
    file_size: 1500000,
    file_type: '.log',
    upload_date: new Date(Date.now() - 86400000).toISOString(),
    analysis_date: new Date(Date.now() - 86400000).toISOString(),
    llm_provider: 'Claude Opus 4',
    severity: 'Critical',
    summary: 'Unusual outbound traffic to known malicious IPs detected. Data exfiltration attempt possible. Immediate investigation recommended.',
    anonymized: true,
    analysis_complete: true,
  },
  {
    id: '3',
    user_id: 'user-1',
    filename: 'auth.log',
    file_size: 980000,
    file_type: '.log',
    upload_date: new Date(Date.now() - 172800000).toISOString(),
    analysis_date: new Date(Date.now() - 172800000).toISOString(),
    llm_provider: 'Abacus.AI',
    severity: 'Medium',
    summary: 'Several login attempts outside normal business hours. Could indicate unauthorized access attempts or legitimate after-hours work.',
    anonymized: true,
    analysis_complete: true,
  },
  {
    id: '4',
    user_id: 'user-1',
    filename: 'system.log',
    file_size: 1250000,
    file_type: '.log',
    upload_date: new Date(Date.now() - 259200000).toISOString(),
    analysis_date: new Date(Date.now() - 259200000).toISOString(),
    llm_provider: 'Claude Opus 4',
    severity: 'Low',
    summary: 'Several system updates were applied. No suspicious activity detected. Regular maintenance operations observed.',
    anonymized: true,
    analysis_complete: true,
  },
  {
    id: '5',
    user_id: 'user-1',
    filename: 'network_traffic.log',
    file_size: 3750000,
    file_type: '.log',
    upload_date: new Date(Date.now() - 345600000).toISOString(),
    analysis_date: new Date(Date.now() - 345600000).toISOString(),
    llm_provider: 'Abacus.AI',
    severity: 'Medium',
    summary: 'Unusual network traffic patterns detected during non-business hours. Higher than normal data transfer to external domains.',
    anonymized: true,
    analysis_complete: true,
  },
  {
    id: '6',
    user_id: 'user-1',
    filename: 'database_access.log',
    file_size: 1850000,
    file_type: '.log',
    upload_date: new Date(Date.now() - 432000000).toISOString(),
    analysis_date: new Date(Date.now() - 432000000).toISOString(),
    llm_provider: 'Claude Opus 4',
    severity: 'Critical',
    summary: 'Multiple unauthorized database access attempts detected. SQL injection patterns identified from multiple source IPs.',
    anonymized: true,
    analysis_complete: true,
  },
];

const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<LogAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<LogAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setAnalyses(mockAnalysisHistory);
    setFilteredAnalyses(mockAnalysisHistory);
  }, []);

  useEffect(() => {
    let filtered = [...analyses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (analysis) =>
          analysis.filename.toLowerCase().includes(query) ||
          analysis.summary.toLowerCase().includes(query)
      );
    }
    
    // Apply severity filter
    if (selectedSeverity) {
      filtered = filtered.filter(
        (analysis) => analysis.severity === selectedSeverity
      );
    }
    
    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (analysis) => new Date(analysis.analysis_date || analysis.upload_date) >= dateRange.start!
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(
        (analysis) => new Date(analysis.analysis_date || analysis.upload_date) <= dateRange.end!
      );
    }
    
    setFilteredAnalyses(filtered);
  }, [analyses, searchQuery, selectedSeverity, dateRange]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Analysis History</h1>
        <p className="mt-2 text-gray-600">
          View all your previous log analyses and their results
        </p>
      </div>

      <AnalysisFilter
        onSearchChange={setSearchQuery}
        onSeverityChange={setSelectedSeverity}
        onDateRangeChange={setDateRange}
      />

      {filteredAnalyses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
          <p className="text-gray-500">No analyses found</p>
          <p className="mt-1 text-sm text-gray-400">
            Try adjusting your filters or upload a new log file
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;