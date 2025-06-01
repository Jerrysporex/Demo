import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface AnalysisFilterProps {
  onSearchChange: (query: string) => void;
  onSeverityChange: (severity: string | null) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

const AnalysisFilter: React.FC<AnalysisFilterProps> = ({
  onSearchChange,
  onSeverityChange,
  onDateRangeChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleSeverityChange = (severity: string | null) => {
    setSelectedSeverity(severity);
    onSeverityChange(severity);
  };

  const handleDateChange = () => {
    onDateRangeChange({
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null,
    });
  };

  const clearFilters = () => {
    setSelectedSeverity(null);
    setStartDate('');
    setEndDate('');
    onSeverityChange(null);
    onDateRangeChange({ start: null, end: null });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search by filename or content..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter size={18} />
          Filters
          <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isFilterOpen && (
        <div className="animate-fade-in rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Severity
              </label>
              <div className="flex flex-wrap gap-2">
                {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => handleSeverityChange(
                      selectedSeverity === severity ? null : severity
                    )}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedSeverity === severity
                        ? `bg-${severity.toLowerCase()} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: 
                        selectedSeverity === severity 
                          ? severity === 'Critical' 
                            ? 'rgb(220, 38, 38)' 
                            : severity === 'High' 
                              ? 'rgb(249, 115, 22)' 
                              : severity === 'Medium' 
                                ? 'rgb(234, 179, 8)' 
                                : 'rgb(59, 130, 246)'
                          : '',
                    }}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value) handleDateChange();
                }}
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                className="input"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (e.target.value) handleDateChange();
                }}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisFilter;