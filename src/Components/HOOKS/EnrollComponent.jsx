// import { useEffect, useState } from "react";
// import { Box, Alert, AlertIcon, Text } from "@chakra-ui/react";

// export default function EnrollComponent() {
//   const [configError, setConfigError] = useState("");

//   // Proper useEffect implementation
//   useEffect(() => {
//     const { errors } = validatePaypalConfig();
//     setConfigError(errors?.join(" • ") || "");
//   }, []); // Empty dependency array for mount-only execution

//   const validatePaypalConfig = () => {
//     const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
//     const errors = [];
    
//     if (!clientId) errors.push("Missing PayPal Client ID");
//     if (clientId && !/^(A[Z]|LIVE_)[0-9A-Z]{16,}$/i.test(clientId)) {
//       errors.push("Invalid Client ID format");
//     }
    
//     return { errors };
//   };

//   return (
//     <Box maxW="750px" p={4} borderWidth="1px" borderRadius="lg" bg="white">
//       {configError ? (
//         <Alert status="error" borderRadius="md">
//           <AlertIcon />
//           {configError}
//         </Alert>
//       ) : (
//         <>
//           <Text fontSize="xl" fontWeight="bold" mb={4}>
//             Complete Payment
//           </Text>
//           <Box mt={4} fontSize="sm" color="gray.600">
//             <Text>Payment Gateway: PayPal</Text>
//             <Text>Currency: USD</Text>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// }
























// EnrollComponent.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { Box, Heading, Button, Spinner, useToast } from '@chakra-ui/react';
// import { supabase } from '../../Supabase/Supabase.js';
// import PropTypes from 'prop-types';

// const EnrollComponent = ({ courseId, price, onSuccess }) => {
//   const toast = useToast();
//   const paypalRef = useRef(null);
//   const [processing, setProcessing] = useState(false);
//   const paypalInstance = useRef(null);

//   const handleEnrollment = async () => {
//     try {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) throw new Error('Authentication required');

//       const { error: dbError } = await supabase
//         .from('enrollments')
//         .upsert({
//           user_id: user.id,
//           course_id: courseId,
//           access_level: price > 0 ? 'paid' : 'free',
//           expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//         });

//       if (dbError) throw dbError;
//       onSuccess();
//       toast({ title: 'Enrollment successful!', status: 'success' });
//     } catch (error) {
//       toast({ title: 'Enrollment failed', description: error.message, status: 'error' });
//     }
//   };

//   useEffect(() => {
//     if (!courseId || price <= 0) return;

//     const script = document.createElement('script');
//     script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    
//     script.onload = () => {
//       paypalInstance.current = window.paypal.Buttons({
//         createOrder: (_, actions) => actions.order.create({
//           purchase_units: [{
//             amount: { value: price },
//             custom_id: courseId
//           }]
//         }),
//         onApprove: async (_, actions) => {
//           setProcessing(true);
//           try {
//             await actions.order.capture();
//             await handleEnrollment();
//           } catch (error) {
//             toast({ title: 'Payment failed', description: error.message, status: 'error' });
//           }
//           setProcessing(false);
//         }
//       });
      
//       if (paypalRef.current) {
//         paypalInstance.current.render(paypalRef.current);
//       }
//     };

//     document.body.appendChild(script);

//     return () => {
//       paypalInstance.current?.close();
//       document.body.removeChild(script);
//     };
//   }, [courseId, price, toast]);

//   return (
//     <Box textAlign="center" p={6} borderWidth={1} borderRadius="lg" mb={8}>
//       <Heading size="lg" mb={4}>
//         {price > 0 ? `Enroll for $${price}` : 'Start Learning'}
//       </Heading>

//       {price > 0 ? (
//         <div ref={paypalRef} />
//       ) : (
//         <Button
//           colorScheme="green"
//           size="lg"
//           onClick={handleEnrollment}
//           isLoading={processing}
//         >
//           Enroll Now
//         </Button>
//       )}

//       {processing && <Spinner size="sm" ml={3} />}
//     </Box>
//   );
// };

// EnrollComponent.propTypes = {
//   courseId: PropTypes.string.isRequired,
//   price: PropTypes.number.isRequired,
//   onSuccess: PropTypes.func.isRequired
// };

// export default EnrollComponent;

















// works but not fetching 
// import React, { useEffect, useRef, useState } from 'react';
// import { Box, Heading, Button, Spinner, useToast } from '@chakra-ui/react';
// import { supabase } from '../../Supabase/Supabase.js';
// import PropTypes from 'prop-types';

// const EnrollComponent = ({ courseId, price, onSuccess }) => {
//   const toast = useToast();
//   const paypalRef = useRef(null);
//   const [processing, setProcessing] = useState(false);
//   const paypalInstance = useRef(null);

//   const handleEnrollment = async () => {
//     try {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) throw new Error('Authentication required');

//       const { error: dbError } = await supabase
//         .from('enrollments')
//         .upsert({
//           user_id: user.id,
//           course_id: courseId,
//           access_level: price > 0 ? 'paid' : 'free',
//           expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
//         });

//       if (dbError) throw dbError;
//       onSuccess();
//       toast({ title: 'Enrollment successful!', status: 'success' });
//     } catch (error) {
//       toast({ title: 'Enrollment failed', description: error.message, status: 'error' });
//     }
//   };

//   useEffect(() => {
//     if (price <= 0 || !courseId) return;

//     const script = document.createElement('script');
//     script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    
//     script.onload = () => {
//       paypalInstance.current = window.paypal.Buttons({
//         createOrder: (_, actions) => actions.order.create({
//           purchase_units: [{
//             amount: { value: price },
//             custom_id: courseId
//           }]
//         }),
//         onApprove: async (_, actions) => {
//           setProcessing(true);
//           try {
//             await actions.order.capture();
//             await handleEnrollment();
//           } catch (error) {
//             toast({ title: 'Payment processing failed', description: error.message, status: 'error' });
//           }
//           setProcessing(false);
//         }
//       });
      
//       if (paypalRef.current) {
//         paypalInstance.current.render(paypalRef.current);
//       }
//     };

//     document.body.appendChild(script);

//     return () => {
//       if (paypalInstance.current) {
//         paypalInstance.current.close();
//         paypalInstance.current = null;
//       }
//       document.body.removeChild(script);
//     };
//   }, [courseId, price]);

//   return (
//     <Box textAlign="center" p={6} borderWidth={1} borderRadius="lg" mb={8}>
//       <Heading size="lg" mb={4}>
//         {price > 0 ? `Enroll for $${price}` : 'Start Learning'}
//       </Heading>

//       {price > 0 ? (
//         <div ref={paypalRef} />
//       ) : (
//         <Button
//           colorScheme="green"
//           size="lg"
//           onClick={handleEnrollment}
//           isLoading={processing}
//         >
//           Enroll Now
//         </Button>
//       )}

//       {processing && <Spinner size="sm" ml={3} />}
//     </Box>
//   );
// };

// EnrollComponent.propTypes = {
//   courseId: PropTypes.string.isRequired,
//   price: PropTypes.number.isRequired,
//   onSuccess: PropTypes.func.isRequired
// };

// export default EnrollComponent;





































// Working but refusing course id
// import React, { useEffect, useRef, useState } from 'react';
// import { Box, Heading, Button, Spinner, useToast } from '@chakra-ui/react';
// import { supabase } from '../../Supabase/Supabase.js';
// import PropTypes from 'prop-types';

// const EnrollComponent = ({ courseId, price }) => {
//   const toast = useToast();
//   const paypalRef = useRef(null);
//   const [processing, setProcessing] = useState(false);

//   const handleFreeEnrollment = async () => {
//     try {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) throw new Error('Authentication required');

//       const { error: enrollError } = await supabase
//         .from('enrollments')
//         .insert({ 
//           user_id: user.id, 
//           course_id: courseId,
//           access_level: 'free'
//         });

//       if (enrollError) throw enrollError;
//       window.location.reload(); // Refresh to show materials
//     } catch (error) {
//       toast({ title: 'Enrollment failed', description: error.message, status: 'error' });
//     }
//   };

//   // PayPal integration for paid courses
//   useEffect(() => {
//     if (price <= 0) return;

//     const script = document.createElement('script');
//     script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    
//     script.onload = () => {
//       window.paypal.Buttons({
//         createOrder: (_, actions) => actions.order.create({
//           purchase_units: [{ amount: { value: price } }]
//         }),
//         onApprove: async (_, actions) => {
//           setProcessing(true);
//           try {
//             await actions.order.capture();
//             await handleFreeEnrollment(); // Reuse enrollment logic
//           } catch (error) {
//             toast({ title: 'Payment failed', description: error.message, status: 'error' });
//           }
//           setProcessing(false);
//         }
//       }).render(paypalRef.current);
//     };

//     document.body.appendChild(script);
//     return () => document.body.removeChild(script);
//   }, [price]);

//   return (
//     <Box textAlign="center" p={6} borderWidth={1} borderRadius="lg" mb={8}>
//       <Heading size="lg" mb={4}>
//         {price > 0 ? `Enroll in Course - $${price}` : 'Get Started'}
//       </Heading>

//       {price > 0 ? (
//         <div ref={paypalRef} />
//       ) : (
//         <Button
//           colorScheme="green"
//           size="lg"
//           onClick={handleFreeEnrollment}
//           isLoading={processing}
//         >
//           Enroll for Free
//         </Button>
//       )}

//       {processing && <Spinner size="sm" ml={3} />}
//     </Box>
//   );
// };

// EnrollComponent.propTypes = {
//   courseId: PropTypes.string.isRequired,
//   price: PropTypes.number.isRequired
// };

// export default EnrollComponent;