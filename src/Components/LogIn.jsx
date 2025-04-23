// Login.jsx
import React, { useState } from 'react';
import {
  Box, FormControl, FormLabel, Input,
  Button, useToast, Text, Flex,
  InputGroup, InputRightElement, IconButton,
  Link, Heading, useColorMode, VStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../Supabase/Supabase.js';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const hoverColor = colorMode === 'dark' ? 'teal.400' : 'orange.400';

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      toast({ title: 'Login Successful', status: 'success', duration: 2000 });
      profile?.role === 'admin' ? navigate('/admin') : navigate('/');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={8}
      boxShadow="xl"
      borderRadius="xl"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
    >
      <Heading mb={8} textAlign="center" fontSize="3xl">
        Welcome to EnglishPod
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="student@englishpod.com"
              size="lg"
              autoFocus
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                size="lg"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label="Toggle password"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            w="full"
            size="lg"
            isLoading={loading}
            loadingText="Logging In..."
            bg={hoverColor}
            _hover={{ boxShadow: `0 0 10px ${hoverColor}` }}
            color="white"
          >
            Log In
          </Button>

          <Flex justifyContent="center">
            <Text>Don't have an account?</Text>
            <Link as={RouterLink} to="/Sign-Up" ml={2}>
              <Button
                variant="link"
                color={hoverColor}
                _hover={{ textDecoration: 'none', boxShadow: `0 0 5px ${hoverColor}` }}
              >
                Sign Up
              </Button>
            </Link>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;















































// working but wrong colors backrounds
// import { useState } from 'react';
// import { 
//   Box, FormControl, FormLabel, Input, 
//   Button, useToast, Text, Flex,
//   InputGroup, InputRightElement, IconButton,
//   Link, Heading, useColorMode,
//   VStack
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabase.js';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: credentials.email,
//         password: credentials.password
//       });

//       if (error) throw error;

//       // Check user role
//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', data.user.id)
//         .single();

//       // Redirect based on role
//       profile?.role === 'admin' ? navigate('/admin') : navigate('/');

//       toast({
//         title: 'Login Successful',
//         status: 'success',
//         duration: 2000,
//       });

//     } catch (error) {
//       toast({
//         title: 'Login Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box 
//       maxW="md" 
//       mx="auto" 
//       mt={20} 
//       p={8} 
//       boxShadow="xl" 
//       borderRadius="xl"
//       bg={colorMode === 'dark' ? 'gray.800' : 'white'}
//     >
//       <Heading mb={8} textAlign="center" fontSize="3xl">
//         Welcome to EnglishPod
//       </Heading>

//       <form onSubmit={handleSubmit}>
//         <VStack spacing={4}>
//           <FormControl isRequired>
//             <FormLabel>Email Address</FormLabel>
//             <Input
//               type="email"
//               value={credentials.email}
//               onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//               placeholder="student@englishpod.com"
//               size="lg"
//               autoFocus
//             />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel>Password</FormLabel>
//             <InputGroup>
//               <Input
//                 type={showPassword ? 'text' : 'password'}
//                 value={credentials.password}
//                 onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//                 placeholder="••••••••"
//                 size="lg"
//               />
//               <InputRightElement>
//                 <IconButton
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                   onClick={() => setShowPassword(!showPassword)}
//                   variant="ghost"
//                   size="lg"
//                   mr={2}
//                 />
//               </InputRightElement>
//             </InputGroup>
//           </FormControl>

//           <Button
//             type="submit"
//             colorScheme="blue"
//             size="lg"
//             width="full"
//             isLoading={loading}
//             mt={4}
//           >
//             Sign In
//           </Button>

//           <Flex mt={4} justifyContent="center" width="full">
//             <Text mr={2}>don't have Account?</Text>
//             <Link 
//               href="/Sign-Up" 
//               color="blue.500"
//               fontWeight="500"
//               _hover={{ textDecoration: 'underline' }}
//             >
//               Create Account
//             </Link>
//           </Flex>
//         </VStack>
//       </form>
//     </Box>
//   );
// };

// export default Login;
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

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!email || !password) {
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
//             <Text>Password must contain:</Text>
//             <Text>- Minimum 6 characters</Text>
//             <Text>- At least one uppercase letter</Text>
//             <Text>- At least one symbol (!@#$%^&*)</Text>
//           </Box>
//         ),
//       });
//       setLoading(false);
//       return;
//     }

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password
//       });

//       if (error) throw error;

//       toast({
//         title: 'Login Successful',
//         description: 'Redirecting to EnglishPod...',
//         status: 'success',
//         duration: 2000,
//         render: ({ title, description }) => (
//           <Box color="white" p={3} bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} borderRadius="md">
//             <Text fontWeight="bold">{title}</Text>
//             <Text>{description}</Text>
//           </Box>
//         ),
//       });
      
//       setTimeout(() => navigate('/'), 2000);
//     } catch (error) {
//       showErrorToast(error.message || 'Login failed. Please check your credentials.');
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
//         <FormControl id="email" isRequired>
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
//           Login
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Don't have an account? </Text>
//           <Link to="/Sign-Up">
//             <Button
//               variant="link"
//               colorScheme="orange"
//               ml={2}
//               fontWeight="bold"
//             >
//               Sign Up Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default Login;





































// Login.jsx
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex,
//   InputGroup, InputRightElement, IconButton
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!email || !password) {
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
//             <Text>Password must contain:</Text>
//             <Text>- Minimum 6 characters</Text>
//             <Text>- At least one uppercase letter</Text>
//             <Text>- At least one symbol (!@#$%^&*)</Text>
//           </Box>
//         ),
//       });
//       return;
//     }

//     handleSuccessfulLogin();
//   };

//   const showErrorToast = (message) => {
//     toast({
//       title: 'Error',
//       description: message,
//       status: 'error',
//       duration: 3000,
//     });
//   };

//   const handleSuccessfulLogin = () => {
//     toast({
//       title: 'Login Successful',
//       description: 'Redirecting to EnglishPod...',
//       status: 'success',
//       duration: 2000,
//       render: ({ title, description }) => (
//         <Box color="white" p={3} bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} borderRadius="md">
//           <Text fontWeight="bold">{title}</Text>
//           <Text>{description}</Text>
//         </Box>
//       ),
//     });
//     setTimeout(() => navigate('/'), 2000);
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
//         <FormControl id="email" isRequired>
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
//           Login
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Don't have an account? </Text>
//           <Link to="/Sign-Up">
//             <Button
//               variant="link"
//               colorScheme="orange"
//               ml={2}
//               fontWeight="bold"
//             >
//               Sign Up Here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default Login;
































// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex 
// } from '@chakra-ui/react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   // Password validation regex
//   const passwordRegex = /^(?=.[A-Z])(?=.[!@#$%^&*]).{6,}$/;

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Basic validations
//     if (!email || !password) {
//       toast({
//         title: 'Error',
//         description: 'All fields are required',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     // Email validation
//     if (!email.includes('@')) {
//       toast({
//         title: 'Invalid Email',
//         description: 'Please enter a valid email address',
//         status: 'error',
//         duration: 3000,
//       });
//       return;
//     }

//     // Password validation
//     if (!passwordRegex.test(password)) {
//       toast({
//         title: 'Invalid Password',
//         status: 'error',
//         duration: 5000,
//         render: () => (
//           <Box color="white" p={3} bg="red.500" borderRadius="md">
//             <Text>Password must contain:</Text>
//             <Text>- Minimum 6 characters</Text>
//             <Text>- At least one uppercase letter</Text>
//             <Text>- At least one symbol (!@#$%^&*)</Text>
//           </Box>
//         ),
//       });
//       return;
//     }

//     // Add your login logic here
//     navigate('/');
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
//         <FormControl id="email" isRequired>
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
//           <Text fontSize="sm" mt={2} color="gray.500">
//             Password must meet complexity requirements
//           </Text>
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
//           Login
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Don't have an account? </Text>
//           <Link to="/Sign-Up">
//             <Button variant="link" colorScheme="orange" ml={2}>
//               Sign Up here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default Login;


























// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, FormControl, FormLabel, Input, Button, 
//   useToast, useColorMode, Text, Flex 
// } from '@chakra-ui/react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const toast = useToast();
//   const { colorMode } = useColorMode();
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!email || !password) {
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

//     // Add actual login logic here
//     navigate('/');
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
//         <FormControl id="email" isRequired>
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

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           _hover={{
//             boxShadow: colorMode === 'dark' ? '0 0 12px teal' : '0 0 12px orange',
//           }}
//         >
//           Login
//         </Button>

//         <Flex mt={4} justifyContent="center">
//           <Text>Don't have an account? </Text>
//           <Link to="/Sign-Up">
//             <Button variant="link" colorScheme="orange" ml={2}>
//               Sign Up here
//             </Button>
//           </Link>
//         </Flex>
//       </form>
//     </Box>
//   );
// };

// export default Login;








































// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, FormControl, FormLabel, Input, Button, useToast, useColorMode } from '@chakra-ui/react';

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { colorMode } = useColorMode();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     if (!email || !password) {
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

//     // Add your actual login logic here
//     try {
//       // Simulated API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       navigate('/');
//     } catch (error) {
//       toast({
//         title: 'Login Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     }
//   };

//   return (
//     <Box maxW="md" mx="auto" mt={20} p={6} boxShadow="xl" borderRadius="md">
//       <form onSubmit={handleLogin}>
//         <FormControl id="email" isRequired>
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

//         <Button
//           type="submit"
//           colorScheme="orange"
//           mt={6}
//           w="full"
//           _hover={{
//             boxShadow: colorMode === 'dark' ? '0 0 12px teal' : '0 0 12px orange',
//           }}
//         >
//           Login
//         </Button>
//       </form>
//   </Box>
// );
// };
//  export default Login