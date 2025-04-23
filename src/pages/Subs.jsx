import React, { useEffect } from 'react';
import { Box, Heading, Spinner, useToast } from '@chakra-ui/react';

const Subs = () => {
  const toast = useToast();
  const clientId = import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID;

  useEffect(() => {
    const loadPayPalScript = () => {
      if (document.getElementById('paypal-sdk')) return;

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&vault=true&intent=subscription`;
      script.id = 'paypal-sdk';
      script.async = true;
      script.onload = renderPayPalButtons;
      document.body.appendChild(script);
    };

    const renderPayPalButtons = () => {
      if (!window.paypal) {
        toast({
          title: 'PayPal SDK Failed',
          description: 'Could not load PayPal buttons.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'subscribe',
        },
        createSubscription: () => {
          toast({
            title: 'Plan ID not set',
            description: 'Add a plan_id to enable subscriptions.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          });
          return '';
        },
        onApprove: ({ subscriptionID }) => {
          toast({
            title: 'Subscription Approved!',
            description: `Subscription ID: ${subscriptionID}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
        onError: (err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        },
      }).render('#paypal-button-container');
    };

    loadPayPalScript();
  }, [clientId, toast]);

  return (
    <Box p={4} maxW="lg" mx="auto" textAlign="center">
      <Heading size="md" mb={4}>
        Subscribe to Unlock Full Access
      </Heading>
      <div id="paypal-button-container">
        <Spinner size="lg" />
      </div>
    </Box>
  );
};

export default Subs;


































// did'nt add my Client id from paypal
// import React, { useState } from 'react';
// import {
//   Box,
//   Heading,
//   Text,
//   Button,
//   Flex,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// import { supabase } from '../Supabase/Supabse';

// const Subs = () => {
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleSubscriptionSuccess = async (details) => {
//     setIsProcessing(true);

//     try {
//       // Save subscription details to Supabase
//       const { error } = await supabase.from('enrollment').insert({
//         user_id: details.payer.id,
//         subscription_status: 'active',
//       });

//       if (error) {
//         throw new Error('Failed to save subscription details.');
//       }

//       alert('Subscription successful! You now have access to all content.');
//       setIsProcessing(false);
//     } catch (error) {
//       console.error('Subscription error:', error);
//       alert('Subscription failed. Please try again.');
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Box p={4} bg={useColorModeValue('white', 'gray.800')}>
//       <Heading as="h1" size="xl" mb={4}>
//         Subscribe to Unlock All Content
//       </Heading>
//       <Text fontSize="lg" mb={6}>
//         Subscribe for $8/month to gain full access to all courses and exercises.
//       </Text>

//       {/* Wrap with PayPalScriptProvider */}
//       <PayPalScriptProvider
//         options={{
//           clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal client ID
//           currency: 'USD',
//         }}
//       >
//         <PayPalButtons
//           createOrder={(data, actions) => {
//             return actions.order.create({
//               purchase_units: [
//                 {
//                   amount: {
//                     value: '8.00',
//                   },
//                 },
//               ],
//             });
//           }}
//           onApprove={async (data, actions) => {
//             const order = await actions.order.capture();
//             handleSubscriptionSuccess(order.payer);
//           }}
//           onError={(err) => {
//             console.error('PayPal error:', err);
//             alert('Subscription failed. Please try again.');
//           }}
//         />
//       </PayPalScriptProvider>

//       {isProcessing && (
//         <Flex align="center" justify="center" mt={4}>
//           <Spinner size="xl" />
//           <Text ml={2}>Processing your subscription...</Text>
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default Subs;