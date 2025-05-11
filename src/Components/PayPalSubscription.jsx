import React, { useEffect, useRef } from 'react';
import { supabase } from '../Supabase/Supabase.js';
import { useToast } from '@chakra-ui/react';

const PayPalSubscription = ({ courseId, price, planId, onSuccess }) => {
  const paypalRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    
    script.onload = () => {
      window.paypal.Buttons({
        style: { layout: 'vertical' },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
        onApprove: async (data) => {
          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            const { error } = await supabase
              .from('enrollments')
              .insert({
                user_id: user.id,
                course_id: courseId,
                subscription_id: data.subscriptionID,
                amount: price
              });

            if (error) throw error;
            onSuccess();
            toast({ title: 'Enrollment successful!', status: 'success' });
          } catch (error) {
            toast({ title: 'Payment failed', description: error.message, status: 'error' });
          }
        }
      }).render(paypalRef.current);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (paypalRef.current) paypalRef.current.innerHTML = '';
    };
  }, [courseId, planId, price]);

  return <div ref={paypalRef} />;
};

export default PayPalSubscription;