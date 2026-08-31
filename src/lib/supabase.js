import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gkmrpmxskgvdjqqcnegf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbXJwbXhza2d2ZGpxcWNuZWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MjU4NDksImV4cCI6MjEwMjAwMTg0OX0.6oYsZptOQSoFfXnJK1f_zKk2C8LgbwypiqInzFz0uio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper for admin actions requiring service_role if needed
export const getServiceRoleKey = () => import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbXJwbXhza2d2ZGpxcWNuZWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQyNTg0OSwiZXhwIjoyMTAyMDAxODQ5fQ.Azb5x5a4AIo3HBhwBsnKh3gecJW3KlX2kdomC6Fh7Eo';

export const supabaseAdmin = createClient(supabaseUrl, getServiceRoleKey(), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: 'sb-admin-token-singleton',
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
});

export default supabase;

