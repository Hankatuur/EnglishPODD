// import { useState, useEffect } from 'react';
// import { supabase } from '../../Supabase/Supabase.js';

// const useEnrollment = (courseId) => {
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkEnrollment = async () => {
//       try {
//         setLoading(true);
//         const { data: { user }, error } = await supabase.auth.getUser();
//         if (error || !user || !courseId) return;

//         const { data } = await supabase
//           .from('enrollments')
//           .select('id')
//           .eq('user_id', user.id)
//           .eq('course_id', courseId)
//           .single();

//         setIsEnrolled(!!data);
//       } catch (error) {
//         console.error('Enrollment check error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkEnrollment();
//   }, [courseId]);

//   return { isEnrolled, loading };
// };

// export default useEnrollment;















// import { useState, useEffect } from 'react';
// import { supabase } from '../../Supabase/Supabase.js';

// const useEnrollment = (courseId) => {
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkEnrollment = async () => {
//       try {
//         const { data: { user }, error } = await supabase.auth.getUser();
//         if (error || !user) return;

//         const { data } = await supabase
//           .from('enrollments')
//           .select('id')
//           .eq('user_id', user.id)
//           .eq('course_id', courseId)
//           .single();

//         setIsEnrolled(!!data);
//       } catch (error) {
//         console.error('Enrollment check failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkEnrollment();
//   }, [courseId]);

//   return { isEnrolled, loading };
// };
// export const useNetworkStatus = () => {
//     const [isOnline, setIsOnline] = useState(navigator.onLine);
  
//     useEffect(() => {
//       const handleOnline = () => setIsOnline(true);
//       const handleOffline = () => setIsOnline(false);
  
//       window.addEventListener('online', handleOnline);
//       window.addEventListener('offline', handleOffline);
  
//       return () => {
//         window.removeEventListener('online', handleOnline);
//         window.removeEventListener('offline', handleOffline);
//       };
//     }, []);
  
//     return isOnline;
//   };

// export default useEnrollment;