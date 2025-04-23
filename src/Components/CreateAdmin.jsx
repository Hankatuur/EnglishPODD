// CreateAdmin.jsx
import { useState } from 'react';
import { 
  Box, VStack, FormControl, FormLabel, Input, 
  Button, useToast, Heading, Text, InputGroup,
  InputRightElement, IconButton, Flex,
  useColorMode, useColorModeValue,
  Link
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../Supabase/Supabase.js';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  // Color mode values
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const formBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const focusBorder = useColorModeValue('orange.500', 'teal.300');
  const buttonScheme = useColorModeValue('orange', 'teal');
  const glow = useColorModeValue('0 0 15px rgba(255,165,0,0.3)', '0 0 15px rgba(56,178,172,0.3)');
  const textColor = useColorModeValue('gray.700', 'white');

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!passwordRegex.test(formData.password)) {
        throw new Error('Password must contain: 6+ chars, 1 uppercase, 1 symbol');
      }

      // Check existing admin
      const { data: existing } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .eq('role', 'admin');

      if (existing && existing.length > 0) {
        throw new Error('Admin with this email already exists');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Create admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: formData.name,
          email: formData.email,
          role: 'admin'
        });

      if (profileError) throw profileError;

      // Send confirmation email
      await supabase.auth.admin.inviteUserByEmail(formData.email, {
        redirectTo: `${window.location.origin}/confirm-admin`
      });

      // Success feedback
      toast({
        title: 'Admin Created',
        status: 'success',
        duration: 5000,
        render: () => (
          <Box 
            color="white" 
            p={3} 
            bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} 
            borderRadius="md"
          >
            <Text fontWeight="bold">Admin account created!</Text>
            <Text>Invitation sent to {formData.email}</Text>
          </Box>
        ),
      });

      navigate('/Admin');

    } catch (error) {
      // Error handling
      toast({
        title: 'Creation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Cleanup failed creation
      if (formData.email) {
        await supabase.auth.admin.deleteUser(formData.email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" p={8} bg={pageBg}>
      <VStack spacing={6} maxW="md" mx="auto">
        <Heading mb={8} color={textColor} textAlign="center">
          Create New Admin
          <Text fontSize="md" mt={2} color="gray.500">
            (Requires Super Admin Privileges)
          </Text>
        </Heading>
        
        <Box 
          as="form" 
          onSubmit={handleSubmit} 
          w="100%" 
          p={8} 
          bg={formBg}
          borderRadius="md"
          boxShadow="xl"
          _hover={{
            boxShadow: glow,
            transition: 'all 0.3s ease'
          }}
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color={textColor}>Full Name</FormLabel>
              <Input
                bg={inputBg}
                focusBorderColor={focusBorder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Email Address</FormLabel>
              <Input
                type="email"
                bg={inputBg}
                focusBorderColor={focusBorder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  bg={inputBg}
                  focusBorderColor={focusBorder}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    color={textColor}
                  />
                </InputRightElement>
              </InputGroup>
              <Text fontSize="sm" mt={2} color="gray.500">
                Password Requirements:
                <br/>• Minimum 6 characters
                <br/>• At least one uppercase letter
                <br/>• At least one special symbol
              </Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  bg={inputBg}
                  focusBorderColor={focusBorder}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <InputRightElement>
                  <IconButton
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    color={textColor}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Creating Admin..."
              colorScheme={buttonScheme}
              color="white"
              w="full"
              mt={6}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: glow
              }}
              transition="all 0.2s"
            >
              Create Admin Account
            </Button>

            <Flex mt={4} justifyContent="center" w="full">
              <Button
                variant="ghost"
                colorScheme={buttonScheme}
                onClick={() => navigate(-1)}
              >
                ← Back to Dashboard
              </Button>
            </Flex>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateAdmin;
// import { useState } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input, 
//   Button, useToast, Heading, Text, InputGroup,
//   InputRightElement, IconButton, Flex,
//   useColorMode, useColorModeValue,
//   Link
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse';
// import { useNavigate } from 'react-router-dom';

// const CreateAdmin = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { colorMode } = useColorMode();
//   const toast = useToast();
//   const navigate = useNavigate();

//   // Color mode values
//   const pageBg = useColorModeValue('gray.50', 'gray.900');
//   const formBg = useColorModeValue('white', 'gray.800');
//   const inputBg = useColorModeValue('white', 'gray.700');
//   const focusBorder = useColorModeValue('orange.500', 'teal.300');
//   const buttonScheme = useColorModeValue('orange', 'teal');
//   const glow = useColorModeValue('0 0 15px rgba(255,165,0,0.3)', '0 0 15px rgba(56,178,172,0.3)');
//   const textColor = useColorModeValue('gray.700', 'white');

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!formData.name || !formData.email || !formData.password) {
//         throw new Error('All fields are required');
//       }
      
//       if (formData.password !== formData.confirmPassword) {
//         throw new Error('Passwords do not match');
//       }

//       if (!passwordRegex.test(formData.password)) {
//         throw new Error('Password must contain: 6+ chars, 1 uppercase, 1 symbol');
//       }

//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (authError) throw authError;

//       const { error: profileError } = await supabase
//         .from('profiles')
//         .upsert({
//           id: authData.user.id,
//           full_name: formData.name,
//           email: formData.email,
//           is_admin: true
//         }, {
//           headers: {
//             "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`
//           }
//         });

//       if (profileError) throw profileError;

//       toast({
//         title: 'Admin Created',
//         status: 'success',
//         duration: 3000,
//         render: () => (
//           <Box 
//             color="white" 
//             p={3} 
//             bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'} 
//             borderRadius="md"
//           >
//             <Text fontWeight="bold">Admin account created successfully!</Text>
//           </Box>
//         ),
//       });
      
//       navigate('/Admin');

//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//         render: () => (
//           <Box color="white" p={3} bg="red.500" borderRadius="md">
//             <Text fontWeight="bold">{error.message}</Text>
//           </Box>
//         ),
//       });
      
//       if (formData.email) {
//         await supabase.auth.admin.deleteUser(formData.email);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(formData);

//   return (
//     <Box minH="100vh" p={8} bg={pageBg}>
//       <VStack spacing={6} maxW="md" mx="auto">
//         <Heading mb={8} color={textColor}>Create New Admin</Heading>
        
//         <Box 
//           as="form" 
//           onSubmit={handleSubmit} 
//           w="100%" 
//           p={8} 
//           bg={formBg}
//           borderRadius="md"
//           boxShadow="xl"
//           _hover={{
//             boxShadow: glow,
//             transition: 'all 0.3s ease'
//           }}
//         >
//           <VStack spacing={4}>
//             <FormControl isRequired>
//               <FormLabel color={textColor}>Admin Name</FormLabel>
//               <Input
//                 bg={inputBg}
//                 focusBorderColor={focusBorder}
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="John Doe"
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>Email</FormLabel>
//               <Input
//                 type="email"
//                 bg={inputBg}
//                 focusBorderColor={focusBorder}
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="admin@example.com"
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   bg={inputBg}
//                   focusBorderColor={focusBorder}
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   placeholder="••••••••"
//                 />
//                 <InputRightElement>
//                   <IconButton
//                     icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     onClick={() => setShowPassword(!showPassword)}
//                     variant="ghost"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     color={textColor}
//                   />
//                 </InputRightElement>
//               </InputGroup>
//               <Text fontSize="sm" mt={2} color="gray.500">
//                 Password must contain:
//                 <br/>• 6+ characters
//                 <br/>• 1 uppercase letter
//                 <br/>• 1 symbol (!@#$%^&* etc.)
//               </Text>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>Confirm Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   bg={inputBg}
//                   focusBorderColor={focusBorder}
//                   value={formData.confirmPassword}
//                   onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                   placeholder="••••••••"
//                 />
//                 <InputRightElement>
//                   <IconButton
//                     icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     variant="ghost"
//                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                     color={textColor}
//                   />
//                 </InputRightElement>
//               </InputGroup>
//             </FormControl>

//             <Button
//               type="submit"
//               isLoading={loading}
//               loadingText="Creating Admin..."
//               colorScheme={buttonScheme}
//               color="white"
//               w="full"
//               mt={6}
//               _hover={{
//                 transform: 'scale(1.05)',
//                 boxShadow: glow
//               }}
//               transition="all 0.2s"
//             >
//               Create Admin
//             </Button>

//             <Flex mt={4} justifyContent="center">
//               <Text color={textColor}>Already have an account? </Text>
//               <Link to="/Log-In">
//                 <Button
//                   variant="link"
//                   colorScheme={buttonScheme}
//                   ml={2}
//                   fontWeight="bold"
//                 >
//                   Sign In Here
//                 </Button>
//               </Link>
//             </Flex>
//           </VStack>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateAdmin;










// import { useState } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input, 
//   Button, useToast, Heading, Text, InputGroup,
//   InputRightElement, IconButton, Flex,
//   useColorMode
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse';
// import { useNavigate } from 'react-router-dom';

// const CreateAdmin = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { colorMode } = useColorMode();
//   const toast = useToast();
//   const navigate = useNavigate();

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validate inputs
//       if (!formData.name || !formData.email || !formData.password) {
//         throw new Error('All fields are required');
//       }
      
//       if (formData.password !== formData.confirmPassword) {
//         throw new Error('Passwords do not match');
//       }

//       if (!passwordRegex.test(formData.password)) {
//         throw new Error('Password must contain: 6+ chars, 1 uppercase, 1 symbol');
//       }

//       // Create auth user
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (authError) throw authError;

//       // Create admin profile using service role
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .upsert({
//           id: authData.user.id,
//           full_name: formData.name,
//           email: formData.email,
//           is_admin: true
//         }, {
//           headers: {
//             "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`
//           }
//         });

//       if (profileError) throw profileError;

//       toast({
//         title: 'Admin Created',
//         status: 'success',
//         duration: 3000
//       });
      
//       navigate('/Admin');

//     } catch (error) {
//       toast({
//         title: 'Creation Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000
//       });
      
//       // Cleanup failed user
//       if (formData.email) {
//         await supabase.auth.admin.deleteUser(formData.email);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box minH="100vh" p={8} 
//     >
//       <VStack spacing={6} maxW="md" mx="auto">
//         <Heading mb={8}>Create New Admin</Heading>
        
//         <form onSubmit={handleSubmit} style={{ width: '100%' }} color="white"
//      bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'}>
//           <VStack spacing={4}>
//             <FormControl isRequired>
//               <FormLabel>Admin Name</FormLabel>
//               <Input
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="John Doe"
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="admin@example.com"
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   placeholder="••••••••"
//                 />
//                 <InputRightElement>
//                   <IconButton
//                     icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     onClick={() => setShowPassword(!showPassword)}
//                     variant="variant"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   />
//                 </InputRightElement>
//               </InputGroup>
//               <Text fontSize="sm" mt={2} color="gray.500">
//                           Password must contain:
//                           <br/>• 6+ characters
//                           <br/>• 1 uppercase letter
//                           <br/>• 1 symbol (!@#$%^&* etc.)
//                         </Text>
//             </FormControl>
            

//             <FormControl isRequired>
//               <FormLabel>Confirm Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                   placeholder="••••••••"
//                 />
//                 <InputRightElement>
//                   <IconButton
//                     icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     variant="ghost"
//                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                   />
//                 </InputRightElement>
//               </InputGroup>
//             </FormControl>

//             <Button
//               type="submit"
//               isLoading={loading}
//               colorScheme="blue"
//               w="full"
//               mt={6}
//             >
//               Create Admin
//             </Button>
//           </VStack>
//         </form>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateAdmin;
























// import { useState } from 'react';
// import { 
//   Box, 
//   VStack, 
//   FormControl, 
//   FormLabel, 
//   Input, 
//   Button, 
//   useColorModeValue, 
//   useToast,
//   Heading,
//   Text,
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   Link,
//   Flex
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse';
// import { useNavigate } from 'react-router-dom';

// const CreateAdmin = () => {
//   const toast = useToast();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const bgColor = useColorModeValue('orange.50', 'teal.900');
//   const inputBg = useColorModeValue('white', 'teal.800');
//   const buttonScheme = useColorModeValue('orange', 'teal');
//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]:";'<>?,./~]).{6,}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     if (formData.password !== formData.confirmPassword) {
//       showErrorToast('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     if (!passwordRegex.test(formData.password)) {
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

//     try {
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (authError) throw authError;

//       const { error: profileError } = await supabase
//         .from('profiles')
//         .update({
//           full_name: formData.name,
//           is_admin: true
//         })
//         .eq('id', authData.user.id);

//       if (profileError) throw profileError;

//       toast({
//         title: 'Admin created!',
//         description: 'New admin account has been created',
//         status: 'success',
//         duration: 3000
//       });
//       navigate('/Log-In');
//     } catch (error) {
//       showErrorToast(error.message || 'Admin creation failed');
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

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <VStack spacing={6} maxW="500px" mx="auto">
//         <Heading mb={8} textAlign="center">
//           Create New Admin
//         </Heading>

//         <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//           <VStack spacing={6}>
//             <FormControl isRequired>
//               <FormLabel>Admin Name</FormLabel>
//               <Input
//                 bg={inputBg}
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 bg={inputBg}
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   bg={inputBg}
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 />
//                 <InputRightElement width="4.5rem">
//                   <IconButton
//                     h="1.75rem"
//                     size="sm"
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     variant="ghost"
//                   />
//                 </InputRightElement>
//               </InputGroup>
//               <Text fontSize="sm" mt={2} color="gray.500">
//                 Password must contain:
//                 <br/>• 6+ characters
//                 <br/>• 1 uppercase letter
//                 <br/>• 1 symbol (!@#$%^&* etc.)
//               </Text>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Confirm Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   bg={inputBg}
//                   value={formData.confirmPassword}
//                   onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 />
//                 <InputRightElement width="4.5rem">
//                   <IconButton
//                     h="1.75rem"
//                     size="sm"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                     icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
//                     variant="ghost"
//                   />
//                 </InputRightElement>
//               </InputGroup>
//             </FormControl>

//             <Button
//               type="submit"
//               isLoading={loading}
//               loadingText="Creating Admin..."
//               colorScheme={buttonScheme}
//               color="white"
//               width="full"
//               _hover={{ transform: 'scale(1.05)' }}
//               transition="all 0.2s"
//             >
//               Create Admin
//             </Button>

//             <Flex mt={4} justifyContent="center">
//               <Text>Already have an account? </Text>
//               <Link to="/Log-In">
//                 <Button
//                   variant="link"
//                   colorScheme={buttonScheme}
//                   ml={2}
//                   fontWeight="bold"
//                 >
//                   Sign In Here
//                 </Button>
//               </Link>
//             </Flex>
//           </VStack>
//         </form>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateAdmin;




















// import { useState } from 'react';
// import { 
//   Box, 
//   VStack, 
//   FormControl, 
//   FormLabel, 
//   Input, 
//   Button, 
//   useColorModeValue, 
//   useToast,
//   Heading,
//   Text
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse';
// import { useNavigate } from 'react-router-dom';

// const CreateAdmin = () => {
//   const toast = useToast();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const bgColor = useColorModeValue('orange.50', 'teal.900');
//   const inputBg = useColorModeValue('white', 'teal.800');
//   const buttonScheme = useColorModeValue('orange', 'teal');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     if (formData.password !== formData.confirmPassword) {
//       toast({ title: 'Passwords do not match', status: 'error' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (authError) throw authError;

//       const { error: profileError } = await supabase
//         .from('profiles')
//         .update({
//           full_name: formData.name,
//           is_admin: true
//         })
//         .eq('id', authData.user.id);

//       if (profileError) throw profileError;

//       toast({
//         title: 'Admin created!',
//         description: 'New admin account has been created',
//         status: 'success',
//         duration: 3000
//       });
//       navigate('/Log-In');
//     } catch (error) {
//       toast({
//         title: 'Error creating admin',
//         description: error.message,
//         status: 'error',
//         duration: 3000
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <VStack spacing={6} maxW="500px" mx="auto">
//         <Heading mb={8} textAlign="center">
//           Create New Admin
//         </Heading>

//         <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//           <VStack spacing={6}>
//             <FormControl isRequired>
//               <FormLabel>Admin Name</FormLabel>
//               <Input
//                 bg={inputBg}
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 bg={inputBg}
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Password</FormLabel>
//               <Input
//                 type="password"
//                 bg={inputBg}
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Confirm Password</FormLabel>
//               <Input
//                 type="password"
//                 bg={inputBg}
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//               />
//             </FormControl>

//             <Button
//               type="submit"
//               isLoading={loading}
//               loadingText="Creating Admin..."
//               colorScheme={buttonScheme}
//               color="white"
//               width="full"
//               _hover={{ transform: 'scale(1.05)' }}
//               transition="all 0.2s"
//             >
//               Create Admin
//             </Button>
//           </VStack>
//         </form>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateAdmin;


















// import React, { useState, useEffect } from 'react';
// import { supabase } from '../Supabase/Supabse';
// import { 
//   Tabs, TabList, TabPanels, Tab, TabPanel, 
//   FormControl, FormLabel, VStack, Box,
//   useColorMode, useToast, Text, Input,
//   Spinner, Flex, Center
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';

// const AdminPage = () => {
//   const { colorMode } = useColorMode();
//   const toast = useToast();
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdminStatus = async () => {
//       try {
//         const { data: { user }, error: authError } = await supabase.auth.getUser();
        
//         if (!user || authError) {
//           navigate('/Log-In');
//           return;
//         }

//         const { data: profile, error: profileError } = await supabase
//           .from('profiles')
//           .select('is_admin')
//           .eq('id', user.id)
//           .single();

//         if (profileError || !profile?.is_admin) {
//           toast({
//             title: 'Access Denied',
//             description: 'Admin privileges required',
//             status: 'error',
//             duration: 3000
//           });
//           navigate('/');
//         }
//       } catch (error) {
//         console.error('Authorization error:', error);
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAdminStatus();
//   }, [navigate, toast]);

//   const uploadStyle = {
//     border: '2px dashed',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//     _hover: {
//       boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//       transform: 'translateY(-2px)'
//     },
//     transition: 'all 0.3s ease',
//     p: 6,
//     borderRadius: 'md',
//     cursor: uploading ? 'not-allowed' : 'pointer',
//     position: 'relative'
//   };

//   const handleFileUpload = async (file, fileType) => {
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       const fileName = `${Date.now()}-${file.name}`;
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       const { error: dbError } = await supabase
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .insert([{
//           title: file.name,
//           file_path: uploadData.path,
//           file_type: file.type,
//           file_size: file.size,
//         }]);

//       if (dbError) throw dbError;

//       toast({
//         status: 'success',
//         duration: 3000,
//         render: () => (
//           <Box
//             color="white"
//             p={3}
//             bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'}
//             borderRadius="md"
//           >
//             <Text fontWeight="bold">{fileType.toUpperCase()} Uploaded!</Text>
//             <Text>{file.name} was successfully uploaded</Text>
//           </Box>
//         ),
//       });
//     } catch (error) {
//       toast({
//         title: 'Upload failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Center minH="100vh">
//         <Spinner size="xl" thickness="4px" />
//       </Center>
//     );
//   }

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Tabs variant="enclosed" isLazy>
//         <TabList>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload Video
//           </Tab>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload PDF
//           </Tab>
//         </TabList>

//         <TabPanels mt={4}>
//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('video-upload').click()}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     inset={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl" textAlign="center">
//                   {uploading ? 'Uploading...' : 'Select Video File'}
//                 </FormLabel>
//                 <Input
//                   type="file"
//                   id="video-upload"
//                   accept="video/*"
//                   hidden
//                   onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
//                   Supported formats: MP4, AVI, MOV | Max size: 100MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>

//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('pdf-upload').click()}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     inset={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl" textAlign="center">
//                   {uploading ? 'Uploading...' : 'Select PDF File'}
//                 </FormLabel>
//                 <Input
//                   type="file"
//                   id="pdf-upload"
//                   accept="application/pdf"
//                   hidden
//                   onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
//                   Maximum file size: 50MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default AdminPage;



















// CreateAdmin.jsx
// import React, { useState } from 'react';
// import { supabase } from '../Supabase/Supabse';
// import { useToast, Button, Input, VStack, Box } from '@chakra-ui/react';

// const CreateAdmin = () => {
//   const [email, setEmail] = useState('');
//   const toast = useToast();

//   const makeAdmin = async () => {
//     // First get the user ID from auth.users
//     const { data: authUser, error: lookupError } = await supabase
//       .from('auth.users')
//       .select('id')
//       .eq('email', email)
//       .single();

//     if (lookupError || !authUser) {
//       toast({ 
//         title: 'Error', 
//         description: 'User not found', 
//         status: 'error' 
//       });
//       return;
//     }

//     // Now update profiles table
//     const { error } = await supabase
//       .from('profiles')
//       .update({ is_admin: true })
//       .eq('id', authUser.id);

//     if (error) {
//       toast({ 
//         title: 'Error', 
//         description: error.message, 
//         status: 'error' 
//       });
//       return;
//     }

//     toast({
//       title: 'Success',
//       description: `${email} is now an admin`,
//       status: 'success'
//     });
//   };

//   return (
//     <Box p={8} maxW="md" mx="auto">
//       <VStack spacing={4}>
//         <Input
//           placeholder="Enter user email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Button onClick={makeAdmin} colorScheme="teal">
//           Make Admin
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default CreateAdmin;