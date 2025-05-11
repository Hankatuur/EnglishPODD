import { useEffect } from 'react';
import { supabase } from '../Supabase/Supabase.js';

export default function TestConnection() {
  useEffect(() => {
    const test = async () => {
      console.log('Connection test started');
      
      // Test auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth test:', user || authError);

      // Test database
      const { data, error: dbError } = await supabase
        .from('courses')
        .select('id')
        .limit(1);
      console.log('Database test:', data || dbError);

      // Test storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('course-videos')
        .list();
      console.log('Storage test:', storageData || storageError);
    };

    test();
  }, []);

  return <div>Check browser console</div>;
}