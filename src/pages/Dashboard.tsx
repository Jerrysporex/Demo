import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SeverityChart from '../components/SeverityChart';
import AnalysisCard from '../components/AnalysisCard';
import FileUploader from '../components/FileUploader';
import { LogAnalysis } from '../lib/supabase';

// Mock data for recent analyses
const mockRecentAnalyses: LogAnalysis[] = [
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
    upload_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
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
    upload_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    analysis_date: new Date(Date.now() - 172800000).toISOString(),
    llm_provider: 'Abacus.AI',
    severity: 'Medium',
    summary: 'Several login attempts outside normal business hours. Could indicate unauthorized access attempts or legitimate after-hours work.',
    anonymized: true,
    analysis_complete: true,
  },
];

// Mock data for severity stats
const mockSeverityData = {
  critical: 2,
  high: 5,
  medium: 8,
  low: 12,
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<LogAnalysis[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setRecentAnalyses(mockRecentAnalyses);
  }, []);

  const handleFileProcessed = (analysisId: string) => {
    // In a real app, this would redirect to the analysis page
    console.log('Analysis completed:', analysisId);
    setShowUploader(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90"
        >
          <Upload size={16} />
          {showUploader ? 'Hide Uploader' : 'Upload Logs'}
        </button>
      </div>

      {showUploader && (
        <div className="animate-slide-in rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Upload Log Files</h2>
          <FileUploader onFileProcessed={handleFileProcessed} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Analyses</h2>
              
              {user && (
                <Link
                  to="/history"
                  className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            
            {recentAnalyses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {recentAnalyses.map((analysis) => (
                  <AnalysisCard key={analysis.id} analysis={analysis} />
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                <ShieldAlert className="mb-2 h-10 w-10 text-gray-400" />
                <p className="text-gray-500">No recent analyses</p>
                <p className="mt-1 text-sm text-gray-400">
                  Upload a log file to get started
                </p>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              How It Works
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                  <Upload size={20} />
                </div>
                <h3 className="mb-1 font-medium text-gray-900">1. Upload</h3>
                <p className="text-sm text-gray-600">
                  Upload your log files securely to our platform
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="mb-1 font-medium text-gray-900">2. Analyze</h3>
                <p className="text-sm text-gray-600">
                  We anonymize and analyze your logs with multiple LLMs
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                  <Clock size={20} />
                </div>
                <h3 className="mb-1 font-medium text-gray-900">3. Review</h3>
                <p className="text-sm text-gray-600">
                  Get actionable insights and security recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Severity Overview
            </h2>
            
            <SeverityChart data={mockSeverityData} />
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-red-50 p-3">
                <div className="font-semibold text-red-800">Critical</div>
                <div className="text-2xl font-bold text-red-800">
                  {mockSeverityData.critical}
                </div>
              </div>
              
              <div className="rounded-md bg-orange-50 p-3">
                <div className="font-semibold text-orange-800">High</div>
                <div className="text-2xl font-bold text-orange-800">
                  {mockSeverityData.high}
                </div>
              </div>
              
              <div className="rounded-md bg-yellow-50 p-3">
                <div className="font-semibold text-yellow-800">Medium</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {mockSeverityData.medium}
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 p-3">
                <div className="font-semibold text-blue-800">Low</div>
                <div className="text-2xl font-bold text-blue-800">
                  {mockSeverityData.low}
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Account Status
            </h2>
            
            {user ? (
              <div className="space-y-4">
                <div className="rounded-md bg-secondary/10 p-4">
                  <div className="font-medium text-secondary">Pro Account</div>
                  <div className="mt-1 text-sm text-gray-600">
                    20 analyses remaining today
                  </div>
                </div>
                
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium">0/20</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-0 bg-secondary"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="font-medium text-amber-800">Free Account</div>
                  <div className="mt-1 text-sm text-amber-700">
                    Limited to 1 analysis only
                  </div>
                </div>
                
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center rounded-md border border-secondary bg-white px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/5"
                >
                  Sign In for Pro Access
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;