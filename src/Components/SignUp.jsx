// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, FormControl, FormLabel, Input, Button,
  useToast, useColorMode, Text, Flex,
  InputGroup, InputRightElement, IconButton, Link
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../Supabase/Supabase.js';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = form;

    const errors = {
      name: !name,
      email: !emailRegex.test(email),
      password: !passwordRegex.test(password),
      confirm: password !== confirmPassword
    };

    if (Object.values(errors).some(Boolean)) {
      if (errors.name) showToast('Full name is required');
      if (errors.email) showToast('Valid email required');
      if (errors.password) showToast('Password must have 6 characters, 1 uppercase, and 1 symbol');
      if (errors.confirm) showToast('Passwords must match');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/confirm`
        }
      });

      if (error || !data.user) throw error || new Error('No user created');
      toast({
        title: 'Verify Email',
        description: 'Check your inbox for confirmation link',
        status: 'success',
        duration: 8000,
        position: 'top',
      });
      navigate('/confirm', { state: { email } });
    } catch (err) {
      showToast(err.message.replace('AuthApiError: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    toast({
      title: 'Error',
      description: msg,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} boxShadow="xl" borderRadius="md">
      <Text mb={6} textAlign="center" fontSize="xl" fontWeight="bold">Create Account</Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
        </FormControl>

        <FormControl id="email" mt={4} isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
        </FormControl>

        <FormControl id="password" mt={4} isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                aria-label="Toggle Password"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmPassword" mt={4} isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                aria-label="Toggle Confirm Password"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          mt={6}
          w="full"
          size="lg"
          isLoading={loading}
          loadingText="Creating Account..."
          bg={colorMode === 'dark' ? 'teal.500' : 'orange.400'}
          _hover={{
            boxShadow: colorMode === 'dark' ? '0 0 10px teal' : '0 0 10px orange'
          }}
          color="white"
        >
          Sign Up
        </Button>

        <Flex mt={4} justifyContent="center">
          <Text>Already have an account?</Text>
          <Link as={RouterLink} to="/Log-In" ml={2}>
            <Button
              variant="link"
              size="sm"
              color={colorMode === 'dark' ? 'teal.300' : 'orange.400'}
              _hover={{
                textDecoration: 'none',
                boxShadow: colorMode === 'dark' ? '0 0 10px teal' : '0 0 10px orange'
              }}
            >
              Log In
            </Button>
          </Link>
        </Flex>
      </form>
    </Box>
  );
};

export default SignUp;
































































// working but link to log in is not working
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton,
//   Link
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabase.js';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation checks
//     const errors = {
//       name: !name,
//       email: !emailRegex.test(email),
//       password: !passwordRegex.test(password),
//       confirm: password !== confirmPassword
//     };

//     if (Object.values(errors).some(Boolean)) {
//       showValidationErrors(errors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { full_name: name },
//           emailRedirectTo: `${window.location.origin}/confirm`
//         }
//       });

//       if (error) throw error;

//       // Check if user was actually created
//       if (!data.user) {
//         throw new Error('User creation failed - no user data returned');
//       }

//       showSuccessToast();
//       navigate('/confirm', { state: { email } });

//     } catch (error) {
//       handleSignupError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showValidationErrors = (errors) => {
//     if (errors.name) showErrorToast('Full name is required');
//     if (errors.email) showErrorToast('Valid email required');
//     if (errors.password) showPasswordErrorToast();
//     if (errors.confirm) showErrorToast('Passwords must match');
//   };

//   const handleSignupError = (error) => {
//     const errorMessages = {
//       'User already registered': 'Email already in use',
//       'duplicate key value violates unique constraint': 'Account exists',
//       'Database error saving new user': 'Profile creation failed'
//     };

//     const message = errorMessages[error.message] || 
//       error.message.replace('AuthApiError: ', '');
//     showErrorToast(message);
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 5000,
//       isClosable: true,
//     });
//   };

//   const showPasswordErrorToast = () => {
//     toast({
//       title: 'Invalid Password',
//       status: 'error',
//       duration: 5000,
//       render: () => (
//         <Box color="white" p={3} bg="red.500" borderRadius="md">
//           <Text fontWeight="bold">Password Requirements:</Text>
//           <Text>• Minimum 6 characters</Text>
//           <Text>• 1 uppercase letter</Text>
//           <Text>• 1 symbol (!@#$%^&* etc.)</Text>
//         </Box>
//       ),
//     });
//   };

//   const showSuccessToast = () => {
//     toast({
//       title: 'Verify Email',
//       description: 'Check your inbox for confirmation link',
//       status: 'success',
//       duration: 8000,
//       position: 'top',
//     });
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <Text mb={6} textAlign="center" fontSize="xl" fontWeight="bold">
//         Create Account
//       </Text>

//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Full Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="John Doe"
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email Address</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="john@example.com"
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           size="lg"
//           isLoading={loading}
//           loadingText="Creating Account..."
//         >
//           Sign Up
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already have an account? </Text>
//           <Link to="/Log-In">
//             <Button variant="link" colorScheme="orange" ml={2}>
//               Log In
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton,
//   Link
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation checks
//     if (!name || !email || !password || !confirmPassword) {
//       showErrorToast('All fields are required');
//       setLoading(false);
//       return;
//     }

//     if (!emailRegex.test(email)) {
//       showErrorToast('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//       showPasswordErrorToast();
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       showErrorToast('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { full_name: name },
//           emailRedirectTo: `${window.location.origin}/confirm`
//         }
//       });
//       console.log(error);

//       if (error) throw error;

//       showSuccessToast();
//       setTimeout(() => navigate('/confirm', { state: { email } }), 2000);
//     } catch (error) {
//       showErrorToast(error.message || 'Signup failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 3000,
//     });
//   };

//   const showSuccessToast = () => {
//     toast({
//       title: 'Verify your email!',
//       description: 'Check your inbox for confirmation link',
//       status: 'success',
//       duration: 5000,
//       render: () => (
//         <Box 
//           color="white" 
//           p={3} 
//           bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} 
//           borderRadius="md"
//         >
//           <Text fontWeight="bold">Verification Email Sent!</Text>
//           <Text>Check your inbox for confirmation link</Text>
//         </Box>
//       ),
//     });
//   };

//   const showPasswordErrorToast = () => {
//     toast({
//       title: 'Invalid Password',
//       status: 'error',
//       duration: 5000,
//       render: () => (
//         <Box color="white" p={3} bg="red.500" borderRadius="md">
//           <Text fontWeight="bold">Password Requirements:</Text>
//           <Text>• Minimum 6 characters</Text>
//           <Text>• At least one uppercase letter</Text>
//           <Text>• At least one symbol (!@#$%^&* etc.)</Text>
//         </Box>
//       ),
//     });
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Full Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="John Doe"
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email Address</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="john@example.com"
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//               />
//             </InputRightElement>
//           </InputGroup>
//           <Text fontSize="sm" mt={2} color="gray.500">
//             Password must contain:
//             <br/>• 6+ characters
//             <br/>• 1 uppercase letter
//             <br/>• 1 symbol (!@#$%^&* etc.)
//           </Text>
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           size="lg"
//           isLoading={loading}
//         >
//           Create Account
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already registered? </Text>
//           <Link to="/Log-In">
//             <Button variant="link" colorScheme="orange" ml={2}>
//               Sign In Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;

































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton,
//   Link
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js'; // Adjusted import path

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!name || !email || !password || !confirmPassword) {
//       showErrorToast('All fields are required');
//       setLoading(false);
//       return;
//     }

//     if (!email.includes('@') || !email.split('@')[1].includes('.')) {
//       showErrorToast('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//       toast({
//         title: 'Invalid Password',
//         status: 'error',
//         duration: 5000,
//         render: () => (
//           <Box color="white" p={3} bg="red.500" borderRadius="md">
//             <Text fontWeight="bold">Password Requirements:</Text>
//             <Text>• Minimum 6 characters</Text>
//             <Text>• At least one uppercase letter</Text>
//             <Text>• At least one symbol (!@#$%^&* etc.)</Text>
//           </Box>
//         ),
//       });
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       showErrorToast('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: name
//           }
//         }
//       });

//       if (error) throw error;

//       toast({
//         title: 'Verify your email!',
//         description: 'Check your inbox for confirmation link',
//         status: 'success',
//         duration: 5000,
//         render: ({ title, description }) => (
//           <Box color="white" p={3} bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} borderRadius="md">
//             <Text fontWeight="bold">{title}</Text>
//             <Text>{description}</Text>
//           </Box>
//         ),
//       });
      
//       setTimeout(() => navigate('/Log-In'), 2000);
//     } catch (error) {
//       showErrorToast(error.message || 'Signup failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 3000,
//     });
//   };

//   const hoverStyle = {
//     boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Full Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="John Doe"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email Address</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="john@example.com"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//           <Text fontSize="sm" mt={2} color="gray.500">
//             Password must contain:
//             <br/>• 6+ characters
//             <br/>• 1 uppercase letter
//             <br/>• 1 symbol (!@#$%^&* etc.)
//           </Text>
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           size="lg"
//           isLoading={loading}
//           _hover={{
//             transform: 'scale(1.02)',
//             boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//           }}
//           transition="all 0.2s"
//         >
//           Create Account
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already registered? </Text>
//           <Link to="/Log-In">
//             <Button
//               variant="link"
//               colorScheme="orange"
//               ml={2}
//               fontWeight="bold"
//             >
//               Sign In Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;
























// SignUp.jsx
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || !confirmPassword) {
//       showErrorToast('All fields are required');
//       return;
//     }

//     if (!email.includes('@') || !email.split('@')[1].includes('.')) {
//       showErrorToast('Please enter a valid email address');
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//       toast({
//         title: 'Invalid Password',
//         status: 'error',
//         duration: 5000,
//         render: () => (
//           <Box color="white" p={3} bg="red.500" borderRadius="md">
//             <Text fontWeight="bold">Password Requirements:</Text>
//             <Text>• Minimum 6 characters</Text>
//             <Text>• At least one uppercase letter</Text>
//             <Text>• At least one symbol (!@#$%^&* etc.)</Text>
//           </Box>
//         ),
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       showErrorToast('Passwords do not match');
//       return;
//     }

//     handleSuccessfulSignup();
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 3000,
//     });
//   };

//   const handleSuccessfulSignup = () => {
//     toast({
//       title: 'Account Created',
//       description: 'Redirecting to login...',
//       status: 'success',
//       duration: 2000,
//       render: ({ title, description }) => (
//         <Box color="white" p={3} bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} borderRadius="md">
//           <Text fontWeight="bold">{title}</Text>
//           <Text>{description}</Text>
//         </Box>
//       ),
//     });
//     setTimeout(() => navigate('/Log-In'), 2000);
//   };

//   const hoverStyle = {
//     boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Full Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="John Doe"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email Address</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="john@example.com"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//           <Text fontSize="sm" mt={2} color="gray.500">
//             Password must contain:
//             <br/>• 6+ characters
//             <br/>• 1 uppercase letter
//             <br/>• 1 symbol (!@#$%^&* etc.)
//           </Text>
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           size="lg"
//           _hover={{
//             transform: 'scale(1.02)',
//             boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//           }}
//           transition="all 0.2s"
//         >
//           Create Account
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already registered? </Text>
//           <Link to="/Log-In">
//             <Button
//               variant="link"
//               colorScheme="orange"
//               ml={2}
//               fontWeight="bold"
//             >
//               Sign In Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;

















// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.[A-Z])(?=.[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || !confirmPassword) {
//       showErrorToast('All fields are required');
//       return;
//     }

//     if (!email.includes('@') || !email.split('@')[1].includes('.')) {
//       showErrorToast('Please enter a valid email address');
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//       toast({
//         title: 'Invalid Password',
//         status: 'error',
//         duration: 5000,
//         render: () => (
//           <Box color="white" p={3} bg="red.500" borderRadius="md">
//             <Text fontWeight="bold">Password Requirements:</Text>
//             <Text>• Minimum 6 characters</Text>
//             <Text>• At least one uppercase letter</Text>
//             <Text>• At least one symbol (!@#$%^&* etc.)</Text>
//           </Box>
//         ),
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       showErrorToast('Passwords do not match');
//       return;
//     }

//     handleSuccessfulSignup();
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 3000,
//     });
//   };

//   const handleSuccessfulSignup = () => {
//     toast({
//       title: 'Account Created',
//       description: 'Redirecting to login...',
//       status: 'success',
//       duration: 2000,
//     });
//     setTimeout(() => navigate('/login'), 2000);
//   };

//   const hoverStyle = {
//     boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Full Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="John Doe"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email Address</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="john@example.com"
//             _hover={hoverStyle}
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//           <Text fontSize="sm" mt={2} color="gray.500">
//             Password must contain:
//             <br/>• 6+ characters
//             <br/>• 1 uppercase letter
//             <br/>• 1 symbol (!@#$%^&* etc.)
//           </Text>
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <InputGroup>
//             <Input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//               _hover={hoverStyle}
//             />
//             <InputRightElement width="4.5rem">
//               <IconButton
//                 h="1.75rem"
//                 size="sm"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 variant="ghost"
//                 _hover={{ bg: 'transparent' }}
//               />
//             </InputRightElement>
//           </InputGroup>
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           size="lg"
//           _hover={{
//             transform: 'scale(1.02)',
//             boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//           }}
//           transition="all 0.2s"
//         >
//           Create Account
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already registered? </Text>
//           <Link to="/log-In">
//             <Button
//               variant="link"
//               colorScheme="orange"
//               ml={2}
//               fontWeight="bold"
//             >
//               Sign In Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;
































// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex 
// } from '@chakra-ui/react';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || !confirmPassword) {
//       toast({
//         title: 'Error',
//         description: 'All fields are required',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     if (!email.includes('@')) {
//       toast({
//         title: 'Invalid Email',
//         description: 'Please enter a valid email address',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast({
//         title: 'Password Mismatch',
//         description: 'Passwords do not match',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     // Add actual signup logic here
//     navigate('/Log-In');
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={6} 
//       boxShadow="xl" 
//       borderRadius="md"
//       width={{ base: "90%", md: "md" }}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <Input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           _hover={{
//             boxShadow: colorMode === 'dark' ? '0 0 12px teal' : '0 0 12px orange',
//           }}
//         >
//           Sign Up
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Already have an account? </Text>
//           <Link to="/Log-In">
//             <Button variant="link" colorScheme="orange" ml={2}>
//               Login here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default SignUp;






























// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, FormControl, FormLabel, Input, Button, useToast, useColorMode, Link, Flex, Text } from '@chakra-ui/react';

// export const Signup = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { colorMode } = useColorMode();

//   const handleSignup = async (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || !confirmPassword) {
//       toast({
//         title: 'Error',
//         description: 'All fields are required',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     if (!email.includes('@')) {
//       toast({
//         title: 'Invalid Email',
//         description: 'Please enter a valid email address',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast({
//         title: 'Password Mismatch',
//         description: 'Passwords do not match',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     // Add your actual signup logic here
//     try {
//       // Simulated API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       navigate('/login');
//     } catch (error) {
//       toast({
//         title: 'Signup Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     }
//   };

//   return (
//     <Box maxW="md" mx="auto" mt={20} p={6} boxShadow="xl" borderRadius="md">
//       <form onSubmit={handleSignup}>
//         <FormControl id="name" isRequired>
//           <FormLabel>Name</FormLabel>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="email" mt={4} isRequired>
//           <FormLabel>Email</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="password" mt={4} isRequired>
//           <FormLabel>Password</FormLabel>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <FormControl id="confirmPassword" mt={4} isRequired>
//           <FormLabel>Confirm Password</FormLabel>
//           <Input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             _hover={{
//               boxShadow: colorMode === 'dark' ? '0 0 8px teal' : '0 0 8px orange',
//             }}
//           />
//         </FormControl>

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           _hover={{
//             boxShadow: colorMode === 'dark' ? '0 0 12px teal' : '0 0 12px orange',
//           }}
//         >
//           Sign Up
//         </Button>
//          <Flex mt={4} justifyContent="center">
//                   <Text>Don't have an account? </Text>
//                   <Link to="/LogIn">
//                     <Button variant="link" colorScheme="orange" ml={2}>
//                       Log-In here
//                     </Button>
//                   </Link>
//                 </Flex>
//       </form>
//       </Box>
// );
// };
// export default Signup