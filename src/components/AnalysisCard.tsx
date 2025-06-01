import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import SeverityBadge from './SeverityBadge';
import { LogAnalysis } from '../lib/supabase';

interface AnalysisCardProps {
  analysis: LogAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="border-b border-gray-100 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-400" />
            <h3 className="text-base font-medium text-gray-900 line-clamp-1" title={analysis.filename}>
              {analysis.filename}
            </h3>
          </div>
          <SeverityBadge severity={analysis.severity} />
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={14} />
          <span>
            {format(new Date(analysis.analysis_date || analysis.upload_date), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {analysis.summary}
        </p>
        
        <div className="flex justify-end">
          <Link
            to={`/analysis/${analysis.id}`}
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80"
          >
            View Details
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;