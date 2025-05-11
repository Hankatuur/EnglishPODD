// src/components/Debug/EnvCheck.jsx
export default function EnvCheck() {
    return (
      <div className="env-check">
        <h1>Environment Variables Verification</h1>
        <div>
          <strong>VITE_SUPABASE_URL:</strong> 
          {import.meta.env.VITE_SUPABASE_URL || 'NOT FOUND'}
        </div>
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong> 
          {import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) || 'NOT FOUND'}...
        </div>
      </div>
    );
  }