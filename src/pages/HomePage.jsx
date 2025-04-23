// HomePage.js
import { Box, Flex, Text, Heading, Button, Image, Highlight, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from "react-router-dom";
import Navbar from './Navbar'
import About from '../Components/About'
import CourseCards from '../Components/CourseCard'
import Footer from '../Components/Footer'
import StatsSection from '../Components/StatsSection'

const HomePage = () => {
  const bgColor = useColorModeValue("orange.500", "teal.600")
  const hoverColor = useColorModeValue("orange.700", "teal.800")
  const glow = useColorModeValue("0 0 10px orange", "0 0 1px teal")

  return (
    <>
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        px={{ base: 6, md: 20 }}
        py={16}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        {/* Text Section */}
        <Box flex="1">
          <Text fontSize="sm" color="teal.500" mb={2}>
            Welcome to EnglishPod!
          </Text>

          <Heading size="2xl" mb={4} lineHeight="short">
            The Best Site For{" "}
            <Highlight
              query="Improving"
              styles={{
                color: "red.400",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Improving
            </Highlight>{" "}
            Your English Skills
          </Heading>
          
          <Text fontSize="25px">
            EnglishPod is an interactive website that helps users improve 
            their English skills through lessons, quizzes, and practice activities for all levels.
          </Text>

          <Button 
  as={RouterLink}
  to="/Materials"
  bg={bgColor}
  color="white"
  _hover={{ bg: hoverColor, boxShadow: glow }}
  size="lg" 
  mt={4}
>
  Find Material
</Button>
        </Box>

        {/* Image Section */}
        <Box flex="1" mt={{ base: 8, md: 0 }} w={{ base: "100%", md: "60%" }}>
          <Flex justify="flex-end" align="center" w="100%" h="100%">
            <Image
              src="/assets/images/hero-banner-1.jpg"
              alt="English learning"
              borderRadius="md"
              boxShadow="lg"
              objectFit="cover"
              height="100%"
              width="70%"
            />
          </Flex>
        </Box>
      </Flex>

      <About />
      <CourseCards />
      <StatsSection />
      
    </Box>
    <Footer/>
    </>
  )
}

export default HomePage




























// import { Box, Flex, Text, Heading, Button, Image, Highlight, useColorModeValue } from '@chakra-ui/react'
// import Navbar from './Navbar'
// import About from '../Components/about'
// import CourseCards from '../Components/CourseCard';
// import Footer from '../Components/Footer';
// import StatsSection from '../Components/StatsSection';


// const HomePage = () => {
//   const bgColor = useColorModeValue("orange.500","teal.600");
//   const hoverColor = useColorModeValue("orange.700","teal.800");
//   const Glow = useColorModeValue("0 0 10px orange","0 0 1px teal");
//   return (
//     <>
//     <Box>
//       <Navbar />
      
      
//       {/* Hero Section */}
//       <Flex
//         direction={{ base: "column", md: "row" }}
//         align="center"
//         justify="space-between"
//         px={{ base: 6, md: 20 }}
//         py={16}
//         bg={useColorModeValue("gray.50", "gray.800")}
//       >
//         {/* Text Section */}
//         <Box flex="1">
//           <Text fontSize="sm" color="teal.500" mb={2}>
//             Welcome to EnglishPod!
//           </Text>

//           <Heading size="2xl" mb={4} lineHeight="short">
//             The Best Site For{" "}
//             <Highlight
//               query="Improving"
//               styles={{
//                 color: "red.400",
//                 fontWeight: "bold",
//                 textDecoration: "underline",
//               }}
//             >

//               Improving
//             </Highlight>{" "}
//            Your English Skills

//           </Heading>
//           <Text fontSize={"25px"}>
//           EnglishPod is an interactive website that helps users improve 
//           their English skills through
//            lessons, quizzes, and practice activities for all levels.
//           </Text>

//           <Button bg={bgColor}
//           color="white"
//           _hover={{bg:hoverColor,boxShadow:Glow}}
//            size="lg" mt={4}>
//             Find Material
//           </Button>
//         </Box>

//         {/* Image Section */}
//         <Box
//   flex="1"
//   mt={{ base: 8, md: 0 }}
//   cursor="pointer"
//   w={{ base: "100%", md: "60%" }}
//   h="100%"
// >
//   <Flex
//     flex="1"
//     justifyContent="flex-end" // this moves the image to the right
//     alignItems="center"       // optional, center vertically
//     w="100%"
//     h="100%"
//   >
//     <Image
//       src="/assets/images/hero-banner-1.jpg"
//       alt="logo-web"
//       borderRadius="md"
//       boxShadow="lg"
//       objectFit="cover"
//       height="100%"
//       width="70%" // keep aspect ratio
//     />
// </Flex>
// </Box>
    
//       </Flex>
//     </Box>

//    <Flex>
//     <About/>
//     </Flex>    

//     <Box>
//       <CourseCards/>
//     </Box>
//     <Box>
//       <StatsSection/>
//     </Box>
//     <Box>
//       <Footer/>
//     </Box>
//     </>
   
    
//   )
// }

// export default HomePage



















// import { Box } from '@chakra-ui/react'
// import React from 'react'
// import Navbar from './Navbar'

// const HomePage = () => {
//   return (
//     <Box >
//         <Navbar/>
//     </Box>
    
//   )
// }

// export default HomePage