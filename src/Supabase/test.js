import { useEffect } from 'react';
import { supabase } from '../Supabase/Supabase';

const SupabaseTest = () => {
  useEffect(() => {
    supabase.auth.signUp({
      email: 'test@example.com',
      password: 'Test123!'
    })
    .then(response => console.log('Signup Response:', response))
    .catch(error => console.error('Signup Error:', error));
  }, []);

  return <div>Check console for signup test results</div>;
};

export default SupabaseTest;