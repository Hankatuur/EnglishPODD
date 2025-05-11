import React, { useEffect, useState } from 'react';
import { Box, Grid, Input, Spinner, Center, useToast } from '@chakra-ui/react';
import { supabase } from '../Supabase/Supabase.js';
import MaterialCard from './MaterialCard';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('course_content')
          .select('*')
          .order('order_number', { ascending: true });

        if (error) throw error;

        setMaterials(data.map(item => ({
          ...item,
          // Store only the file path in the database
          storage_path: item.storage_path 
        })));

      } catch (error) {
        toast({
          title: 'Error loading materials',
          description: error.message,
          status: 'error'
        });
        console.error('Supabase Error:', error);
      }
      setLoading(false);
    };

    fetchMaterials();
  }, [toast]);

  const filteredMaterials = materials.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4}>
      <Input
        placeholder="Search materials..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        size="lg"
      />

      {loading ? (
        <Center h="50vh">
          <Spinner 
            size="xl" 
            thickness="4px" 
            speed="0.65s" 
            color="blue.500" 
          />
        </Center>
      ) : (
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          }}
          gap={{ base: 4, md: 6 }}
          pb={8}
        >
          {filteredMaterials.map((item) => (
            <MaterialCard
              key={item.id}
              title={item.title}
              type={item.content_type}
              isFree={item.is_free}
              url={item.storage_path}  // Only pass the file path
              duration={item.duration}
              id={item.id}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Material;


















































// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Grid,
//   Input,
//   Spinner,
//   Center,
//   useToast,
//   Flex,
//   Text,
//   Button,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabase.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const toast = useToast();

//   // Use color mode for dynamic styling
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const textColor = useColorModeValue('black', 'white');
//   const backgroundColor = useColorModeValue('white', 'gray.800');

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading materials', status: 'error' });
//         console.error('Supabase Error:', error);
//       } else {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, [toast]);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         return;
//       }

//       const { data: enrollment, error: enrollError } = await supabase
//         .from('enrollments')
//         .select('subscription_status')
//         .eq('user_id', user.id)
//         .single();

//       if (enrollError) {
//         console.error('Error fetching enrollment:', enrollError);
//       } else if (enrollment && enrollment.subscription_status === 'active') {
//         setIsSubscribed(true);
//       }
//     };

//     checkSubscription();
//   }, []);

//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4} bg={backgroundColor} color={textColor}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//         size="lg"
//         borderColor={borderColor}
//       />

//       {loading ? (
//         <Center h="50vh">
//           <Spinner 
//             size="xl" 
//             thickness="4px" 
//             speed="0.65s" 
//             color={textColor} 
//           />
//         </Center>
//       ) : (
//         <>
//           {/* Subscription Prompt */}
//           {!isSubscribed && (
//             <Flex direction="column" align="center" justify="center" gap={2} mb={4}>
//               <Text fontWeight="bold" fontSize="lg">
//                 Subscribe now to unlock all content!
//               </Text>
//               <Button
//                 colorScheme="orange"
//                 onClick={() => alert('Redirecting to subscription page...')}
//               >
//                 Subscribe for $8/month
//               </Button>
//             </Flex>
//           )}

//           {/* Material Cards */}
//           <Grid
//             templateColumns={{
//               base: 'repeat(1, 1fr)',
//               sm: 'repeat(2, 1fr)',
//               md: 'repeat(3, 1fr)',
//               lg: 'repeat(4, 1fr)',
//               xl: 'repeat(5, 1fr)',
//             }}
//             gap={{ base: 4, md: 6 }}
//             pb={8}
//           >
//             {filteredMaterials.map((item) => (
//               <MaterialCard
//                 key={item.id}
//                 title={item.title}
//                 type={item.content_type}
//                 isFree={item.is_free}
//                 url={`https://kkjmwlkahplmosqhgqat.supabase.co/storage/v1/object/public/course-${item.content_type}s/${item.storage_path}`}
//                 duration={item.duration || null}
//                 isSubscribed={isSubscribed}
//               />
//             ))}
//           </Grid>
//         </>
//       )}
//     </Box>
//   );
// };

// export default Material;














// correct but with out subscription
// Material.js
// import React, { useEffect, useState } from 'react';
// import { Box, Grid, Input, Spinner, Center, useToast } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading materials', status: 'error' });
//         console.error('Supabase Error:', error);
//       } else {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, [toast]);

//   // Filter materials based on search term
//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//         size="lg"
//       />

//       {loading ? (
//         <Center h="50vh">
//           <Spinner 
//             size="xl" 
//             thickness="4px" 
//             speed="0.65s" 
//             color="blue.500" 
//           />
//         </Center>
//       ) : (
//         <Grid
//           templateColumns={{
//             base: 'repeat(1, 1fr)',
//             sm: 'repeat(2, 1fr)',
//             md: 'repeat(3, 1fr)',
//             lg: 'repeat(4, 1fr)',
//             xl: 'repeat(5, 1fr)'
//           }}
//           gap={{ base: 4, md: 6 }}
//           pb={8}
//         >
//           {filteredMaterials.map((item) => (
//             <MaterialCard
//               key={item.id}
//               title={item.title}
//               type={item.content_type}
//               isFree={item.is_free}
//               url={`https://kkjmwlkahplmosqhgqat.supabase.co/storage/v1/object/public/course-${item.content_type}s/${item.storage_path}`}
//               duration={item.duration || null}
//             />
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default Material;
























// works but is too large
// import React, { useEffect, useState } from 'react';
// import { Box, Text, Input, VStack, Skeleton, useToast } from '@chakra-ui/react';
// import { createClient } from '@supabase/supabase-js';
// import ReactPlayer from 'react-player';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';
// import Confetti from 'react-confetti';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// const supabase = createClient(supabaseUrl, supabaseKey);

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [videoEnded, setVideoEnded] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase.from('course_content').select('*').order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading content', status: 'error', duration: 3000, isClosable: true });
//         console.error(error);
//       } else {
//         const fetchedMaterials = await Promise.all(
//           data.map(async (item) => {
//             const bucket = item.content_type === 'video' ? 'course-videos'
//                         : item.content_type === 'pdf' ? 'course-pdfs'
//                         : item.content_type === 'exercise' ? 'course-exercises'
//                         : null;

//             if (!bucket) return null;

//             const { data: fileUrl } = supabase.storage.from(bucket).getPublicUrl(item.storage_path);
//             return { ...item, url: fileUrl.publicUrl };
//           })
//         );

//         setMaterials(fetchedMaterials.filter(Boolean));
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//       />

//       <VStack spacing={4} align="stretch">
//         {loading
//           ? Array.from({ length: 3 }).map((_, i) => (
//               <Skeleton key={i} height="150px" borderRadius="md" />
//             ))
//           : filteredMaterials.map((item) => (
//               <Box key={item.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
//                 <Text fontWeight="bold" mb={2}>{item.title}</Text>
//                 {item.content_type === 'pdf' && (
//                   <a href={item.url} target="_blank" rel="noopener noreferrer">
//                     <FaFilePdf size={50} color="red" />
//                     <Text mt={2}>Open PDF</Text>
//                   </a>
//                 )}
//                 {item.content_type === 'exercise' && (
//                   <a href={item.url} target="_blank" rel="noopener noreferrer">
//                     <Text color="blue.600">Open Exercise</Text>
//                   </a>
//                 )}
//                 {item.content_type === 'video' && item.url ? (
//                   <ReactPlayer
//                     url={item.url}
//                     controls
//                     height="370px"
//                     width="100%"
//                     onEnded={() => setVideoEnded(true)}
//                   />
//                 ) : item.content_type === 'video' && (
//                   <Box>
//                     <FaVideo size={50} color="gray" />
//                     <Text mt={2}>Video not available</Text>
//                   </Box>
//                 )}
//               </Box>
//             ))}
//       </VStack>

//       {videoEnded && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />}
//     </Box>
//   );
// };

// export default Material;












































































// breaked rendenring rules and hooks
// import React, { useEffect, useState } from 'react';
// import { Box, Input, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';

// import {supabase} from '../Supabase/Supabse.js'; // Adjust to your Supabase client setup
// import MaterialCard from './MaterialCard.jsx';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase.from('course_content').select('*');
//       if (!error) {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };
//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter((material) =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         mb={4}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
//         {loading ? (
//           [...Array(6)].map((_, i) => <Skeleton key={i} height="200px" borderRadius="xl" />)
//         ) : filteredMaterials.length > 0 ? (
//           filteredMaterials.map((item) => <MaterialCard key={item.id} content={item} />)
//         ) : (
//           <Text>No materials found.</Text>
//         )}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;





























































































































// working but searchbar is missing 
// import { useEffect, useState } from 'react';
// import { SimpleGrid, Spinner, Text, Center } from '@chakra-ui/react';
// import MaterialCard from './MaterialCard';
// import { supabase } from '../Supabase/Supabse.js';

// const Material = () => {
//   const [courseMaterials, setCourseMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getPublicUrl = (bucket, path) => {
//     const { data } = supabase.storage.from(bucket).getPublicUrl(path);
//     return data?.publicUrl || '';
//   };

//   const fetchMaterials = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('order_number', { ascending: true });

//     if (error) {
//       console.error('Error fetching course_content:', error.message);
//       setCourseMaterials([]);
//     } else {
//       const formatted = data.map((item) => {
//         let bucket = '';
//         if (item.content_type === 'video') bucket = 'course-videos';
//         else if (item.content_type === 'pdf') bucket = 'course-pdfs';
//         else if (item.content_type === 'exercise') bucket = 'course-exercises';

//         const url = getPublicUrl(bucket, item.storage_path);

//         return {
//           id: item.id,
//           title: item.title,
//           description: item.content,
//           type: item.content_type,
//           url,
//           level: 'Beginner', // fallback since no level column
//           price: item.price,
//           thumbnail: item.content_type === 'video'
//             ? '/default-video-thumbnail.png'
//             : undefined,
//         };
//       });

//       setCourseMaterials(formatted);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Center mt={10}>
//           <Spinner size="xl" />
//         </Center>
//       ) : courseMaterials.length === 0 ? (
//         <Center mt={10}>
//           <Text>No course materials found.</Text>
//         </Center>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
//           {courseMaterials.map((item) => (
//             <MaterialCard key={item.id} {...item} />
//           ))}
//         </SimpleGrid>
//       )}
//     </>
//   );
// };

// export default Material;

 
 
 
 
 // fetching problem 2
  // import { useEffect, useState } from 'react';
// import {
//   Box, Text, Input, InputGroup, InputLeftElement, Spinner, Flex, Button
// } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [subscriptionStatus, setSubscriptionStatus] = useState(false); // Assume subscription status here

//   // Fetch materials from Supabase
//   const fetchMaterials = async (searchQuery = '') => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Fetch error:', error);
//       setLoading(false);
//       return;
//     }

//     // Filter materials based on search query
//     const filtered = data.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     setMaterials(filtered);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials(); // Fetch materials when component mounts
//   }, []);

//   // Search handler
//   const handleSearch = () => {
//     fetchMaterials(query.trim());
//   };

//   // Handle Enter key press for search
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Handle subscription button click (for demo purposes)
//   const handleSubscribe = () => {
//     // Toggle subscription status (this should be connected to actual subscription logic)
//     setSubscriptionStatus(true);
//   };

//   // Render the MaterialCard components with dynamic content based on material type
//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement>
//           <SearchIcon color="gray.400" onClick={handleSearch} cursor="pointer" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 title={material.title}
//                 content_type={material.content_type}
//                 storage_path={material.storage_path}
//                 price={material.content_type === 'video' ? material.price : null}
//                 subscriptionStatus={subscriptionStatus}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search
//             </Text>
//           )}
//         </Flex>
//       )}

//       {/* Subscription button for demonstration */}
//       {!subscriptionStatus && (
//         <Flex justify="center" mt={6}>
//           <Button onClick={handleSubscribe} colorScheme="blue">Subscribe to Access Premium Content</Button>
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default Material;







// import { useEffect, useState } from 'react';
// import {
//   Box, Text, Input, InputGroup, InputLeftElement, Spinner, Flex
// } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Function to fetch materials from Supabase
//   const fetchMaterials = async (searchQuery = '') => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Fetch error:', error);
//       setLoading(false);
//       return;
//     }

//     // Filter materials based on the search query
//     const filtered = data.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     setMaterials(filtered);
//     setLoading(false);
//   };

//   // Trigger fetch on initial load
//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   // Handle search when the user clicks search button or presses Enter
//   const handleSearch = () => {
//     fetchMaterials(query.trim());
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement>
//           <SearchIcon color="gray.400" onClick={handleSearch} cursor="pointer" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 {...material}
//                 price={material.content_type === 'video' ? material.price : null}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search
//             </Text>
//           )}
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;
























// debugged one
// Material.jsx
// import { useEffect, useState } from 'react';
// import {
//   Box, Input, InputGroup, InputLeftElement, IconButton, Spinner, Text, Flex,
//   useColorModeValue, SimpleGrid, Badge, Image, Button, Modal, ModalOverlay,
//   ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, content_type, storage_path, created_at, price, duration, thumbnail_url }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue('0 0 15px rgba(255, 165, 0, 0.5)', '0 0 15px rgba(56, 178, 172, 0.5)');
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   const fileUrl =
//     content_type === 'video'
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : content_type === 'pdf'
//         ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//         : '#';

//   const thumbnailSrc =
//     content_type === 'video'
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//       : '/assets/pdf-thumbnail-placeholder.jpg';

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       transition="all 0.3s ease"
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300'),
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//     >
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image
//           src={thumbnailSrc}
//           alt={title}
//           height="200px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       <Text fontSize="xl" fontWeight="bold" mb={2}>
//         {title}
//       </Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       <Flex align="center" justify="space-between" mt={4}>
//         {price && <Text fontSize="xl" fontWeight="bold">${price}/month</Text>}
//         <Button colorScheme="orange" onClick={onOpen} rightIcon={<ArrowForwardIcon />}>
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             {content_type === 'video' && (
//               <Button mt={4} as="a" href={fileUrl} target="_blank" colorScheme="blue">
//                 Preview Video
//               </Button>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchMaterials = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     console.log('Raw data:', data);
//     console.log('Error:', error);

//     if (data && !error) {
//       const filtered = data.filter(
//         (item) =>
//           item.is_visible === true &&
//           item.title.toLowerCase().includes(query.toLowerCase())
//       );
//       console.log('Filtered:', filtered);
//       setMaterials(filtered);
//     } else {
//       setMaterials([]);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const handleSearch = () => {
//     fetchMaterials();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       fetchMaterials();
//     }
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.400" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <IconButton
//           aria-label="Search"
//           icon={<SearchIcon />}
//           onClick={handleSearch}
//           ml={2}
//           colorScheme="orange"
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : materials.length === 0 ? (
//         <Text textAlign="center" fontSize="xl" mt={10}>
//           No materials found matching your search
//         </Text>
//       ) : (
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
//           {materials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;




















// no debugging
// import { useEffect, useState } from 'react';
// import {
//   Box, Text, Button, Image, useColorModeValue, Badge, Input, InputGroup,
//   InputLeftElement, InputRightElement, Spinner, Flex, Modal, ModalOverlay,
//   ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({
//   title,
//   content_type,
//   storage_path,
//   created_at,
//   price,
//   duration,
//   thumbnail_url
// }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   const fileUrl =
//     content_type === 'video'
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : content_type === 'pdf'
//       ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//       : supabase.storage.from('course-exercises').getPublicUrl(storage_path).data.publicUrl;

//   const thumbnailSrc =
//     content_type === 'video'
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//       : content_type === 'pdf'
//       ? '/assets/pdf-thumbnail-placeholder.jpg'
//       : '/assets/exercise-thumbnail.jpg';

//   return (
//     <Box
//       minW="400px"
//       maxW="450px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//       transition="all 0.3s ease"
//     >
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image
//           src={thumbnailSrc}
//           alt={title}
//           height="250px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       <Flex align="center" justify="space-between" mt={4}>
//         {price && <Text fontSize="xl" fontWeight="bold">${price}/month</Text>}
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           onClick={onOpen}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             <Button mt={4} as="a" href={fileUrl} target="_blank" colorScheme="blue">
//               Preview Material
//             </Button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchMaterials = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (!error) {
//       const filtered = data.filter(item =>
//         item.is_visible === true &&
//         item.title.toLowerCase().includes(query.toLowerCase())
//       );
//       setMaterials(filtered);
//     } else {
//       console.error('Supabase error:', error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, [query]);

//   const handleSearch = () => {
//     setQuery(search.trim());
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6} mx="auto">
//         <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input
//           placeholder="Search materials by title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={handleKeyPress}
//         />
//         <InputRightElement width="4.5rem">
//           <Button size="sm" onClick={handleSearch} colorScheme="orange">Search</Button>
//         </InputRightElement>
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <Flex gap={8} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 {...material}
//                 price={material.content_type === 'video' ? material.price : null}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search.
//             </Text>
//           )}
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;



















































// it is not fetching from supabase
// import { useEffect, useState } from 'react';
// import {
//   Flex, Box, Text, Button, Image, useColorModeValue, Badge,
//   Input, InputGroup, InputLeftElement, Spinner, SimpleGrid,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ 
//   title, 
//   content_type, 
//   storage_path, 
//   created_at, 
//   price, 
//   duration,
//   thumbnail_url
// }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');
//   const hoverColor = useColorModeValue('orange.500', 'teal.300');

//   // Determine file URL and type
//   const fileUrl = content_type === 'video' 
//     ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//     : supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;

//   // Determine thumbnail source
//   const thumbnailSrc = content_type === 'video' 
//     ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//     : '/assets/pdf-thumbnail-placeholder.jpg';

//   return (
//     <Box
//       minW="400px"
//       maxW="450px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       transition="all 0.3s ease"
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//     >
//       {/* Top Badges */}
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge
//           px={3}
//           py={1}
//           borderRadius="full"
//           bg={badgeBg}
//           color={badgeColor}
//           fontSize="sm"
//           boxShadow="md"
//         >
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge
//             px={3}
//             py={1}
//             borderRadius="full"
//             bg={badgeBg}
//             color={badgeColor}
//             fontSize="sm"
//             boxShadow="md"
//           >
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       {/* Thumbnail Image */}
//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image 
//           src={thumbnailSrc}
//           alt={title}
//           height="250px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       {/* Material Details */}
//       <Text fontSize="xl" fontWeight="bold" mb={2}>
//         {title}
//       </Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       {/* Price and Action Button */}
//       <Flex align="center" justify="space-between" mt={4}>
//         {price && (
//           <Text fontSize="xl" fontWeight="bold">
//             ${price}/month
//           </Text>
//         )}
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           onClick={onOpen}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       {/* Subscription Modal */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             {content_type === 'video' && (
//               <Button 
//                 mt={4} 
//                 as="a" 
//                 href={fileUrl} 
//                 target="_blank" 
//                 colorScheme="blue"
//               >
//                 Preview Video
//               </Button>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (!error) {
//         setMaterials(data.filter(item => 
//           item.title.toLowerCase().includes(search.toLowerCase()) &&
//           item.is_visible === true
//         ));
//       }
//       setLoading(false);
//     };
    
//     fetchMaterials();
//   }, [search]);

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input 
//           placeholder="Search materials..." 
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.map(material => (
//             <MaterialCard 
//               key={material.id} 
//               {...material} 
//               price={material.content_type === 'video' ? material.price : null}
//             />
//           ))}
//         </Flex>
//       )}

//       {!loading && materials.length === 0 && (
//         <Text textAlign="center" fontSize="xl" mt={10}>
//           No materials found matching your search
//         </Text>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;





















// import { useEffect, useState } from 'react';
// import {
//   Box, Input, InputGroup, InputLeftElement,
//   Spinner, SimpleGrid, Text, Flex, Button, useColorModeValue
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, storage_path, created_at }) => {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const hoverShadow = useColorModeValue('0px 4px 20px rgba(0,0,0,0.1)', '0px 4px 20px rgba(255,255,255,0.1)');

//   const fileUrl = supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;

//   return (
//     <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md" _hover={{ boxShadow: hoverShadow }}>
//       <Text fontSize="lg" fontWeight="bold">{title}</Text>
//       <Text fontSize="sm" color="gray.500">Uploaded: {new Date(created_at).toLocaleDateString()}</Text>
//       <Button mt={4} colorScheme="blue" as="a" href={fileUrl} target="_blank" rightIcon={<ArrowForwardIcon />}>
//         View Material
//       </Button>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .neq('content_type', 'exercise')
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data);
//       setLoading(false);
//     };
//     fetchMaterials();
//   }, []);

//   const filtered = materials.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input placeholder="Search materials..." onChange={(e) => setSearch(e.target.value)} />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filtered.map(material => <MaterialCard key={material.id} {...material} />)}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;










































// this error is saying bad request
// import { useState, useEffect } from 'react';
// import { 
//   Flex, Box, Text, Button, 
//   useColorModeValue, Badge, Input,
//   InputGroup, InputLeftElement,
//   SimpleGrid, Icon, Spinner
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, type, file_path, created_at }) => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');

//   const getFileUrl = () => {
//     const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
//     return supabase.storage
//       .from(bucket)
//       .getPublicUrl(file_path).data.publicUrl;
//   };

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       p={6}
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//     >
//       <Flex align="center" mb={3}>
//         <Icon 
//           as={type === 'video' ? FaVideo : FaFilePdf} 
//           w={6} h={6} 
//           mr={2} 
//           color={useColorModeValue('orange.500', 'teal.300')}
//         />
//         <Text fontSize="xl" fontWeight="bold">{title}</Text>
//       </Flex>
      
//       <Flex gap={2} mb={4}>
//         <Badge bg={badgeBg}>{type.toUpperCase()}</Badge>
//         <Badge bg={badgeBg}>{new Date(created_at).toLocaleDateString()}</Badge>
//       </Flex>

//       <Button 
//         as="a"
//         href={getFileUrl()}
//         target="_blank"
//         colorScheme={type === 'video' ? 'orange' : 'teal'}
//         rightIcon={<ArrowForwardIcon />}
//         width="full"
//       >
//         View {type === 'video' ? 'Video' : 'PDF'}
//       </Button>
//     </Box>
//   );
// };

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')  // Fixed table name
//         .select('*')
//         .in('type', ['video', 'pdf'])
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data || []);
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={6}>
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.300" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredMaterials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default Material;


// MaterialPage.jsx
// import { useState, useEffect } from 'react';
// import { 
//   Flex, Box, Text, Button, 
//   useColorModeValue, Badge, Input,
//   InputGroup, InputLeftElement,
//   SimpleGrid, Icon,
//   Spinner
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';

// const MaterialCard = ({ title, type, file_path, created_at }) => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');

//   const getFileUrl = () => {
//     const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
//     return supabase.storage
//       .from(bucket)
//       .getPublicUrl(file_path).data.publicUrl;
//   };

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       p={6}
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//     >
//       <Flex align="center" mb={3}>
//         <Icon 
//           as={type === 'video' ? FaVideo : FaFilePdf} 
//           w={6} h={6} 
//           mr={2} 
//           color={useColorModeValue('orange.500', 'teal.300')}
//         />
//         <Text fontSize="xl" fontWeight="bold">{title}</Text>
//       </Flex>
      
//       <Flex gap={2} mb={4}>
//         <Badge bg={badgeBg}>{type.toUpperCase()}</Badge>
//         <Badge bg={badgeBg}>{new Date(created_at).toLocaleDateString()}</Badge>
//       </Flex>

//       <Button 
//         as="a"
//         href={getFileUrl()}
//         target="_blank"
//         colorScheme={type === 'video' ? 'orange' : 'teal'}
//         rightIcon={<ArrowForwardIcon />}
//         width="full"
//       >
//         View {type === 'video' ? 'Video' : 'PDF'}
//       </Button>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('content')
//         .select('*')
//         .in('type', ['video', 'pdf'])
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data || []);
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={6}>
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.300" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredMaterials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;

// import {
//   SimpleGrid,
//   Box,
//   Text,
//   Input,
//   Icon,
//   useColorModeValue,
//   Flex,
//   Heading,
//   Badge
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { FaFilePdf, FaVideo } from "react-icons/fa";

// const Material = () => {
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const materials = [
//     { id: 1, title: "React Guide", type: "pdf", price: 15, duration: "2h", level: "Beginner" },
//     { id: 2, title: "JavaScript Course", type: "video", price: 25, duration: "4h", level: "Intermediate" },
//     { id: 3, title: "Chakra UI Tutorial", type: "pdf", price: 10, duration: "1h", level: "Beginner" },
//     { id: 4, title: "Web Development", type: "video", price: 30, duration: "6h", level: "Advanced" },
//   ];

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Color mode values
//   const bgColor = useColorModeValue("orange.50", "teal.900");
//   const cardBg = useColorModeValue("white", "teal.800");
//   const textColor = useColorModeValue("orange.800", "white");
//   const glow = useColorModeValue("0 0 15px rgba(255,165,0,0.3)", "0 0 15px rgba(56,178,172,0.3)");
//   const durationBadgeColor = useColorModeValue("orange", "teal");
//   const levelBadgeColor = useColorModeValue({ light: "green", dark: "teal" }, { light: "purple", dark: "pink" });

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <Heading mb={8} textAlign="center" color={textColor}>
//         Study Materials
//       </Heading>
      
//       <Input
//         placeholder="Search materials..."
//         mb={8}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         bg="white"
//         _dark={{ bg: "teal.700" }}
//       />

//       <SimpleGrid columns={[1, 2, 3]} spacing={8}>
//         {filteredMaterials.map(material => (
//           <Box
//             key={material.id}
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             _hover={{ 
//               transform: "translateY(-5px)",
//               boxShadow: glow,
//               transition: "all 0.3s ease" 
//             }}
//             position="relative"
//           >
//             <Flex position="absolute" top={3} right={3} gap={2}>
//               <Badge colorScheme={durationBadgeColor}>
//                 {material.duration}
//               </Badge>
//               <Badge 
//                 colorScheme={material.level === "Beginner" ? 
//                   levelBadgeColor.light : 
//                   levelBadgeColor.dark}
//               >
//                 {material.level}
//               </Badge>
//             </Flex>

//             <Flex align="center" mb={4}>
//               <Icon
//                 as={material.type === "pdf" ? FaFilePdf : FaVideo}
//                 w={8}
//                 h={8}
//                 color={textColor}
//                 mr={3}
//               />
//               <Text fontSize="xl" fontWeight="bold" color={textColor}>
//                 {material.title}
//               </Text>
//             </Flex>
//             <Text color={textColor}>Price: ${material.price}</Text>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;
























// import {
//   SimpleGrid,
//   Box,
//   Text,
//   Input,
//   Icon,
//   useColorModeValue,
//   Flex,
//   Heading
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { FaFilePdf, FaVideo } from "react-icons/fa";

// const Material = () => {
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Sample data - replace with actual data from your backend
//   const materials = [
//     { id: 1, title: "React Guide", type: "pdf", price: 15 },
//     { id: 2, title: "JavaScript Course", type: "video", price: 25 },
//     { id: 3, title: "Chakra UI Tutorial", type: "pdf", price: 10 },
//     { id: 4, title: "Web Development", type: "video", price: 30 },
//   ];

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const bgColor = useColorModeValue("orange.50", "teal.900");
//   const cardBg = useColorModeValue("white", "teal.800");
//   const textColor = useColorModeValue("orange.800", "white");

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <Heading mb={8} textAlign="center" color={textColor}>
//         Study Materials
//       </Heading>
      
//       <Input
//         placeholder="Search materials..."
//         mb={8}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         bg="white"
//         _dark={{ bg: "teal.700" }}
//       />

//       <SimpleGrid columns={[1, 2, 3]} spacing={8}>
//         {filteredMaterials.map(material => (
//           <Box
//             key={material.id}
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
//           >
//             <Flex align="center" mb={4}>
//               <Icon
//                 as={material.type === "pdf" ? FaFilePdf : FaVideo}
//                 w={8}
//                 h={8}
//                 color={textColor}
//                 mr={3}
//               />
//               <Text fontSize="xl" fontWeight="bold" color={textColor}>
//                 {material.title}
//               </Text>
//             </Flex>
//             <Text color={textColor}>Price: ${material.price}</Text>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;










































































// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Grid,
//   Input,
//   Spinner,
//   Center,
//   useToast,
//   Flex,
//   Text,
//   Button,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabase.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const toast = useToast();

//   // Use color mode for dynamic styling
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const textColor = useColorModeValue('black', 'white');
//   const backgroundColor = useColorModeValue('white', 'gray.800');

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading materials', status: 'error' });
//         console.error('Supabase Error:', error);
//       } else {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, [toast]);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         return;
//       }

//       const { data: enrollment, error: enrollError } = await supabase
//         .from('enrollments')
//         .select('subscription_status')
//         .eq('user_id', user.id)
//         .single();

//       if (enrollError) {
//         console.error('Error fetching enrollment:', enrollError);
//       } else if (enrollment && enrollment.subscription_status === 'active') {
//         setIsSubscribed(true);
//       }
//     };

//     checkSubscription();
//   }, []);

//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4} bg={backgroundColor} color={textColor}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//         size="lg"
//         borderColor={borderColor}
//       />

//       {loading ? (
//         <Center h="50vh">
//           <Spinner 
//             size="xl" 
//             thickness="4px" 
//             speed="0.65s" 
//             color={textColor} 
//           />
//         </Center>
//       ) : (
//         <>
//           {/* Subscription Prompt */}
//           {!isSubscribed && (
//             <Flex direction="column" align="center" justify="center" gap={2} mb={4}>
//               <Text fontWeight="bold" fontSize="lg">
//                 Subscribe now to unlock all content!
//               </Text>
//               <Button
//                 colorScheme="orange"
//                 onClick={() => alert('Redirecting to subscription page...')}
//               >
//                 Subscribe for $8/month
//               </Button>
//             </Flex>
//           )}

//           {/* Material Cards */}
//           <Grid
//             templateColumns={{
//               base: 'repeat(1, 1fr)',
//               sm: 'repeat(2, 1fr)',
//               md: 'repeat(3, 1fr)',
//               lg: 'repeat(4, 1fr)',
//               xl: 'repeat(5, 1fr)',
//             }}
//             gap={{ base: 4, md: 6 }}
//             pb={8}
//           >
//             {filteredMaterials.map((item) => (
//               <MaterialCard
//                 key={item.id}
//                 title={item.title}
//                 type={item.content_type}
//                 isFree={item.is_free}
//                 url={`https://kkjmwlkahplmosqhgqat.supabase.co/storage/v1/object/public/course-${item.content_type}s/${item.storage_path}`}
//                 duration={item.duration || null}
//                 isSubscribed={isSubscribed}
//               />
//             ))}
//           </Grid>
//         </>
//       )}
//     </Box>
//   );
// };

// export default Material;














// correct but with out subscription
// Material.js
// import React, { useEffect, useState } from 'react';
// import { Box, Grid, Input, Spinner, Center, useToast } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading materials', status: 'error' });
//         console.error('Supabase Error:', error);
//       } else {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, [toast]);

//   // Filter materials based on search term
//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//         size="lg"
//       />

//       {loading ? (
//         <Center h="50vh">
//           <Spinner 
//             size="xl" 
//             thickness="4px" 
//             speed="0.65s" 
//             color="blue.500" 
//           />
//         </Center>
//       ) : (
//         <Grid
//           templateColumns={{
//             base: 'repeat(1, 1fr)',
//             sm: 'repeat(2, 1fr)',
//             md: 'repeat(3, 1fr)',
//             lg: 'repeat(4, 1fr)',
//             xl: 'repeat(5, 1fr)'
//           }}
//           gap={{ base: 4, md: 6 }}
//           pb={8}
//         >
//           {filteredMaterials.map((item) => (
//             <MaterialCard
//               key={item.id}
//               title={item.title}
//               type={item.content_type}
//               isFree={item.is_free}
//               url={`https://kkjmwlkahplmosqhgqat.supabase.co/storage/v1/object/public/course-${item.content_type}s/${item.storage_path}`}
//               duration={item.duration || null}
//             />
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default Material;
























// works but is too large
// import React, { useEffect, useState } from 'react';
// import { Box, Text, Input, VStack, Skeleton, useToast } from '@chakra-ui/react';
// import { createClient } from '@supabase/supabase-js';
// import ReactPlayer from 'react-player';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';
// import Confetti from 'react-confetti';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// const supabase = createClient(supabaseUrl, supabaseKey);

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [videoEnded, setVideoEnded] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase.from('course_content').select('*').order('order_number', { ascending: true });

//       if (error) {
//         toast({ title: 'Error loading content', status: 'error', duration: 3000, isClosable: true });
//         console.error(error);
//       } else {
//         const fetchedMaterials = await Promise.all(
//           data.map(async (item) => {
//             const bucket = item.content_type === 'video' ? 'course-videos'
//                         : item.content_type === 'pdf' ? 'course-pdfs'
//                         : item.content_type === 'exercise' ? 'course-exercises'
//                         : null;

//             if (!bucket) return null;

//             const { data: fileUrl } = supabase.storage.from(bucket).getPublicUrl(item.storage_path);
//             return { ...item, url: fileUrl.publicUrl };
//           })
//         );

//         setMaterials(fetchedMaterials.filter(Boolean));
//       }
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         mb={4}
//       />

//       <VStack spacing={4} align="stretch">
//         {loading
//           ? Array.from({ length: 3 }).map((_, i) => (
//               <Skeleton key={i} height="150px" borderRadius="md" />
//             ))
//           : filteredMaterials.map((item) => (
//               <Box key={item.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
//                 <Text fontWeight="bold" mb={2}>{item.title}</Text>
//                 {item.content_type === 'pdf' && (
//                   <a href={item.url} target="_blank" rel="noopener noreferrer">
//                     <FaFilePdf size={50} color="red" />
//                     <Text mt={2}>Open PDF</Text>
//                   </a>
//                 )}
//                 {item.content_type === 'exercise' && (
//                   <a href={item.url} target="_blank" rel="noopener noreferrer">
//                     <Text color="blue.600">Open Exercise</Text>
//                   </a>
//                 )}
//                 {item.content_type === 'video' && item.url ? (
//                   <ReactPlayer
//                     url={item.url}
//                     controls
//                     height="370px"
//                     width="100%"
//                     onEnded={() => setVideoEnded(true)}
//                   />
//                 ) : item.content_type === 'video' && (
//                   <Box>
//                     <FaVideo size={50} color="gray" />
//                     <Text mt={2}>Video not available</Text>
//                   </Box>
//                 )}
//               </Box>
//             ))}
//       </VStack>

//       {videoEnded && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />}
//     </Box>
//   );
// };

// export default Material;












































































// breaked rendenring rules and hooks
// import React, { useEffect, useState } from 'react';
// import { Box, Input, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';

// import {supabase} from '../Supabase/Supabse.js'; // Adjust to your Supabase client setup
// import MaterialCard from './MaterialCard.jsx';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       const { data, error } = await supabase.from('course_content').select('*');
//       if (!error) {
//         setMaterials(data);
//       }
//       setLoading(false);
//     };
//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter((material) =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={4}>
//       <Input
//         placeholder="Search materials..."
//         mb={4}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
//         {loading ? (
//           [...Array(6)].map((_, i) => <Skeleton key={i} height="200px" borderRadius="xl" />)
//         ) : filteredMaterials.length > 0 ? (
//           filteredMaterials.map((item) => <MaterialCard key={item.id} content={item} />)
//         ) : (
//           <Text>No materials found.</Text>
//         )}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;





























































































































// working but searchbar is missing 
// import { useEffect, useState } from 'react';
// import { SimpleGrid, Spinner, Text, Center } from '@chakra-ui/react';
// import MaterialCard from './MaterialCard';
// import { supabase } from '../Supabase/Supabse.js';

// const Material = () => {
//   const [courseMaterials, setCourseMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getPublicUrl = (bucket, path) => {
//     const { data } = supabase.storage.from(bucket).getPublicUrl(path);
//     return data?.publicUrl || '';
//   };

//   const fetchMaterials = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('order_number', { ascending: true });

//     if (error) {
//       console.error('Error fetching course_content:', error.message);
//       setCourseMaterials([]);
//     } else {
//       const formatted = data.map((item) => {
//         let bucket = '';
//         if (item.content_type === 'video') bucket = 'course-videos';
//         else if (item.content_type === 'pdf') bucket = 'course-pdfs';
//         else if (item.content_type === 'exercise') bucket = 'course-exercises';

//         const url = getPublicUrl(bucket, item.storage_path);

//         return {
//           id: item.id,
//           title: item.title,
//           description: item.content,
//           type: item.content_type,
//           url,
//           level: 'Beginner', // fallback since no level column
//           price: item.price,
//           thumbnail: item.content_type === 'video'
//             ? '/default-video-thumbnail.png'
//             : undefined,
//         };
//       });

//       setCourseMaterials(formatted);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Center mt={10}>
//           <Spinner size="xl" />
//         </Center>
//       ) : courseMaterials.length === 0 ? (
//         <Center mt={10}>
//           <Text>No course materials found.</Text>
//         </Center>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
//           {courseMaterials.map((item) => (
//             <MaterialCard key={item.id} {...item} />
//           ))}
//         </SimpleGrid>
//       )}
//     </>
//   );
// };

// export default Material;

 
 
 
 
 // fetching problem 2
  // import { useEffect, useState } from 'react';
// import {
//   Box, Text, Input, InputGroup, InputLeftElement, Spinner, Flex, Button
// } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [subscriptionStatus, setSubscriptionStatus] = useState(false); // Assume subscription status here

//   // Fetch materials from Supabase
//   const fetchMaterials = async (searchQuery = '') => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Fetch error:', error);
//       setLoading(false);
//       return;
//     }

//     // Filter materials based on search query
//     const filtered = data.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     setMaterials(filtered);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials(); // Fetch materials when component mounts
//   }, []);

//   // Search handler
//   const handleSearch = () => {
//     fetchMaterials(query.trim());
//   };

//   // Handle Enter key press for search
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Handle subscription button click (for demo purposes)
//   const handleSubscribe = () => {
//     // Toggle subscription status (this should be connected to actual subscription logic)
//     setSubscriptionStatus(true);
//   };

//   // Render the MaterialCard components with dynamic content based on material type
//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement>
//           <SearchIcon color="gray.400" onClick={handleSearch} cursor="pointer" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 title={material.title}
//                 content_type={material.content_type}
//                 storage_path={material.storage_path}
//                 price={material.content_type === 'video' ? material.price : null}
//                 subscriptionStatus={subscriptionStatus}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search
//             </Text>
//           )}
//         </Flex>
//       )}

//       {/* Subscription button for demonstration */}
//       {!subscriptionStatus && (
//         <Flex justify="center" mt={6}>
//           <Button onClick={handleSubscribe} colorScheme="blue">Subscribe to Access Premium Content</Button>
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default Material;







// import { useEffect, useState } from 'react';
// import {
//   Box, Text, Input, InputGroup, InputLeftElement, Spinner, Flex
// } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import MaterialCard from './MaterialCard';

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Function to fetch materials from Supabase
//   const fetchMaterials = async (searchQuery = '') => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Fetch error:', error);
//       setLoading(false);
//       return;
//     }

//     // Filter materials based on the search query
//     const filtered = data.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     setMaterials(filtered);
//     setLoading(false);
//   };

//   // Trigger fetch on initial load
//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   // Handle search when the user clicks search button or presses Enter
//   const handleSearch = () => {
//     fetchMaterials(query.trim());
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement>
//           <SearchIcon color="gray.400" onClick={handleSearch} cursor="pointer" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 {...material}
//                 price={material.content_type === 'video' ? material.price : null}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search
//             </Text>
//           )}
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;
























// debugged one
// Material.jsx
// import { useEffect, useState } from 'react';
// import {
//   Box, Input, InputGroup, InputLeftElement, IconButton, Spinner, Text, Flex,
//   useColorModeValue, SimpleGrid, Badge, Image, Button, Modal, ModalOverlay,
//   ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, content_type, storage_path, created_at, price, duration, thumbnail_url }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue('0 0 15px rgba(255, 165, 0, 0.5)', '0 0 15px rgba(56, 178, 172, 0.5)');
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   const fileUrl =
//     content_type === 'video'
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : content_type === 'pdf'
//         ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//         : '#';

//   const thumbnailSrc =
//     content_type === 'video'
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//       : '/assets/pdf-thumbnail-placeholder.jpg';

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       transition="all 0.3s ease"
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300'),
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//     >
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image
//           src={thumbnailSrc}
//           alt={title}
//           height="200px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       <Text fontSize="xl" fontWeight="bold" mb={2}>
//         {title}
//       </Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       <Flex align="center" justify="space-between" mt={4}>
//         {price && <Text fontSize="xl" fontWeight="bold">${price}/month</Text>}
//         <Button colorScheme="orange" onClick={onOpen} rightIcon={<ArrowForwardIcon />}>
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             {content_type === 'video' && (
//               <Button mt={4} as="a" href={fileUrl} target="_blank" colorScheme="blue">
//                 Preview Video
//               </Button>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchMaterials = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     console.log('Raw data:', data);
//     console.log('Error:', error);

//     if (data && !error) {
//       const filtered = data.filter(
//         (item) =>
//           item.is_visible === true &&
//           item.title.toLowerCase().includes(query.toLowerCase())
//       );
//       console.log('Filtered:', filtered);
//       setMaterials(filtered);
//     } else {
//       setMaterials([]);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const handleSearch = () => {
//     fetchMaterials();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       fetchMaterials();
//     }
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.400" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <IconButton
//           aria-label="Search"
//           icon={<SearchIcon />}
//           onClick={handleSearch}
//           ml={2}
//           colorScheme="orange"
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : materials.length === 0 ? (
//         <Text textAlign="center" fontSize="xl" mt={10}>
//           No materials found matching your search
//         </Text>
//       ) : (
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
//           {materials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;




















// no debugging
// import { useEffect, useState } from 'react';
// import {
//   Box, Text, Button, Image, useColorModeValue, Badge, Input, InputGroup,
//   InputLeftElement, InputRightElement, Spinner, Flex, Modal, ModalOverlay,
//   ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({
//   title,
//   content_type,
//   storage_path,
//   created_at,
//   price,
//   duration,
//   thumbnail_url
// }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   const fileUrl =
//     content_type === 'video'
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : content_type === 'pdf'
//       ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//       : supabase.storage.from('course-exercises').getPublicUrl(storage_path).data.publicUrl;

//   const thumbnailSrc =
//     content_type === 'video'
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//       : content_type === 'pdf'
//       ? '/assets/pdf-thumbnail-placeholder.jpg'
//       : '/assets/exercise-thumbnail.jpg';

//   return (
//     <Box
//       minW="400px"
//       maxW="450px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//       transition="all 0.3s ease"
//     >
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image
//           src={thumbnailSrc}
//           alt={title}
//           height="250px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       <Flex align="center" justify="space-between" mt={4}>
//         {price && <Text fontSize="xl" fontWeight="bold">${price}/month</Text>}
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           onClick={onOpen}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             <Button mt={4} as="a" href={fileUrl} target="_blank" colorScheme="blue">
//               Preview Material
//             </Button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchMaterials = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('course_content')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (!error) {
//       const filtered = data.filter(item =>
//         item.is_visible === true &&
//         item.title.toLowerCase().includes(query.toLowerCase())
//       );
//       setMaterials(filtered);
//     } else {
//       console.error('Supabase error:', error.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, [query]);

//   const handleSearch = () => {
//     setQuery(search.trim());
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6} mx="auto">
//         <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input
//           placeholder="Search materials by title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={handleKeyPress}
//         />
//         <InputRightElement width="4.5rem">
//           <Button size="sm" onClick={handleSearch} colorScheme="orange">Search</Button>
//         </InputRightElement>
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <Flex gap={8} justify="center" flexWrap="wrap">
//           {materials.length > 0 ? (
//             materials.map((material) => (
//               <MaterialCard
//                 key={material.id}
//                 {...material}
//                 price={material.content_type === 'video' ? material.price : null}
//               />
//             ))
//           ) : (
//             <Text textAlign="center" fontSize="xl" mt={10}>
//               No materials found matching your search.
//             </Text>
//           )}
//         </Flex>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;



















































// it is not fetching from supabase
// import { useEffect, useState } from 'react';
// import {
//   Flex, Box, Text, Button, Image, useColorModeValue, Badge,
//   Input, InputGroup, InputLeftElement, Spinner, SimpleGrid,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ 
//   title, 
//   content_type, 
//   storage_path, 
//   created_at, 
//   price, 
//   duration,
//   thumbnail_url
// }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');
//   const hoverColor = useColorModeValue('orange.500', 'teal.300');

//   // Determine file URL and type
//   const fileUrl = content_type === 'video' 
//     ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//     : supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;

//   // Determine thumbnail source
//   const thumbnailSrc = content_type === 'video' 
//     ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//     : '/assets/pdf-thumbnail-placeholder.jpg';

//   return (
//     <Box
//       minW="400px"
//       maxW="450px"
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       p={6}
//       transition="all 0.3s ease"
//       position="relative"
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//       borderColor={useColorModeValue('gray.200', 'gray.600')}
//     >
//       {/* Top Badges */}
//       <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
//         <Badge
//           px={3}
//           py={1}
//           borderRadius="full"
//           bg={badgeBg}
//           color={badgeColor}
//           fontSize="sm"
//           boxShadow="md"
//         >
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge
//             px={3}
//             py={1}
//             borderRadius="full"
//             bg={badgeBg}
//             color={badgeColor}
//             fontSize="sm"
//             boxShadow="md"
//           >
//             {duration}
//           </Badge>
//         )}
//       </Flex>

//       {/* Thumbnail Image */}
//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         <Image 
//           src={thumbnailSrc}
//           alt={title}
//           height="250px"
//           width="100%"
//           objectFit="cover"
//           fallbackSrc="/assets/placeholder.jpg"
//         />
//       </Box>

//       {/* Material Details */}
//       <Text fontSize="xl" fontWeight="bold" mb={2}>
//         {title}
//       </Text>
//       <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//         Uploaded: {new Date(created_at).toLocaleDateString()}
//       </Text>

//       {/* Price and Action Button */}
//       <Flex align="center" justify="space-between" mt={4}>
//         {price && (
//           <Text fontSize="xl" fontWeight="bold">
//             ${price}/month
//           </Text>
//         )}
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           onClick={onOpen}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       {/* Subscription Modal */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Subscription Service</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <Text>Subscription functionality is coming soon!</Text>
//             {content_type === 'video' && (
//               <Button 
//                 mt={4} 
//                 as="a" 
//                 href={fileUrl} 
//                 target="_blank" 
//                 colorScheme="blue"
//               >
//                 Preview Video
//               </Button>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (!error) {
//         setMaterials(data.filter(item => 
//           item.title.toLowerCase().includes(search.toLowerCase()) &&
//           item.is_visible === true
//         ));
//       }
//       setLoading(false);
//     };
    
//     fetchMaterials();
//   }, [search]);

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input 
//           placeholder="Search materials..." 
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <Flex gap={8} p={6} justify="center" flexWrap="wrap">
//           {materials.map(material => (
//             <MaterialCard 
//               key={material.id} 
//               {...material} 
//               price={material.content_type === 'video' ? material.price : null}
//             />
//           ))}
//         </Flex>
//       )}

//       {!loading && materials.length === 0 && (
//         <Text textAlign="center" fontSize="xl" mt={10}>
//           No materials found matching your search
//         </Text>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;





















// import { useEffect, useState } from 'react';
// import {
//   Box, Input, InputGroup, InputLeftElement,
//   Spinner, SimpleGrid, Text, Flex, Button, useColorModeValue
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, storage_path, created_at }) => {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const hoverShadow = useColorModeValue('0px 4px 20px rgba(0,0,0,0.1)', '0px 4px 20px rgba(255,255,255,0.1)');

//   const fileUrl = supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;

//   return (
//     <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md" _hover={{ boxShadow: hoverShadow }}>
//       <Text fontSize="lg" fontWeight="bold">{title}</Text>
//       <Text fontSize="sm" color="gray.500">Uploaded: {new Date(created_at).toLocaleDateString()}</Text>
//       <Button mt={4} colorScheme="blue" as="a" href={fileUrl} target="_blank" rightIcon={<ArrowForwardIcon />}>
//         View Material
//       </Button>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')
//         .select('*')
//         .neq('content_type', 'exercise')
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data);
//       setLoading(false);
//     };
//     fetchMaterials();
//   }, []);

//   const filtered = materials.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input placeholder="Search materials..." onChange={(e) => setSearch(e.target.value)} />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filtered.map(material => <MaterialCard key={material.id} {...material} />)}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;










































// this error is saying bad request
// import { useState, useEffect } from 'react';
// import { 
//   Flex, Box, Text, Button, 
//   useColorModeValue, Badge, Input,
//   InputGroup, InputLeftElement,
//   SimpleGrid, Icon, Spinner
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';
// import { supabase } from '../Supabase/Supabse.js';

// const MaterialCard = ({ title, type, file_path, created_at }) => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');

//   const getFileUrl = () => {
//     const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
//     return supabase.storage
//       .from(bucket)
//       .getPublicUrl(file_path).data.publicUrl;
//   };

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       p={6}
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//     >
//       <Flex align="center" mb={3}>
//         <Icon 
//           as={type === 'video' ? FaVideo : FaFilePdf} 
//           w={6} h={6} 
//           mr={2} 
//           color={useColorModeValue('orange.500', 'teal.300')}
//         />
//         <Text fontSize="xl" fontWeight="bold">{title}</Text>
//       </Flex>
      
//       <Flex gap={2} mb={4}>
//         <Badge bg={badgeBg}>{type.toUpperCase()}</Badge>
//         <Badge bg={badgeBg}>{new Date(created_at).toLocaleDateString()}</Badge>
//       </Flex>

//       <Button 
//         as="a"
//         href={getFileUrl()}
//         target="_blank"
//         colorScheme={type === 'video' ? 'orange' : 'teal'}
//         rightIcon={<ArrowForwardIcon />}
//         width="full"
//       >
//         View {type === 'video' ? 'Video' : 'PDF'}
//       </Button>
//     </Box>
//   );
// };

// const Material = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('course_content')  // Fixed table name
//         .select('*')
//         .in('type', ['video', 'pdf'])
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data || []);
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={6}>
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.300" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredMaterials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default Material;


// MaterialPage.jsx
// import { useState, useEffect } from 'react';
// import { 
//   Flex, Box, Text, Button, 
//   useColorModeValue, Badge, Input,
//   InputGroup, InputLeftElement,
//   SimpleGrid, Icon,
//   Spinner
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';

// const MaterialCard = ({ title, type, file_path, created_at }) => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');

//   const getFileUrl = () => {
//     const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
//     return supabase.storage
//       .from(bucket)
//       .getPublicUrl(file_path).data.publicUrl;
//   };

//   return (
//     <Box
//       minW="300px"
//       maxW="400px"
//       borderWidth="1px"
//       borderRadius="lg"
//       p={6}
//       _hover={{
//         transform: 'translateY(-5px)',
//         boxShadow: cardHoverGlow,
//         borderColor: useColorModeValue('orange.300', 'teal.300')
//       }}
//     >
//       <Flex align="center" mb={3}>
//         <Icon 
//           as={type === 'video' ? FaVideo : FaFilePdf} 
//           w={6} h={6} 
//           mr={2} 
//           color={useColorModeValue('orange.500', 'teal.300')}
//         />
//         <Text fontSize="xl" fontWeight="bold">{title}</Text>
//       </Flex>
      
//       <Flex gap={2} mb={4}>
//         <Badge bg={badgeBg}>{type.toUpperCase()}</Badge>
//         <Badge bg={badgeBg}>{new Date(created_at).toLocaleDateString()}</Badge>
//       </Flex>

//       <Button 
//         as="a"
//         href={getFileUrl()}
//         target="_blank"
//         colorScheme={type === 'video' ? 'orange' : 'teal'}
//         rightIcon={<ArrowForwardIcon />}
//         width="full"
//       >
//         View {type === 'video' ? 'Video' : 'PDF'}
//       </Button>
//     </Box>
//   );
// };

// const MaterialPage = () => {
//   const [materials, setMaterials] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const { data, error } = await supabase
//         .from('content')
//         .select('*')
//         .in('type', ['video', 'pdf'])
//         .order('created_at', { ascending: false });

//       if (!error) setMaterials(data || []);
//       setLoading(false);
//     };

//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box p={6}>
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.300" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search materials..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredMaterials.map((material) => (
//             <MaterialCard key={material.id} {...material} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default MaterialPage;

// import {
//   SimpleGrid,
//   Box,
//   Text,
//   Input,
//   Icon,
//   useColorModeValue,
//   Flex,
//   Heading,
//   Badge
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { FaFilePdf, FaVideo } from "react-icons/fa";

// const Material = () => {
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const materials = [
//     { id: 1, title: "React Guide", type: "pdf", price: 15, duration: "2h", level: "Beginner" },
//     { id: 2, title: "JavaScript Course", type: "video", price: 25, duration: "4h", level: "Intermediate" },
//     { id: 3, title: "Chakra UI Tutorial", type: "pdf", price: 10, duration: "1h", level: "Beginner" },
//     { id: 4, title: "Web Development", type: "video", price: 30, duration: "6h", level: "Advanced" },
//   ];

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Color mode values
//   const bgColor = useColorModeValue("orange.50", "teal.900");
//   const cardBg = useColorModeValue("white", "teal.800");
//   const textColor = useColorModeValue("orange.800", "white");
//   const glow = useColorModeValue("0 0 15px rgba(255,165,0,0.3)", "0 0 15px rgba(56,178,172,0.3)");
//   const durationBadgeColor = useColorModeValue("orange", "teal");
//   const levelBadgeColor = useColorModeValue({ light: "green", dark: "teal" }, { light: "purple", dark: "pink" });

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <Heading mb={8} textAlign="center" color={textColor}>
//         Study Materials
//       </Heading>
      
//       <Input
//         placeholder="Search materials..."
//         mb={8}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         bg="white"
//         _dark={{ bg: "teal.700" }}
//       />

//       <SimpleGrid columns={[1, 2, 3]} spacing={8}>
//         {filteredMaterials.map(material => (
//           <Box
//             key={material.id}
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             _hover={{ 
//               transform: "translateY(-5px)",
//               boxShadow: glow,
//               transition: "all 0.3s ease" 
//             }}
//             position="relative"
//           >
//             <Flex position="absolute" top={3} right={3} gap={2}>
//               <Badge colorScheme={durationBadgeColor}>
//                 {material.duration}
//               </Badge>
//               <Badge 
//                 colorScheme={material.level === "Beginner" ? 
//                   levelBadgeColor.light : 
//                   levelBadgeColor.dark}
//               >
//                 {material.level}
//               </Badge>
//             </Flex>

//             <Flex align="center" mb={4}>
//               <Icon
//                 as={material.type === "pdf" ? FaFilePdf : FaVideo}
//                 w={8}
//                 h={8}
//                 color={textColor}
//                 mr={3}
//               />
//               <Text fontSize="xl" fontWeight="bold" color={textColor}>
//                 {material.title}
//               </Text>
//             </Flex>
//             <Text color={textColor}>Price: ${material.price}</Text>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;
























// import {
//   SimpleGrid,
//   Box,
//   Text,
//   Input,
//   Icon,
//   useColorModeValue,
//   Flex,
//   Heading
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { FaFilePdf, FaVideo } from "react-icons/fa";

// const Material = () => {
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Sample data - replace with actual data from your backend
//   const materials = [
//     { id: 1, title: "React Guide", type: "pdf", price: 15 },
//     { id: 2, title: "JavaScript Course", type: "video", price: 25 },
//     { id: 3, title: "Chakra UI Tutorial", type: "pdf", price: 10 },
//     { id: 4, title: "Web Development", type: "video", price: 30 },
//   ];

//   const filteredMaterials = materials.filter(material =>
//     material.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const bgColor = useColorModeValue("orange.50", "teal.900");
//   const cardBg = useColorModeValue("white", "teal.800");
//   const textColor = useColorModeValue("orange.800", "white");

//   return (
//     <Box minH="100vh" p={8} bg={bgColor}>
//       <Heading mb={8} textAlign="center" color={textColor}>
//         Study Materials
//       </Heading>
      
//       <Input
//         placeholder="Search materials..."
//         mb={8}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         bg="white"
//         _dark={{ bg: "teal.700" }}
//       />

//       <SimpleGrid columns={[1, 2, 3]} spacing={8}>
//         {filteredMaterials.map(material => (
//           <Box
//             key={material.id}
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
//           >
//             <Flex align="center" mb={4}>
//               <Icon
//                 as={material.type === "pdf" ? FaFilePdf : FaVideo}
//                 w={8}
//                 h={8}
//                 color={textColor}
//                 mr={3}
//               />
//               <Text fontSize="xl" fontWeight="bold" color={textColor}>
//                 {material.title}
//               </Text>
//             </Flex>
//             <Text color={textColor}>Price: ${material.price}</Text>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default Material;