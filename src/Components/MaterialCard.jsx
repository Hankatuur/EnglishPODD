import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
  Badge,
  Button,
} from '@chakra-ui/react';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import ReactPlayer from 'react-player';

const MaterialCard = ({ title, type, isFree, url, duration, isSubscribed }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('gray.700', 'gray.100');
  const buttonColor = useColorModeValue('orange.500', 'orange.300');

  // State to track if the preview has ended
  const [isPreviewEnded, setIsPreviewEnded] = useState(false);

  // Ref to store the ReactPlayer instance
  const playerRef = useRef(null);

  // Debug Log: Verify Component Rendering
  console.log("MaterialCard Component Rendered", { title, type, isFree, url, isSubscribed });

  // useEffect to handle the playback behavior when video is locked
  useEffect(() => {
    if (!isFree && type === 'video' && url) {
      let previewDuration = 5; // Default preview duration for videos > 1 minute
      if (duration && duration <= 60) {
        previewDuration = 2; // Preview duration for videos <= 1 minute
      }
      console.log(`Video is locked. Playing for preview duration: ${previewDuration} seconds`);

      // Set timeout to pause the video after the preview duration
      const timer = setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.pause();
          setIsPreviewEnded(true);
          console.log('Preview ended for', title);
        } else {
          console.error('Error: ReactPlayer instance is undefined!');
        }
      }, previewDuration * 1000);

      // Clean up the timeout on component unmount
      return () => clearTimeout(timer);
    }
  }, [isFree, type, url, duration, title]);

  // Handle download for PDFs (free or locked)
  const handleDownload = () => {
    console.log('Download attempted for PDF:', title, url);
    if (isFree && url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = title;
      link.click();
    } else {
      console.log('PDF is not free or URL is missing');
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      borderColor={borderColor}
      p={4}
      w="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      _hover={{ transform: 'scale(1.03)', transition: '0.3s' }}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {title}
        </Text>
        <Badge colorScheme={isFree ? 'green' : 'red'}>
          {isFree ? 'Free' : 'Locked'}
        </Badge>
      </Flex>

      <Box flex="1" display="flex" alignItems="center" justifyContent="center" mb={3}>
        {type === 'video' && url ? (
          <Box position="relative" aspectRatio={16 / 9} overflow="hidden">
            <ReactPlayer
              ref={playerRef} // Store the ReactPlayer instance in the ref
              url={url}
              controls
              width="100%"
              height="100%"
              style={{ borderRadius: '10px' }}
              playing={!isPreviewEnded && (isFree || isSubscribed)} // Play if free or subscribed
            />
            {duration && (
              <Badge
                position="absolute"
                bottom="2"
                right="2"
                fontSize="xs"
                bg="blackAlpha.600"
                color="white"
              >
                {duration}
              </Badge>
            )}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" h="160px">
            <FaFilePdf
              color={iconColor}
              fontSize={{ base: '4rem', md: '3rem', lg: '2.5rem' }}
            />
          </Box>
        )}
      </Box>

      <Flex justify="space-between" align="center" mt={2}>
        <Flex gap={2}>
          {type === 'pdf' && isFree && (
            <IconButton
              icon={<FaDownload />}
              size="sm"
              aria-label="Download PDF"
              onClick={handleDownload}
              _hover={{ transform: 'scale(1.1)', bg: 'green.400' }}
            />
          )}
          {!isFree && !isSubscribed && (
            <Button
              size="sm"
              colorScheme="orange"
              onClick={() => window.location.href = '/subscription'}
              _hover={{ bg: buttonColor }}
            >
              Subscribe
            </Button>
          )}
        </Flex>
        <Text fontSize="xs" color="gray.500">
          {type === 'video' ? 'Video' : type.toUpperCase()}
        </Text>
      </Flex>
    </Box>
  );
};

export default MaterialCard;





 























// import React, { useState, useRef } from 'react';
// import {
//   Box,
//   Text,
//   IconButton,
//   Flex,
//   useColorModeValue,
//   Badge,
//   Button,
// } from '@chakra-ui/react';
// import { FaDownload, FaHeart, FaFilePdf, FaVideo } from 'react-icons/fa';
// import ReactPlayer from 'react-player';

// const MaterialCard = ({ title, type, isFree, url, duration, isSubscribed }) => {
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const iconColor = useColorModeValue('gray.700', 'gray.100');
//   const buttonColor = useColorModeValue('orange.500', 'orange.300');

//   // State to track if the preview has ended
//   const [isPreviewEnded, setIsPreviewEnded] = useState(false);

//   // Ref to store the ReactPlayer instance
//   const playerRef = useRef(null);

//   // Handle download for PDFs
//   const handleDownload = () => {
//     if (isFree && url) {
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = title;
//       link.click();
//     }
//   };

//   // Handle video playback for previews
//   const handleOnPlay = () => {
//     if (!isFree && type === 'video') {
//       let previewDuration = 30; // Default preview duration for videos > 1 minute

//       if (duration && duration <= 60) {
//         previewDuration = 10; // Preview duration for videos <= 1 minute
//       }

//       setTimeout(() => {
//         if (playerRef.current) {
//           playerRef.current.pause(); // Pause the video after the preview duration
//           setIsPreviewEnded(true);
//         } else {
//           console.error(
//             `%c [MaterialCard] Error: ReactPlayer instance is undefined!`,
//             'color: red; font-weight: bold;'
//           );
//         }
//       }, previewDuration * 1000);
//     }
//   };

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="2xl"
//       overflow="hidden"
//       borderColor={borderColor}
//       p={4}
//       w="100%"
//       display="flex"
//       flexDirection="column"
//       justifyContent="space-between"
//       _hover={{ transform: 'scale(1.03)', transition: '0.3s' }}
//     >
//       <Flex justify="space-between" align="center" mb={3}>
//         <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
//           {title}
//         </Text>
//         <Badge colorScheme={isFree ? 'green' : 'red'}>
//           {isFree ? 'Free' : 'Locked'}
//         </Badge>
//       </Flex>

//       <Box flex="1" display="flex" alignItems="center" justifyContent="center" mb={3}>
//         {type === 'video' && url ? (
//           <Box position="relative" aspectRatio={16 / 9} overflow="hidden">
//             <ReactPlayer
//               ref={playerRef} // Store the ReactPlayer instance in the ref
//               url={url}
//               controls
//               width="100%"
//               height="100%"
//               style={{ borderRadius: '10px' }}
//               playing={!isPreviewEnded && (isFree || isSubscribed)} // Only play if free or subscribed
//               onPlay={handleOnPlay} // Handle playback for previews
//             />
//             {duration && (
//               <Badge
//                 position="absolute"
//                 bottom="2"
//                 right="2"
//                 colorScheme="blackAlpha"
//                 fontSize="xs"
//                 bg="blackAlpha.600"
//               >
//                 {duration}
//               </Badge>
//             )}
//           </Box>
//         ) : (
//           <Box display="flex" justifyContent="center" alignItems="center" h="160px">
//             <FaFilePdf
//               color={iconColor}
//               fontSize={{ base: '4rem', md: '3rem', lg: '2.5rem' }}
//             />
//           </Box>
//         )}
//       </Box>

//       <Flex justify="space-between" align="center" mt={2}>
//         <Flex gap={2}>
//           {type === 'pdf' && isFree && (
//             <IconButton
//               icon={<FaDownload />}
//               size="sm"
//               aria-label="Download PDF"
//               onClick={handleDownload}
//               _hover={{ transform: 'scale(1.1)', bg: 'green.400' }}
//             />
//           )}
//           <IconButton
//             icon={<FaHeart />}
//             size="sm"
//             aria-label="Like"
//             _hover={{ transform: 'scale(1.1)', bg: 'pink.400' }}
//           />
//           {!isFree && !isSubscribed && (
//             <Button
//               size="sm"
//               colorScheme="orange"
//               onClick={() => window.location.href = '/subscription'} // Redirect to subscription page
//               _hover={{ bg: buttonColor }}
//             >
//               Subscribe
//             </Button>
//           )}
//         </Flex>
//         <Text fontSize="xs" color="gray.500">
//           {type === 'video' ? 'Video' : type.toUpperCase()}
//         </Text>
//       </Flex>
//     </Box>
//   );
// };

// export default MaterialCard;





































// import React, { useState, useRef } from 'react';
// import {
//   Box,
//   Text,
//   IconButton,
//   Flex,
//   useColorModeValue,
//   Badge,
//   Button,
// } from '@chakra-ui/react';
// import { FaDownload, FaHeart, FaFilePdf, FaVideo } from 'react-icons/fa';
// import ReactPlayer from 'react-player';

// const MaterialCard = ({ title, type, isFree, url, duration, isSubscribed }) => {
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const iconColor = useColorModeValue('gray.700', 'gray.100');
//   const buttonColor = useColorModeValue('orange.500', 'orange.300');

//   // State to track if the preview has ended
//   const [isPreviewEnded, setIsPreviewEnded] = useState(false);

//   // Ref to store the ReactPlayer instance
//   const playerRef = useRef(null);

//   // Handle download for PDFs
//   const handleDownload = () => {
//     if (isFree && url) {
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = title;
//       link.click();
//     }
//   };

//   // Handle video playback for previews
//   const handleOnPlay = () => {
//     if (!isFree && type === 'video') {
//       let previewDuration = 30; // Default preview duration for videos > 1 minute

//       if (duration && duration <= 60) {
//         previewDuration = 10; // Preview duration for videos <= 1 minute
//       }

//       setTimeout(() => {
//         if (playerRef.current) {
//           playerRef.current.pause(); // Pause the video after the preview duration
//           setIsPreviewEnded(true);
//         } else {
//           console.error(
//             `%c [MaterialCard] Error: ReactPlayer instance is undefined!`,
//             'color: red; font-weight: bold;'
//           );
//         }
//       }, previewDuration * 1000);
//     }
//   };

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="2xl"
//       overflow="hidden"
//       borderColor={borderColor}
//       p={4}
//       w="100%"
//       display="flex"
//       flexDirection="column"
//       justifyContent="space-between"
//       _hover={{ transform: 'scale(1.03)', transition: '0.3s' }}
//     >
//       <Flex justify="space-between" align="center" mb={3}>
//         <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
//           {title}
//         </Text>
//         <Badge colorScheme={isFree ? 'green' : 'red'}>
//           {isFree ? 'Free' : 'Locked'}
//         </Badge>
//       </Flex>

//       <Box flex="1" display="flex" alignItems="center" justifyContent="center" mb={3}>
//         {type === 'video' && url ? (
//           <Box position="relative" aspectRatio={16 / 9} overflow="hidden">
//             <ReactPlayer
//               ref={playerRef} // Store the ReactPlayer instance in the ref
//               url={url}
//               controls
//               width="100%"
//               height="100%"
//               style={{ borderRadius: '10px' }}
//               playing={!isPreviewEnded && (isFree || isSubscribed)} // Only play if free or subscribed
//               onPlay={handleOnPlay} // Handle playback for previews
//             />
//             {duration && (
//               <Badge
//                 position="absolute"
//                 bottom="2"
//                 right="2"
//                 colorScheme="blackAlpha"
//                 fontSize="xs"
//                 bg="blackAlpha.600"
//               >
//                 {duration}
//               </Badge>
//             )}
//           </Box>
//         ) : (
//           <Box display="flex" justifyContent="center" alignItems="center" h="160px">
//             <FaFilePdf
//               color={iconColor}
//               fontSize={{ base: '4rem', md: '3rem', lg: '2.5rem' }}
//             />
//           </Box>
//         )}
//       </Box>

//       <Flex justify="space-between" align="center" mt={2}>
//         <Flex gap={2}>
//           {type === 'pdf' && isFree && (
//             <IconButton
//               icon={<FaDownload />}
//               size="sm"
//               aria-label="Download PDF"
//               onClick={handleDownload}
//               _hover={{ transform: 'scale(1.1)', bg: 'green.400' }}
//             />
//           )}
//           <IconButton
//             icon={<FaHeart />}
//             size="sm"
//             aria-label="Like"
//             _hover={{ transform: 'scale(1.1)', bg: 'pink.400' }}
//           />
//           {!isFree && !isSubscribed && (
//             <Button
//               size="sm"
//               colorScheme="orange"
//               onClick={() => alert('Redirecting to subscription page...')}
//               _hover={{ bg: buttonColor }}
//             >
//               Subscribe
//             </Button>
//           )}
//         </Flex>
//         <Text fontSize="xs" color="gray.500">
//           {type === 'video' ? 'Video' : type.toUpperCase()}
//         </Text>
//       </Flex>
//     </Box>
//   );
// };

// export default MaterialCard;





















  
  
  
  
  // correct but with out subscription validations 
  // import React, { useState, useRef } from 'react';
  // import {
  //   Box,
  //   Text,
  //   IconButton,
  //   Flex,
  //   useColorModeValue,
  //   Badge,
  // } from '@chakra-ui/react';
  // import { FaDownload, FaHeart, FaFilePdf, FaVideo } from 'react-icons/fa';
  // import ReactPlayer from 'react-player';
  
  // const MaterialCard = ({ title, type, isFree, url, duration }) => {
  //   const borderColor = useColorModeValue('gray.200', 'gray.600');
  //   const iconColor = useColorModeValue('gray.700', 'gray.100');
  
  //   // Debug: Log the props received by the component
  //   console.log(
  //     `%c [MaterialCard] Props Received:`,
  //     'color: green; font-weight: bold;',
  //     { title, type, isFree, url, duration }
  //   );
  
  //   // State to track if the preview has ended
  //   const [isPreviewEnded, setIsPreviewEnded] = useState(false);
  
  //   // Ref to store the ReactPlayer instance
  //   const playerRef = useRef(null);
  
  //   // Handle download for PDFs
  //   const handleDownload = () => {
  //     if (isFree && url) {
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = title;
  //       link.click();
  //     }
  //   };
  
  //   // Handle video playback for previews
  //   const handleOnPlay = () => {
  //     if (!isFree && type === 'video') {
  //       let previewDuration = 30; // Default preview duration for videos > 1 minute
  
  //       if (duration && duration <= 60) {
  //         previewDuration = 10; // Preview duration for videos <= 1 minute
  //       }
  
  //       console.log(
  //         `%c [MaterialCard] Preview Duration:`,
  //         'color: blue; font-weight: bold;',
  //         previewDuration
  //       );
  
  //       setTimeout(() => {
  //         if (playerRef.current) {
  //           playerRef.current.pause(); // Pause the video after the preview duration
  //           setIsPreviewEnded(true);
  //         } else {
  //           console.error(
  //             `%c [MaterialCard] Error: ReactPlayer instance is undefined!`,
  //             'color: red; font-weight: bold;'
  //           );
  //         }
  //       }, previewDuration * 1000);
  //     }
  //   };
  
  //   return (
  //     <Box
  //       borderWidth="1px"
  //       borderRadius="2xl"
  //       overflow="hidden"
  //       borderColor={borderColor}
  //       p={4}
  //       w="100%"
  //       display="flex"
  //       flexDirection="column"
  //       justifyContent="space-between"
  //       _hover={{ transform: 'scale(1.03)', transition: '0.3s' }}
  //     >
  //       <Flex justify="space-between" align="center" mb={3}>
  //         <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
  //           {title}
  //         </Text>
  //         <Badge colorScheme={isFree ? 'green' : 'red'}>
  //           {isFree ? 'Free' : 'Locked'}
  //         </Badge>
  //       </Flex>
  
  //       <Box flex="1" display="flex" alignItems="center" justifyContent="center" mb={3}>
  //         {type === 'video' && url ? (
  //           <Box position="relative" aspectRatio={16 / 9} overflow="hidden">
  //             <ReactPlayer
  //               ref={playerRef} // Store the ReactPlayer instance in the ref
  //               url={url}
  //               controls
  //               width="100%"
  //               height="100%"
  //               style={{ borderRadius: '10px' }}
  //               playing={!isPreviewEnded && !isFree} // Only play if not preview-ended and free
  //               onPlay={handleOnPlay} // Handle playback for previews
  //             />
  //             {duration && (
  //               <Badge
  //                 position="absolute"
  //                 bottom="2"
  //                 right="2"
  //                 colorScheme="blackAlpha"
  //                 fontSize="xs"
  //                 bg="blackAlpha.600"
  //               >
  //                 {duration}
  //               </Badge>
  //             )}
  //           </Box>
  //         ) : (
  //           <Box display="flex" justifyContent="center" alignItems="center" h="160px">
  //             <FaFilePdf
  //               color={iconColor}
  //               fontSize={{ base: '4rem', md: '3rem', lg: '2.5rem' }}
  //             />
  //           </Box>
  //         )}
  //       </Box>
  
  //       <Flex justify="space-between" align="center" mt={2}>
  //         <Flex gap={2}>
  //           {type === 'pdf' && isFree && (
  //             <IconButton
  //               icon={<FaDownload />}
  //               size="sm"
  //               aria-label="Download PDF"
  //               onClick={handleDownload}
  //               _hover={{ transform: 'scale(1.1)', bg: 'green.400' }}
  //             />
  //           )}
  //           <IconButton
  //             icon={<FaHeart />}
  //             size="sm"
  //             aria-label="Like"
  //             _hover={{ transform: 'scale(1.1)', bg: 'pink.400' }}
  //           />
  //         </Flex>
  //         <Text fontSize="xs" color="gray.500">
  //           {type === 'video' ? 'Video' : type.toUpperCase()}
  //         </Text>
  //       </Flex>
  //     </Box>
  //   );
  // };
  
  // export default MaterialCard;
  
  
  
  
  
  
  // pdf container is too big 
// import {
//   Box,
//   Image,
//   Text,
//   Heading,
//   Stack,
//   AspectRatio,
//   Button,
// } from '@chakra-ui/react';
// import { FaFilePdf, FaVideo } from 'react-icons/fa';

// const MaterialCard = ({ title, description, type, url, thumbnail }) => {
//   return (
//     <Box borderWidth="1px" rounded="lg" overflow="hidden" shadow="md" p={4}>
//       {type === 'video' ? (
//         <AspectRatio ratio={16 / 9}>
//           <video controls src={url} poster={thumbnail} />
//         </AspectRatio>
//       ) : type === 'pdf' ? (
//         <Box textAlign="center" p={2}>
//           <FaFilePdf size={48} color="#E53E3E" />
//         </Box>
//       ) : (
//         <Box textAlign="center" p={2}>
//           <FaVideo size={48} color="gray" />
//         </Box>
//       )}

//       <Stack mt={4} spacing={1}>
//         <Heading fontSize="lg">{title}</Heading>
//         <Text fontSize="sm" noOfLines={2}>
//           {description}
//         </Text>
//         <Button
//           mt={2}
//           as="a"
//           href={url}
//           target="_blank"
//           colorScheme="blue"
//           size="sm"
//         >
//           {type === 'pdf' ? 'View PDF' : type === 'video' ? 'Watch Video' : 'Open'}
//         </Button>
//       </Stack>
//     </Box>
//   );
// };

// export default MaterialCard;

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // Before error 
  // import { Box, Text, Icon, useColorModeValue, Button, HStack, VStack } from '@chakra-ui/react';
// import { FiFileText, FiVideo } from 'react-icons/fi';
// import { PDFIcon } from '@react-pdf/fns';
// import { motion } from 'framer-motion';

// const MotionIcon = motion(Icon);

// const getIconComponent = (type) => {
//   switch (type) {
//     case 'pdf':
//       return PDFIcon;
//     case 'video':
//       return FiVideo;
//     default:
//       return FiFileText;
//   }
// };

// const MaterialCard = ({ type, title, onDownload }) => {
//   const iconColor = useColorModeValue('gray.800', 'white');
//   const bg = useColorModeValue('white', 'gray.700');
//   const IconComponent = getIconComponent(type);

//   return (
//     <Box
//       bg={bg}
//       p={4}
//       rounded="xl"
//       shadow="md"
//       w={{ base: '100%', md: '200px' }}
//       textAlign="center"
//     >
//       <VStack spacing={4}>
//         <MotionIcon
//           as={IconComponent}
//           color={iconColor}
//           fontSize="4xl"
//           whileHover={{ scale: 1.2, rotate: 10 }}
//           transition={{ type: 'spring', stiffness: 300 }}
//         />
//         <Text fontWeight="bold" noOfLines={2} fontSize="sm">
//           {title}
//         </Text>
//         <HStack>
//           <Button
//             size="sm"
//             colorScheme="blue"
//             onClick={onDownload}
//           >
//             Download
//           </Button>
//         </HStack>
//       </VStack>
//     </Box>
//   );
// };

// export default MaterialCard;





















































// incorrect project id
// import { Box, Text, Image, Badge, Button, useColorModeValue } from '@chakra-ui/react';
// import { FaPlay, FaFilePdf } from 'react-icons/fa';
// import { useRef, useState } from 'react';

// const MaterialCard = ({ title, content_type, storage_path }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const bgColor = useColorModeValue('white', 'gray.700');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');

//   const isVideo = content_type === 'video';
//   const isPdf = content_type === 'pdf';

//   const handlePlay = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const bucketBase = 'https://kkjmwlkahplmosqhgqat.supabase.co';
//   const videoUrl = `${bucketBase}course-videos/${storage_path}`;
//   const thumbnailUrl = `${bucketBase}course-videos/${storage_path.replace('.mp4', '.jpg')}`;
//   const pdfUrl = `${bucketBase}course-pdfs/${storage_path}`;

//   return (
//     <Box
//       w="300px"
//       p={4}
//       borderWidth="1px"
//       borderRadius="2xl"
//       boxShadow="md"
//       bg={bgColor}
//       borderColor={borderColor}
//     >
//       <Badge colorScheme="teal" mb={2} textTransform="capitalize">
//         {content_type}
//       </Badge>

//       <Text fontWeight="bold" fontSize="xl" mb={3}>
//         {title}
//       </Text>

//       {isVideo && (
//         <Box position="relative" mb={3}>
//           {!isPlaying ? (
//             <>
//               <Image
//                 src={thumbnailUrl || undefined}
//                 alt="Video Thumbnail"
//                 fallbackSrc="https://via.placeholder.com/300x200?text=No+Thumbnail"
//                 borderRadius="md"
//               />
//               <Button
//                 leftIcon={<FaPlay />}
//                 onClick={handlePlay}
//                 position="absolute"
//                 top="40%"
//                 left="35%"
//                 colorScheme="blue"
//               >
//                 Play
//               </Button>
//             </>
//           ) : (
//             <video
//               ref={videoRef}
//               src={videoUrl}
//               controls
//               width="100%"
//               onEnded={() => setIsPlaying(false)}
//               style={{ borderRadius: '8px' }}
//             />
//           )}
//         </Box>
//       )}

//       {isPdf && (
//         <Box textAlign="center" mb={3}>
//           <FaFilePdf size={48} color="red" style={{ marginBottom: '8px' }} />
//           <Button
//             as="a"
//             href={pdfUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             colorScheme="red"
//           >
//             Open PDF
//           </Button>
//         </Box>
//       )}

//       {!isVideo && !isPdf && (
//         <Text fontSize="sm" color="gray.500">
//           No preview available
//         </Text>
//       )}
//     </Box>
//   );
// };

// export default MaterialCard;















































// import { useState } from 'react';
// import { Box, Text, Button, Image, useColorModeValue, Badge, Spinner, Flex, Icon } from '@chakra-ui/react';
// import { ArrowForwardIcon } from '@chakra-ui/icons'; 
// import { FaFilePdf } from 'react-icons/fa';  // Correct import for PDF icon
// import { supabase } from '../Supabase/Supabse.js';
// import ReactConfetti from 'react-confetti';

// const MaterialCard = ({
//   title,
//   content_type,
//   storage_path,
//   created_at,
//   price,
//   duration,
//   thumbnail_url,
//   is_free
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasFinished, setHasFinished] = useState(false);
//   const [isPdfOpened, setIsPdfOpened] = useState(false);

//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   // Video URL
//   const fileUrl = content_type === 'video'
//     ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//     : '';

//   // PDF URL
//   const pdfUrl = content_type === 'pdf'
//     ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//     : '';

//   // Fallback thumbnail
//   const thumbnailSrc = content_type === 'video'
//     ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//     : '/assets/pdf-thumbnail-placeholder.jpg';

//   // Start playing the video
//   const handlePlay = () => {
//     setIsLoading(true);
//     setIsPlaying(true);
//     setHasFinished(false);
//   };

//   // Video onEnded event handler
//   const handleVideoEnd = () => {
//     setIsPlaying(false);
//     setHasFinished(true);
//   };

//   // Open PDF (if free)
//   const handleOpenPdf = () => {
//     setIsPdfOpened(true);
//   };

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
//         <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
//           {content_type.toUpperCase()}
//         </Badge>
//         {duration && (
//           <Badge px={3} py={1} borderRadius="full" bg={badgeBg} color={badgeColor} fontSize="sm" boxShadow="md">
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
//         {/* Play Button for Video */}
//         {content_type === 'video' && !isPlaying && !hasFinished && (
//           <Button
//             position="absolute"
//             top="50%"
//             left="50%"
//             transform="translate(-50%, -50%)"
//             colorScheme="teal"
//             size="lg"
//             onClick={handlePlay}
//             isLoading={isLoading}
//           >
//             Play
//           </Button>
//         )}

//         {/* PDF Icon Button */}
//         {content_type === 'pdf' && !isPdfOpened && is_free && (
//           <Button
//             position="absolute"
//             top="50%"
//             left="50%"
//             transform="translate(-50%, -50%)"
//             colorScheme="teal"
//             size="lg"
//             onClick={handleOpenPdf}
//           >
//             <Icon as={FaFilePdf} w={6} h={6} />
//             Open PDF
//           </Button>
//         )}
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
//           onClick={handlePlay}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>

//       {/* Confetti Effect for Video */}
//       {hasFinished && <ReactConfetti />}

//       {/* Video Player */}
//       {isPlaying && !hasFinished && (
//         <Box mt={4}>
//           <video
//             width="100%"
//             controls
//             onEnded={handleVideoEnd}
//             onCanPlayThrough={() => setIsLoading(false)} // Video is ready to play
//           >
//             <source src={fileUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </Box>
//       )}

//       {/* PDF View */}
//       {isPdfOpened && content_type === 'pdf' && is_free && (
//         <Box mt={4} p={4}>
//           <iframe
//             src={pdfUrl}
//             width="100%"
//             height="600px"
//             title="PDF Viewer"
//             frameBorder="0"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default MaterialCard;

















// this one too without thumbnail
// import { Box, Text, Button, Image, Badge, useColorModeValue, Flex, Icon } from '@chakra-ui/react';
// import { ArrowForwardIcon } from '@chakra-ui/icons';
// import { FaFilePdf } from 'react-icons/fa'; // For PDF icon
// import { supabase } from '../Supabase/Supabse.js'; // Make sure the path is correct

// const MaterialCard = ({
//   title,
//   content_type,
//   storage_path,
//   created_at,
//   price,
//   duration,
//   thumbnail_url,
// }) => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const badgeBg = useColorModeValue('orange.100', 'teal.800');
//   const badgeColor = useColorModeValue('orange.800', 'teal.100');

//   // Check if content_type exists, otherwise use a default fallback
//   const contentType = content_type ? content_type.toUpperCase() : 'UNKNOWN';

//   // Fetch the public URL based on content type (video or pdf)
//   const fileUrl =
//     content_type === 'video'
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : content_type === 'pdf'
//       ? supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl
//       : null;

//   // Default image or PDF icon
//   const thumbnailSrc =
//     content_type === 'video'
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg' // Fallback for video
//       : content_type === 'pdf'
//       ? '/assets/pdf-icon-placeholder.jpg' // Default for PDFs
//       : null;

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
//           {contentType} {/* Use the default if undefined */}
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

//       {/* Thumbnail or PDF Icon */}
//       <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//         {content_type === 'video' ? (
//           <Image
//             src={thumbnailSrc}
//             alt={title}
//             height="250px"
//             width="100%"
//             objectFit="cover"
//             fallbackSrc="/assets/video-thumbnail-placeholder.jpg" // Fallback for videos
//           />
//         ) : content_type === 'pdf' ? (
//           <Flex justify="center" align="center" height="250px" width="100%" bg="gray.100">
//             <Icon as={FaFilePdf} boxSize={12} color="gray.600" />
//           </Flex>
//         ) : null}
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
//           onClick={() => window.open(fileUrl, '_blank')}
//           rightIcon={<ArrowForwardIcon />}
//           _hover={{ transform: 'scale(1.05)' }}
//         >
//           {price ? 'Subscribe Now' : 'View Material'}
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// export default MaterialCard;




























// no thumbnail and pdf icon
// import {
//     Box, Text, Button, Image, useColorModeValue, Badge, Modal, ModalOverlay,
//     ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
//   } from '@chakra-ui/react';
//   import { ArrowForwardIcon } from '@chakra-ui/icons';
//   import { supabase } from '../Supabase/Supabse.js';
  
//   const MaterialCard = ({
//     title, content_type, storage_path, created_at, price, duration, thumbnail_url
//   }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
    
//     // Determine file URL and type
//     const fileUrl = content_type === 'video' 
//       ? supabase.storage.from('course-videos').getPublicUrl(storage_path).data.publicUrl
//       : supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;
  
//     // Determine thumbnail source
//     const thumbnailSrc = content_type === 'video' 
//       ? thumbnail_url || '/assets/video-thumbnail-placeholder.jpg'
//       : '/assets/pdf-thumbnail-placeholder.jpg';
  
//     const badgeBg = useColorModeValue('orange.100', 'teal.800');
//     const badgeColor = useColorModeValue('orange.800', 'teal.100');
//     const hoverColor = useColorModeValue('orange.500', 'teal.300');
  
//     return (
//       <Box
//         minW="400px"
//         maxW="450px"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={6}
//         transition="all 0.3s ease"
//         position="relative"
//         _hover={{
//           transform: 'translateY(-5px)',
//           boxShadow: '0 0 15px rgba(255, 165, 0, 0.5)',
//           borderColor: useColorModeValue('orange.300', 'teal.300')
//         }}
//         borderColor={useColorModeValue('gray.200', 'gray.600')}
//       >
//         {/* Top Badges */}
//         <Box position="absolute" top={3} right={3} zIndex={1}>
//           <Badge
//             px={3}
//             py={1}
//             borderRadius="full"
//             bg={badgeBg}
//             color={badgeColor}
//             fontSize="sm"
//             boxShadow="md"
//           >
//             {content_type.toUpperCase()}
//           </Badge>
//           {duration && (
//             <Badge
//               px={3}
//               py={1}
//               borderRadius="full"
//               bg={badgeBg}
//               color={badgeColor}
//               fontSize="sm"
//               boxShadow="md"
//             >
//               {duration}
//             </Badge>
//           )}
//         </Box>
  
//         {/* Thumbnail Image */}
//         <Box borderRadius="md" mb={4} overflow="hidden" position="relative">
//           <Image
//             src={thumbnailSrc}
//             alt={title}
//             height="250px"
//             width="100%"
//             objectFit="cover"
//             fallbackSrc="/assets/placeholder.jpg"
//           />
//         </Box>
  
//         {/* Material Details */}
//         <Text fontSize="xl" fontWeight="bold" mb={2}>
//           {title}
//         </Text>
//         <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//           Uploaded: {new Date(created_at).toLocaleDateString()}
//         </Text>
  
//         {/* Price and Action Button */}
//         <Box display="flex" justifyContent="space-between" mt={4}>
//           {price && (
//             <Text fontSize="xl" fontWeight="bold">
//               ${price}/month
//             </Text>
//           )}
//           <Button
//             colorScheme={useColorModeValue('orange', 'teal')}
//             onClick={onOpen}
//             rightIcon={<ArrowForwardIcon />}
//             _hover={{ transform: 'scale(1.05)' }}
//           >
//             {price ? 'Subscribe Now' : 'View Material'}
//           </Button>
//         </Box>
  
//         {/* Subscription Modal */}
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Subscription Service</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody pb={6}>
//               <Text>Subscription functionality is coming soon!</Text>
//               {content_type === 'video' && (
//                 <Button
//                   mt={4}
//                   as="a"
//                   href={fileUrl}
//                   target="_blank"
//                   colorScheme="blue"
//                 >
//                   Preview Video
//                 </Button>
//               )}
//             </ModalBody>
//           </ModalContent>
//         </Modal>
//       </Box>
//     );
//   };
  
//   export default MaterialCard;
  