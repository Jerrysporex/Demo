import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a production environment, these values would be stored in environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
  usage_count: number;
};

export type LogAnalysis = {
  id: string;
  user_id: string | null;
  filename: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  analysis_date: string | null;
  llm_provider: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  summary: string;
  anonymized: boolean;
  analysis_complete: boolean;
};

export type AnalysisDetail = {
  id: string;
  analysis_id: string;
  findings: Record<string, any>;
  raw_response: string;
  suspicious_entries: Array<{
    line_number: number;
    content: string;
    reason: string;
  }>;
};

// Function to get user's remaining analysis count
export const getRemainingAnalysisCount = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('users')
    .select('usage_count')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user usage:', error);
    return 0;
  }

  // Free users get 1, logged-in users get 20 per day
  return data ? 20 - (data.usage_count || 0) : 0;
};

// Function to increment user's analysis count
export const incrementAnalysisCount = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ usage_count: supabase.rpc('increment_usage_count', {}) })
    .eq('id', userId);

  if (error) {
    console.error('Error incrementing usage count:', error);
  }
};

// Reset usage count daily (would be implemented as a Supabase Edge Function or cron job)