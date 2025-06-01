import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload } from 'lucide-react';
import FileUploader from '../components/FileUploader';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileProcessed = (analysisId: string) => {
    setUploadComplete(true);
    // In a real app, this would navigate to the analysis page with the actual ID
    setTimeout(() => {
      navigate(`/analysis/${analysisId}`);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Upload Log Files</h1>
        <p className="mt-2 text-gray-600">
          Upload your log files for secure analysis. All data is automatically anonymized.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {uploadComplete ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Analysis Complete!</h2>
            <p className="mt-2 text-gray-600">
              Redirecting you to the analysis results...
            </p>
            <div className="mt-4 h-2 w-40 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full animate-pulse-slow bg-secondary"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Logs</h2>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your log files or click to browse. We support .log, .txt, .csv, .json, and .xml formats.
              </p>
            </div>
            
            <FileUploader onFileProcessed={handleFileProcessed} />
            
            <div className="mt-8 space-y-4 rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">
                How We Process Your Logs
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                    <Upload size={16} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-gray-900">Secure Upload</h4>
                  <p className="mt-1 text-xs text-gray-600">
                    Files are uploaded securely over HTTPS and stored temporarily
                  </p>
                </div>
                
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                    <Shield size={16} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-gray-900">Anonymization</h4>
                  <p className="mt-1 text-xs text-gray-600">
                    Sensitive data like IPs, usernames, and emails are automatically masked
                  </p>
                </div>
                
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                    <Shield size={16} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-gray-900">Multi-LLM Analysis</h4>
                  <p className="mt-1 text-xs text-gray-600">
                    Anonymized logs are analyzed by multiple AI models for comprehensive results
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;