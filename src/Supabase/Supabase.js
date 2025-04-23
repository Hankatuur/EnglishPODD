import { createClient } from '@supabase/supabase-js';

// Regular client for most operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Admin client for privileged operations (use cautiously!)
// const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
// export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
// console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);


// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
