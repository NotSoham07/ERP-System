import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ezeksrvxkpkdqbyfnbcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZWtzcnZ4a3BrZHFieWZuYmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2NTM3OTgsImV4cCI6MjAzNjIyOTc5OH0.5h9S4dOSsu0JcsMV6TPVwunPSw0CzZimIAi-B7DhPoY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
