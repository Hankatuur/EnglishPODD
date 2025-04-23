import { Box, Heading, Image, Text, Flex } from '@chakra-ui/react'
import React from 'react'

const About = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" p={8} gap={12}>
      {/* Image Section */}
      <Box flex={1} maxW="600px">
        <Image 
          src="/assets/images/about-banner.jpg" 
          alt="Language learning" 
          borderRadius="lg"
          objectFit="cover"
          width="100%"
        />
      </Box>

      {/* Text Content */}
      <Box flex={1} maxW="800px">
        <Heading
          as="h2"
          textTransform="uppercase"
          color="white.700"
          mb={5}
          fontSize="24px"
        >
          ABOUT US
        </Heading>

        <Heading
          as="h1"
          fontSize={{ base: "28px", md: "32px" }}
          mb={8}
          fontWeight="bold"
        >
          <Text as="span" color="white.700">1000+ Students Achieved </Text>
          <Text as="span" color="teal.600">Fluency</Text>
          <Text as="span" color="white.700"> Through Our Programs</Text>
        </Heading>

        <Text
          color="gray.600"
          lineHeight="1.7"
          fontSize={{ base: "20px", md: "18px" }}
          fontWeight={"bold"}
        >
          EnglishPod is dedicated to helping learners of all 
          ages and skill levels improve their English in 
          a fun, practical, and engaging way. 
          We offer a wide range of resources, including grammar guides, 
          vocabulary exercises, listening and speaking practice, and interactive quizzes. 
          Whether you're just starting out or aiming to master advanced English, 
          our goal is to support you every step of the way on your language learning journey.
        </Text>
      </Box>
    </Flex>
  )
}

export default About












// import { Box, Heading, Image, Text, VStack, Flex } from '@chakra-ui/react'
// import React from 'react'

// const About = () => {
//   return (
//     <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" p={8} gap={12}>
//       {/* Image Section - Now where text was */}
//       <Box flex={1} maxW="600px">
//         <Image 
//           src="/assets/images/about-banner.jpg" 
//           alt="Language learning" 
//           borderRadius="lg"
//           objectFit="cover"
//           width="100%"
//         />
//       </Box>

//       {/* Text Content - Now where image was */}
//       <Box flex={1} maxW="800px">
//         <Heading
//           as="h2"
//           textTransform="uppercase"
//           color="gray.700"
//           mb={5}
//           fontSize="24px"
//         >
//           ABOUT US
//         </Heading>

//         <Heading
//           as="h1"
//           color="teal.600"
//           fontSize={{ base: "28px", md: "32px" }}
//           mb={8}
//           fontWeight="bold"
//         >
//           1000+ Students Achieved Fluency Through Our Programs
//         </Heading>

//         <Text
//           color="gray.600"
//           lineHeight="1.6"
//           fontSize={{ base: "16px", md: "18px" }}
//         >
//           EnglishPod is dedicated to helping learners of all ages and skill levels improve their English in a fun, practical, and engaging way. We offer a wide range of resources, including grammar guides, vocabulary exercises, listening and speaking practice, and interactive quizzes. Whether you're just starting out or aiming to master advanced English, our goal is to support you every step of the way on your language learning journey.
//         </Text>
//       </Box>
//     </Flex>
//   )
// }

// export default About

























// // import { Box, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'
// // import React from 'react'

// // const About = () => {
// //   return (
// //     <>
   
// //     <Box
// //     maxW="800px"
// //     mx="auto"
// //     p={{ base: "40px 20px", md: "40px" }}
// //     textAlign="center"
// //   >
// //     <Heading
// //       as="h2"
// //       textTransform="uppercase"
// //       color="gray.700"
// //       mb={5}
// //       fontSize="24px"
// //     >
// //       ABOUT US
// //     </Heading>

// //     <Heading
// //       as="h1"
// //       color="teal.600"
// //       fontSize={{ base: "28px", md: "32px" }}
// //       mb={8}
// //       fontWeight="bold"
// //     >
// //       1000+ Students Achieved Fluency Through Our Programs
// //     </Heading>

// //     <Text
// //       color="gray.600"
// //       lineHeight="1.6"
// //       fontSize={{ base: "16px", md: "18px" }}
// //       maxW="600px"
// //       mx="auto"
// //     >
// //       EnglishPod is dedicated to helping learners of all ages and skill levels improve their English in a fun, practical, and engaging way. We offer a wide range of resources, including grammar guides, vocabulary exercises, listening and speaking practice, and interactive quizzes. Whether you're just starting out or aiming to master advanced English, our goal is to support you every step of the way on your language learning journey.
// //     </Text>
// //   </Box>
// //   <HStack spacing={4}>
// //   <Image src="/assets/images/about-banner.jpg" height={"100%"} width={"100%"}/>
// //   </HStack>
// //   </>

// //   )
// // }

// // export default About