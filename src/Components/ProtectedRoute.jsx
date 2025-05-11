import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase.js';
import { useToast } from '@chakra-ui/react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);  // State to handle loading status

  useEffect(() => {
    const checkAuth = async () => {
      // Check the user authentication status from Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong while checking authentication.',
          status: 'error'
        });
        navigate('/');
        return;
      }

      if (!user) {
        // If no user is found, redirect to home
        navigate('/');
        return;
      }

      if (adminOnly) {
        // If adminOnly flag is set, we check for admin privileges
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError || !profile?.is_admin) {
          toast({
            title: 'Access Denied',
            description: 'Admin privileges required',
            status: 'error'
          });
          navigate('/');
        }
      }

      setLoading(false);  // Set loading to false once the auth check is complete
    };

    checkAuth();
  }, [navigate, toast, adminOnly]);

  if (loading) {
    // Render a loading screen or just return null until the authentication is checked
    return null;  // Or replace with a loading spinner if desired
  }

  // If the user is authorized, render the protected children
  return children;
};

export default ProtectedRoute;
































// ProtectedRoute.jsx
// not shwoing answer
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabase.js';
// import { useToast } from '@chakra-ui/react';

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const navigate = useNavigate();
//   const toast = useToast();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         navigate('/');
//         return;
//       }

//       if (adminOnly) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('is_admin')
//           .eq('id', user.id)
//           .single();

//         if (!profile?.is_admin) {
//           toast({
//             title: 'Access Denied',
//             description: 'Admin privileges required',
//             status: 'error'
//           });
//           navigate('/');
//         }
//       }
//     };

//     checkAuth();
//   }, [navigate, toast, adminOnly]);

//   return children;
// };

// export default ProtectedRoute;