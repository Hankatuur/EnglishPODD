import { Flex, Box, Text, Button, Image, useColorModeValue, Badge } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const CourseCard = ({ title, description, imageUrl, duration, level, rating, lessons, students }) => {
  const cardHoverGlow = useColorModeValue(
    '0 0 15px rgba(255, 165, 0, 0.5)',
    '0 0 15px rgba(56, 178, 172, 0.5)'
  );
  const hoverColor = useColorModeValue('orange.500', 'teal.300');
  const imageHoverColor = useColorModeValue('orange.400', 'teal.200');
  const badgeBg = useColorModeValue('orange.100', 'teal.800');
  const badgeColor = useColorModeValue('orange.800', 'teal.100');

  return (
    <Box
      flex="1"
      minW="400px"
      maxW="450px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      transition="all 0.3s ease"
      position="relative"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: cardHoverGlow,
        borderColor: useColorModeValue('orange.300', 'teal.300')
      }}
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      {/* Top Badges */}
      <Flex position="absolute" top={3} right={3} gap={2} zIndex={1}>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg={badgeBg}
          color={badgeColor}
          fontSize="sm"
          boxShadow="md"
        >
          {duration}
        </Badge>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg={badgeBg}
          color={badgeColor}
          fontSize="sm"
          boxShadow="md"
        >
          {level}
        </Badge>
      </Flex>

      {/* Image with Hover Effect */}
      <Box 
        position="relative" 
        borderRadius="md" 
        mb={4} 
        overflow="hidden"
        role="group"
      >
        <Image 
          src={imageUrl} 
          alt={title} 
          height="250px"
          objectFit="cover"
          transition="all 0.3s ease"
          _groupHover={{
            filter: 'brightness(0.8)',
            transform: 'scale(1.05)'
          }}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={0}
          transition="all 0.3s ease"
          _groupHover={{
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1.1)'
          }}
        >
          <ArrowForwardIcon 
            w={8} 
            h={8} 
            color={imageHoverColor}
            transition="all 0.2s ease"
            _hover={{
              color: hoverColor,
              transform: 'scale(1.2)'
            }}
          />
        </Box>
      </Box>

      {/* Rating and Students */}
      <Flex justify="space-between" mb={2}>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
          ⭐⭐⭐⭐ {rating}
        </Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
          👥 {students} Students
        </Text>
      </Flex>

     
      <Text 
        fontSize="xl" 
        fontWeight="bold" 
        mb={2}
        transition="color 0.2s ease"
        _hover={{ color: hoverColor }}
      >
        {title}
      </Text>

      {/* Course Description */}
      <Text 
        color={useColorModeValue('gray.600', 'gray.300')} 
        mb={4}
        transition="color 0.2s ease"
        _hover={{ color: hoverColor }}
      >
        {description}
      </Text>

      {/* Lessons */}
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
        📖 {lessons} Lessons
      </Text>

      {/* Enroll Button */}
      <Button
        colorScheme={useColorModeValue('orange', 'teal')}
        width="full"
        _hover={{
          transform: 'scale(1.05)'
        }}
        transition="all 0.2s"
      >
        Enroll Now
      </Button>
    </Box>
  );
};

const CourseCards = () => {
  const courses = [
    {
      title: "Grammar",
      description: " Common Everyday grammar mistakes.",
      imageUrl: "/assets/images/course-1.jpg",
      duration: "3 Weeks",
      level: "Beginner",
      rating: "4.6/5",
      lessons: "8 Lessons",
      students: "20"
    },
    {
      title: "Punctuation",
      description: "Learn Proper Punctuation.",
      imageUrl: "/assets/images/course-2.jpg",
      duration: "6 Weeks",
      level: "Intermediate",
      rating: "4.8/5",
      lessons: "12 Lessons",
      students: "35"
    },
    {
      title: "Speaking",
      description: "How to Understand Native Speakers Better.",
      imageUrl: "/assets/images/course-3.jpg",
      duration: "4 Weeks",
      level: "Intermediate",
      rating: "4.5/5",
      lessons: "10 Lessons",
      students: "28"
    }
  ];

  return (
    <Flex gap={8} p={6} justify="center" flexWrap="wrap">
      {courses.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </Flex>
  );
};

export default CourseCards;










































// import { Flex, Box, Text, Button, Image, useColorModeValue } from '@chakra-ui/react';

// const CourseCards = () => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );

//   return (
//     <Flex 
//       gap={8} 
//       p={8} 
//       justify="center" 
//       flexWrap="wrap"
//     >
//       {/* Course Card 1 */}
//       <Box
//         flex="1"
//         minW="400px"
//         maxW="450px"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={6}
//         transition="all 0.3s ease"
//         _hover={{
//           transform: 'translateY(-5px)',
//           boxShadow: cardHoverGlow,
//           borderColor: useColorModeValue('orange.300', 'teal.300')
//         }}
//         borderColor={useColorModeValue('gray.200', 'gray.600')}
//       >
//         <Image 
//           src="/assets/images/course-1.jpg" 
//           alt="Course 1" 
//           borderRadius="md"
//           mb={4}
//           height="300px"
//           objectFit="cover"
//         />
//         <span>Beginner</span>
//         <Text fontSize="xl" fontWeight="bold" mb={2}>
//           Web Development
//         </Text>
//         <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//           Master modern web development with HTML, CSS, JavaScript and frameworks.
//         </Text>
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           width="full"
//           _hover={{
//             transform: 'scale(1.05)'
//           }}
//           transition="all 0.2s"
//         >
//           Enroll Now
//         </Button>
//       </Box>

//       {/* Course Card 2 */}
//       <Box
//         flex="1"
//         minW="400px"
//         maxW="450px"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={6}
//         transition="all 0.3s ease"
//         _hover={{
//           transform: 'translateY(-5px)',
//           boxShadow: cardHoverGlow,
//           borderColor: useColorModeValue('orange.300', 'teal.300')
//         }}
//         borderColor={useColorModeValue('gray.200', 'gray.600')}
//       >
//         <Image 
//           src="/assets/images/course-2.jpg" 
//           alt="Course 2" 
//           borderRadius="md"
//           mb={4}
//           height="300px"
//           objectFit="cover"
//         />
//         <Text fontSize="xl" fontWeight="bold" mb={2}>
//           Data Science
//         </Text>
//         <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//           Learn data analysis, machine learning, and data visualization techniques.
//         </Text>
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           width="full"
//           _hover={{
//             transform: 'scale(1.05)'
//           }}
//           transition="all 0.2s"
//         >
//           Enroll Now
//         </Button>
//       </Box>

//       {/* Course Card 3 */}
//       <Box
//         flex="1"
//         minW="400px"
//         maxW="450px"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={6}
//         transition="all 0.3s ease"
//         _hover={{
//           transform: 'translateY(-5px)',
//           boxShadow: cardHoverGlow,
//           borderColor: useColorModeValue('orange.300', 'teal.300')
//         }}
//         borderColor={useColorModeValue('gray.200', 'gray.600')}
//       >
//         <Image 
//           src="/assets/images/course-3.jpg" 
//           alt="Course 3" 
//           borderRadius="md"
//           mb={4}
//           height="300px"
//           objectFit="cover"
//         />
//         <Text fontSize="xl" fontWeight="bold" mb={2}>
//           Mobile Development
//         </Text>
//         <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
//           Build native mobile apps for iOS and Android using modern frameworks.
//         </Text>
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           width="full"
//           _hover={{
//             transform: 'scale(1.05)'
//           }}
//           transition="all 0.2s"
//         >
//           Enroll Now
//         </Button>
//       </Box>
//     </Flex>
//   );
// };

// export default CourseCards;



































































// import { Flex, Box, Text, Button, Image, useColorModeValue } from '@chakra-ui/react';
// import { ArrowForwardIcon } from '@chakra-ui/icons';

// const CourseCards = () => {
//   const cardHoverGlow = useColorModeValue(
//     '0 0 15px rgba(255, 165, 0, 0.5)',
//     '0 0 15px rgba(56, 178, 172, 0.5)'
//   );
//   const hoverColor = useColorModeValue('orange.500', 'teal.300');
//   const imageHoverColor = useColorModeValue('orange.400', 'teal.200');

//   return (
//     <Flex 
//       gap={8} 
//       p={8} 
//       justify="center" 
//       flexWrap="wrap"
//     >
//       {/* Course Card 1 */}
//       <Box
//         flex="1"
//         minW="400px"
//         maxW="450px"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={6}
//         transition="all 0.3s ease"
//         _hover={{
//           transform: 'translateY(-5px)',
//           boxShadow: cardHoverGlow,
//           borderColor: useColorModeValue('orange.300', 'teal.300')
//         }}
//         borderColor={useColorModeValue('gray.200', 'gray.600')}
//       >
//         <Box 
//           position="relative" 
//           borderRadius="md" 
//           mb={4} 
//           overflow="hidden"
//           role="group"
//         >
//           <Image 
//             src="/assets/images/course-1.jpg" 
//             alt="Course 1" 
//             height="300px"
//             objectFit="cover"
//             transition="all 0.3s ease"
//             _groupHover={{
//               filter: 'brightness(0.8)',
//               transform: 'scale(1.05)'
//             }}
//           />
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             transform="translate(-50%, -50%)"
//             opacity={0}
//             transition="all 0.3s ease"
//             _groupHover={{
//               opacity: 1,
//               transform: 'translate(-50%, -50%) scale(1.1)'
//             }}
//           >
//             <ArrowForwardIcon 
//               w={8} 
//               h={8} 
//               color={imageHoverColor}
//               transition="all 0.2s ease"
//               _hover={{
//                 color: hoverColor,
//                 transform: 'scale(1.2)'
//               }}
//             />
//           </Box>
//         </Box>
//         <Text 
//           fontSize="xl" 
//           fontWeight="bold" 
//           mb={2}
//           transition="color 0.2s ease"
//           _hover={{ color: hoverColor }}
//         >
//           Web Development
//         </Text>
//         <Text 
//           color={useColorModeValue('gray.600', 'gray.300')} 
//           mb={4}
//           transition="color 0.2s ease"
//           _hover={{ color: hoverColor }}
//         >
//           Master modern web development with HTML, CSS, JavaScript and frameworks.
//         </Text>
//         <Button
//           colorScheme={useColorModeValue('orange', 'teal')}
//           width="full"
//           _hover={{
//             transform: 'scale(1.05)'
//           }}
//           transition="all 0.2s"
//         >
//           Enroll Now
//         </Button>
//       </Box>

//       {/* Repeat similar structure for Course Cards 2 and 3 */}
//     </Flex>
//   );
// };

// export default CourseCards;