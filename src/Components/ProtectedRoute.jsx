// ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase.js';
import { useToast } from '@chakra-ui/react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      if (adminOnly) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (!profile?.is_admin) {
          toast({
            title: 'Access Denied',
            description: 'Admin privileges required',
            status: 'error'
          });
          navigate('/');
        }
      }
    };

    checkAuth();
  }, [navigate, toast, adminOnly]);

  return children;
};

export default ProtectedRoute;