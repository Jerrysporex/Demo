import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, Check, FileText, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getRemainingAnalysisCount, incrementAnalysisCount } from '../lib/supabase';

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_FORMATS = ['.log', '.txt', '.csv', '.json', '.xml'];

interface FileUploaderProps {
  onFileProcessed: (analysisId: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [anonymizing, setAnonymizing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter files by allowed formats and size
    const validFiles = acceptedFiles.filter(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidFormat = ALLOWED_FORMATS.includes(fileExtension);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      
      if (!isValidFormat) {
        toast.error(`File type not supported: ${file.name}`);
      }
      
      if (!isValidSize) {
        toast.error(`File too large (max 50MB): ${file.name}`);
      }
      
      return isValidFormat && isValidSize;
    });
    
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.log', '.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one log file');
      return;
    }

    // Check if user has reached their analysis limit
    if (user) {
      const remainingCount = await getRemainingAnalysisCount(user.id);
      if (remainingCount <= 0) {
        toast.error('You have reached your daily analysis limit');
        return;
      }
    } else {
      // Anonymous users get 1 analysis
      // In a real app, we'd use cookies or local storage to track this
      const hasUsedFreeAnalysis = localStorage.getItem('hasUsedFreeAnalysis') === 'true';
      if (hasUsedFreeAnalysis) {
        toast.error('You have used your free analysis. Please sign in for more.');
        return;
      }
    }

    try {
      // Start upload
      setUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate upload completion after a delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploading(false);
        
        // Start anonymization
        setAnonymizing(true);
        
        // Simulate anonymization completion after a delay
        setTimeout(() => {
          setAnonymizing(false);
          
          // Start analysis
          setAnalyzing(true);
          
          // Simulate analysis completion after a delay
          setTimeout(() => {
            setAnalyzing(false);
            
            // Mock analysis ID
            const mockAnalysisId = `analysis-${Date.now()}`;
            
            // Track usage
            if (user) {
              incrementAnalysisCount(user.id);
            } else {
              localStorage.setItem('hasUsedFreeAnalysis', 'true');
            }
            
            // Notify parent component of completion
            onFileProcessed(mockAnalysisId);
            
            // Reset state
            setFiles([]);
            setUploadProgress(0);
            
            toast.success('Analysis complete!');
          }, 3000);
        }, 2000);
      }, 2000);
    } catch (error) {
      toast.error('An error occurred during processing');
      setUploading(false);
      setAnonymizing(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragActive
            ? 'border-secondary bg-secondary/5'
            : 'border-gray-300 hover:border-secondary/50 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload 
            className={`h-10 w-10 ${isDragActive ? 'text-secondary' : 'text-gray-400'}`} 
          />
          
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-700">
              {isDragActive ? 'Drop files here' : 'Drag & drop log files here'}
            </p>
            
            <p className="text-sm text-gray-500">
              or <span className="text-secondary">browse files</span>
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            Supported formats: .log, .txt, .csv, .json, .xml (max 50MB)
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Files to analyze ({files.length})</h4>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          
          <ul className="max-h-60 space-y-2 overflow-y-auto">
            {files.map((file, index) => (
              <li 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 text-gray-500" />
                  <span className="mr-2 max-w-[200px] truncate text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading || anonymizing || analyzing}
                >
                  <XCircle size={16} />
                </button>
              </li>
            ))}
          </ul>
          
          {(uploading || anonymizing || analyzing) ? (
            <div className="space-y-2">
              {uploading && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-secondary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {anonymizing && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <div className="h-4 w-4 animate-pulse-slow rounded-full bg-amber-500"></div>
                  <span>Anonymizing sensitive data...</span>
                </div>
              )}
              
              {analyzing && (
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Running analysis with multiple LLMs...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={processFiles}
                className="btn btn-primary"
                disabled={files.length === 0}
              >
                Analyze Logs
              </button>
            </div>
          )}
        </div>
      )}

      {/* Usage limit indicator */}
      {user ? (
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm">
          <span>
            <span className="font-medium text-secondary">Pro Account</span>
            {' - '}
            <span className="text-gray-600">20 analyses per day</span>
          </span>
          <Check size={16} className="text-success" />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-md bg-amber-50 p-3 text-sm">
          <span>
            <AlertCircle size={16} className="mr-1 inline text-amber-500" />
            <span className="text-amber-800">
              Free user: 1 analysis only. <a href="/login" className="font-medium underline">Sign in</a> for 20/day.
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;