import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import SeverityChart from '../components/SeverityChart';
import ExportToPDF from '../components/ExportToPDF';
import { LogAnalysis, AnalysisDetail } from '../lib/supabase';

// Mock data for analysis details
const mockAnalysisDetails: Record<string, { analysis: LogAnalysis; details: AnalysisDetail }> = {
  '1': {
    analysis: {
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
    details: {
      id: 'detail-1',
      analysis_id: '1',
      findings: {
        security_threats: [
          {
            type: 'Brute Force Attack',
            confidence: 'High',
            description: 'Multiple failed login attempts from the same IP address targeting the admin account'
          },
          {
            type: 'Suspicious Activity',
            confidence: 'Medium',
            description: 'Login attempts outside normal business hours'
          }
        ],
        affected_services: ['Authentication System', 'Admin Portal'],
        recommended_actions: [
          'Block the IP address 192.168.1.xxx temporarily',
          'Enable account lockout after multiple failed attempts',
          'Enable multi-factor authentication for admin accounts',
          'Review access control policies'
        ]
      },
      raw_response: 'Full LLM response data would be here',
      suspicious_entries: [
        {
          line_number: 42,
          content: '192.168.1.xxx - - [15/Sep/2023:03:12:35 +0000] "POST /admin/login HTTP/1.1" 401 285',
          reason: 'Failed login attempt to admin portal'
        },
        {
          line_number: 43,
          content: '192.168.1.xxx - - [15/Sep/2023:03:12:48 +0000] "POST /admin/login HTTP/1.1" 401 285',
          reason: 'Failed login attempt to admin portal'
        },
        {
          line_number: 44,
          content: '192.168.1.xxx - - [15/Sep/2023:03:13:02 +0000] "POST /admin/login HTTP/1.1" 401 285',
          reason: 'Failed login attempt to admin portal'
        },
        {
          line_number: 45,
          content: '192.168.1.xxx - - [15/Sep/2023:03:13:15 +0000] "POST /admin/login HTTP/1.1" 401 285',
          reason: 'Failed login attempt to admin portal'
        },
        {
          line_number: 46,
          content: '192.168.1.xxx - - [15/Sep/2023:03:13:30 +0000] "POST /admin/login HTTP/1.1" 401 285',
          reason: 'Failed login attempt to admin portal'
        }
      ]
    }
  },
  '2': {
    analysis: {
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
    details: {
      id: 'detail-2',
      analysis_id: '2',
      findings: {
        security_threats: [
          {
            type: 'Data Exfiltration',
            confidence: 'High',
            description: 'Unusual outbound traffic to known malicious IP addresses'
          },
          {
            type: 'Malware Communication',
            confidence: 'High',
            description: 'Communication patterns consistent with command and control servers'
          }
        ],
        affected_services: ['File Server', 'Database Server'],
        recommended_actions: [
          'Block outbound traffic to the identified IP addresses immediately',
          'Isolate affected servers from the network',
          'Perform full malware scan on affected systems',
          'Review recent changes to system configurations',
          'Check for unauthorized software installations'
        ]
      },
      raw_response: 'Full LLM response data would be here',
      suspicious_entries: [
        {
          line_number: 128,
          content: 'Sep 14 21:34:12 firewall kernel: [15432] OUTBOUND TRAFFIC: IN=eth0 OUT=eth1 SRC=10.0.0.xxx DST=185.176.27.xxx LEN=64 TOS=0x00 PREC=0x00 TTL=64 ID=12345 PROTO=TCP SPT=49321 DPT=443 SEQ=1234567890 ACK=0 WINDOW=65535 SYN URGP=0',
          reason: 'Outbound traffic to known malicious IP'
        },
        {
          line_number: 156,
          content: 'Sep 14 21:36:45 firewall kernel: [15489] OUTBOUND TRAFFIC: IN=eth0 OUT=eth1 SRC=10.0.0.xxx DST=185.176.27.xxx LEN=1024 TOS=0x00 PREC=0x00 TTL=64 ID=12346 PROTO=TCP SPT=49321 DPT=443 SEQ=1234567990 ACK=1 WINDOW=65535 URGP=0',
          reason: 'Large data transfer to known malicious IP'
        },
        {
          line_number: 189,
          content: 'Sep 14 21:42:18 firewall kernel: [15542] OUTBOUND TRAFFIC: IN=eth0 OUT=eth1 SRC=10.0.0.xxx DST=103.94.27.xxx LEN=512 TOS=0x00 PREC=0x00 TTL=64 ID=12378 PROTO=TCP SPT=49325 DPT=8080 SEQ=1234570000 ACK=0 WINDOW=65535 SYN URGP=0',
          reason: 'Connection attempt to secondary malicious IP'
        }
      ]
    }
  }
};

// For mock data, handle any analysis ID
for (let i = 3; i <= 10; i++) {
  mockAnalysisDetails[i.toString()] = {
    analysis: {
      id: i.toString(),
      user_id: 'user-1',
      filename: `log-file-${i}.log`,
      file_size: 1000000 + i * 100000,
      file_type: '.log',
      upload_date: new Date(Date.now() - i * 86400000).toISOString(),
      analysis_date: new Date(Date.now() - i * 86400000).toISOString(),
      llm_provider: i % 2 === 0 ? 'Claude Opus 4' : 'Abacus.AI',
      severity: i % 4 === 0 ? 'Critical' : i % 4 === 1 ? 'High' : i % 4 === 2 ? 'Medium' : 'Low',
      summary: `This is a mock analysis summary for log file ${i}. It contains various security findings and recommendations.`,
      anonymized: true,
      analysis_complete: true,
    },
    details: {
      id: `detail-${i}`,
      analysis_id: i.toString(),
      findings: {
        security_threats: [
          {
            type: 'Generic Threat',
            confidence: 'Medium',
            description: `Security threat description for log file ${i}`
          }
        ],
        affected_services: ['Generic Service'],
        recommended_actions: [
          'Generic recommendation 1',
          'Generic recommendation 2'
        ]
      },
      raw_response: 'Full LLM response data would be here',
      suspicious_entries: [
        {
          line_number: 42,
          content: `Log entry for file ${i}`,
          reason: 'Generic reason'
        }
      ]
    }
  };
}

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysisData, setAnalysisData] = useState<{
    analysis: LogAnalysis;
    details: AnalysisDetail;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'suspicious' | 'recommendations'>('overview');

  // Mock severity data for the chart
  const mockSeverityData = {
    critical: id === '2' ? 2 : 0,
    high: id === '1' ? 3 : 1,
    medium: 2,
    low: 1,
  };

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (id && mockAnalysisDetails[id]) {
        setAnalysisData(mockAnalysisDetails[id]);
      } else {
        // If ID doesn't exist in our mock data, use a default
        setAnalysisData(mockAnalysisDetails['1']);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-semibold text-gray-900">Analysis Not Found</h2>
        <p className="mt-2 text-gray-600">The requested analysis could not be found</p>
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, details } = analysisData;

  return (
    <div id="analysis-report" className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/history"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to History
            </Link>
          </div>
          
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Analysis Results
          </h1>
        </div>
        
        <ExportToPDF elementId="analysis-report" filename={`analysis-${analysis.filename}`} />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">{analysis.filename}</h2>
                <SeverityBadge severity={analysis.severity} size="lg" />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {format(new Date(analysis.analysis_date || analysis.upload_date), 'PPP')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>
                    Size: {(analysis.file_size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>
                    Analyzed by: {analysis.llm_provider}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex min-w-[120px] items-center justify-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            
            <button
              onClick={() => setActiveTab('suspicious')}
              className={`flex min-w-[120px] items-center justify-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === 'suspicious'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Suspicious Entries
            </button>
            
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex min-w-[120px] items-center justify-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === 'recommendations'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Recommendations
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Summary
                </h3>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Security Threats Detected
                  </h3>
                  
                  <div className="space-y-3">
                    {details.findings.security_threats.map((threat, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{threat.type}</h4>
                          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                            {threat.confidence} Confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{threat.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="mb-2 mt-6 text-lg font-medium text-gray-900">
                    Affected Services
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {details.findings.affected_services.map((service, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <SeverityChart data={mockSeverityData} />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'suspicious' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Suspicious Log Entries
              </h3>
              
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
                        <th className="px-6 py-3">Line</th>
                        <th className="px-6 py-3">Content</th>
                        <th className="px-6 py-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {details.suspicious_entries.map((entry, index) => (
                        <tr
                          key={index}
                          className="bg-white hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {entry.line_number}
                          </td>
                          <td className="max-w-md px-6 py-4 text-sm text-gray-500">
                            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
                              {entry.content}
                            </code>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {entry.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recommended Actions
              </h3>
              
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <ul className="ml-6 list-disc space-y-2">
                  {details.findings.recommended_actions.map((action, index) => (
                    <li key={index} className="text-gray-700">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  <h4 className="font-medium">Important Notes</h4>
                </div>
                <p className="mt-2 text-sm">
                  These recommendations are based on AI analysis and should be reviewed by security professionals. The severity levels provided are estimates based on the available log data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;