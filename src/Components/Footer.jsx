
import {
  Box,
  Flex,
  VStack,
  Text,
  HStack,
  IconButton,
  Image,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const bg = useColorModeValue("gray.800", "orange.200");
  const color = useColorModeValue("white", "gray.800");
  const iconHover = {
    transform: "translateY(-5px)",
    transition: "0.3s",
    filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.2))",
  };

  return (
    <Box as="footer" id="footer" py={8} bg={bg} color={color}>
      <Flex
        maxW="container.lg"
        mx="auto"
        px={4}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={8}
        height="250px"
      >
        <VStack spacing={3} align="center">
          <Image
            src="./assets/images/daalo.png"
            alt="Company Logo"
            boxSize="90px"
            objectFit="contain"
            cursor="pointer"
          />
          <Text fontSize="30px" fontWeight="bold" cursor="pointer">
            EnglishPod
          </Text>
          <Text fontStyle="italic" textAlign="center">
            Improve your English skills through interactive lessons, quizzes, and practice activities for all levels.
          </Text>
          <Text fontStyle="italic" textAlign="center">
            Email: info@englishpod.com
          </Text>
        </VStack>

        <HStack spacing={6}>
          {[
            { icon: FaInstagram, url: "https://instagram.com", color: "#E1306C" },
            { icon: FaWhatsapp, url: "https://wa.me", color: "#25D366" },
            { icon: FaFacebook, url: "https://facebook.com", color: "#3b5998" },
            { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" },
          ].map((social, idx) => (
            <Link key={idx} href={social.url} isExternal>
              <IconButton
                aria-label={social.icon.name}
                icon={<social.icon />}
                variant="variant"
                boxSize="50px"
                fontSize="35px"
                _hover={{ ...iconHover, color: social.color }}
              />
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;














// // Footer.jsx
// import {
//   Box,
//   Flex,
//   VStack,
//   Text,
//   HStack,
//   IconButton,
//   Image,
//   useColorModeValue,
//   Link,
// } from "@chakra-ui/react";
// import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";
// import { useEffect } from "react";
// import { Link as RouterLink } from "react-router-dom"; // Make sure you're using react-router

// const Footer = () => {
//   const bg = useColorModeValue("gray.800", "orange.200");
//   const color = useColorModeValue("white", "gray.800");
//   const iconHover = {
//     transform: "translateY(-5px)",
//     transition: "0.3s",
//     filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.2))",
//   };

//   useEffect(() => {
//     let lastScrollY = window.scrollY;

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       const footer = document.getElementById("footer");
//       if (!footer) return;

//       const footerTop = footer.getBoundingClientRect().top;
//       const footerBottom = footer.getBoundingClientRect().bottom;
//       const windowHeight = window.innerHeight;

//       const isScrollingDown = currentScrollY > lastScrollY;

//       if (isScrollingDown && footerTop < windowHeight && footerBottom <= windowHeight) {
//         window.scrollTo(0, lastScrollY);
//         return;
//       }

//       lastScrollY = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <Box as="footer" id="footer" py={8} bg={bg} color={color}>
//       <Flex
//         maxW="container.lg"
//         mx="auto"
//         px={4}
//         direction={{ base: "column", md: "row" }}
//         justify="space-between"
//         align="center"
//         gap={8}
//         height="250px"
//       >
//         <VStack spacing={3} align="center">
//           <Image
//             src="./assets/images/daalo.png"
//             alt="Company Logo"
//             boxSize="90px"
//             objectFit="contain"
//             cursor="pointer"
//           />
//           <Text fontSize="30px" fontWeight="bold" cursor="pointer">
//             EnglishPod
//           </Text>
//           <Text fontStyle="italic" textAlign="center">
//             Improve your English skills through interactive lessons, quizzes, and practice activities for all levels.
//           </Text>
//           <Text fontStyle="italic" textAlign="center">
//             Email: info@englishpod.com
//           </Text>

//           {/* ✅ Contact Page Link */}
//           <Link
//             as={RouterLink}
//             to="/contact"
//             fontWeight="bold"
//             color="teal.200"
//             _hover={{ textDecoration: "underline", color: "teal.300" }}
//           >
//             Contact Us
//           </Link>
//         </VStack>

//         <HStack spacing={6}>
//           {[
//             { icon: FaInstagram, url: "https://instagram.com", color: "#E1306C" },
//             { icon: FaWhatsapp, url: "https://wa.me", color: "#25D366" },
//             { icon: FaFacebook, url: "https://facebook.com", color: "#3b5998" },
//             { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" },
//           ].map((social, idx) => (
//             <Link key={idx} href={social.url} isExternal>
//               <IconButton
//                 aria-label={social.icon.name}
//                 icon={<social.icon />}
//                 variant="variant"
//                 boxSize="50px"
//                 fontSize="35px"
//                 _hover={{ ...iconHover, color: social.color }}
//               />
//             </Link>
//           ))}
//         </HStack>
//       </Flex>
//     </Box>
//   );
// };

// export default Footer;




















































// import {
//   Box,
//   Flex,
//   VStack,
//   Text,
//   HStack,
//   IconButton,
//   Image,
//   useColorModeValue,
//   Link,
// } from "@chakra-ui/react";
// import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";
// import { useEffect } from "react";

// const Footer = () => {
//   const bg = useColorModeValue("gray.800", "orange.200");
//   const color = useColorModeValue("white", "gray.800");
//   const iconHover = {
//     transform: "translateY(-5px)",
//     transition: "0.3s",
//     filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.2))",
//   };

//   useEffect(() => {
//     let lastScrollY = window.scrollY;
  
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       const footer = document.getElementById("footer");
//       if (!footer) return;
  
//       const footerTop = footer.getBoundingClientRect().top;
//       const footerBottom = footer.getBoundingClientRect().bottom;
//       const windowHeight = window.innerHeight;
  
//       const isScrollingDown = currentScrollY > lastScrollY;
  
//       // If user scrolls down and footer is fully in view
//       if (isScrollingDown && footerTop < windowHeight && footerBottom <= windowHeight) {
//         window.scrollTo(0, lastScrollY); // Freeze position
//         return;
//       }
  
//       // Update last scroll position
//       lastScrollY = currentScrollY;
//     };
  
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);
  
  

//   return (
//     <Box as="footer" id="footer" py={8} bg={bg} color={color}>
//       <Flex
//         maxW="container.lg"
//         mx="auto"
//         px={4}
//         direction={{ base: "column", md: "row" }}
//         justify="space-between"
//         align="center"
//         gap={8}
//         height="250px"
//       >
//         <VStack spacing={3} align="center">
//           <Image
//             src="./assets/images/daalo.png"
//             alt="Company Logo"
//             boxSize="90px"
//             objectFit="contain"
//             cursor="pointer"
//           />
//           <Text fontSize="30px" fontWeight="bold" cursor="pointer">
//             EnglishPod
//           </Text>
//           <Text fontStyle="italic" textAlign="center">
//             Improve your English skills through interactive lessons, quizzes, and practice activities for all levels.
//           </Text>
//           <Text fontStyle="italic" textAlign="center">
//             Email: info@englishpod.com
//           </Text>
//         </VStack>

//         <HStack spacing={6}>
//           {[
//             { icon: FaInstagram, url: "https://instagram.com", color: "#E1306C" },
//             { icon: FaWhatsapp, url: "https://wa.me", color: "#25D366" },
//             { icon: FaFacebook, url: "https://facebook.com", color: "#3b5998" },
//             { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" },
//           ].map((social, idx) => (
//             <Link key={idx} href={social.url} isExternal>
//               <IconButton
//                 aria-label={social.icon.name}
//                 icon={<social.icon />}
//                 variant="variant"
//                 boxSize="50px"
//                 fontSize="35px"
//                 _hover={{ ...iconHover, color: social.color }}
//               />
//             </Link>
//           ))}
//         </HStack>
//       </Flex>
//     </Box>
//   );
// };

// export default Footer;



































// Footer.jsx
// import { 
//     Box, 
//     HStack, 
//     IconButton, 
//     useColorModeValue, 
//     Flex, 
//     Image, 
//     Text, 
//     VStack,
//     Link
//   } from "@chakra-ui/react";
//   import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";
  
//   const Footer = () => {
//     const bg = useColorModeValue("gray.800", "orange.200");
//     const color = useColorModeValue("white", "gray.800");
//     const iconHover = { 
//       transform: "translateY(-5px)", 
//       transition: "0.3s",
//       filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.2))"
//     };
  
//     return (
//       <Box as="footer" py={8} bg={bg} color={color}> 
//         <Flex 
//           maxW="container.lg" 
//           mx="auto" 
//           px={4} 
//           direction={{ base: "column", md: "row" }}
//           justify="space-between"
//           align="center"
//           gap={8}
//         >
//           <VStack spacing={3} align="center">
//             <Image 
//               src="./assets/images/daalo.png"
//               alt="Company Logo"
//               boxSize="90px"
//               objectFit="contain"
//               cursor="pointer"
//             />
//             <Text fontSize="30px" fontWeight="bold" cursor="pointer">EnglishPod</Text>
//             <Text fontStyle="italic" textAlign="center">
//             Improve your English skills through interactive lessons, 
//             quizzes, and practice activities for all levels.
//             </Text>
//             <Text fontStyle="italic" textAlign="center">
//                Email: info@englishpod.com
//             </Text>
//           </VStack>
  
//           <HStack spacing={8}>
//             {[
//               { icon: FaInstagram, url: "https://instagram.com", color: "#E1306C" },
//               { icon: FaWhatsapp, url: "https://wa.me", color: "#25D366" },
//               { icon: FaFacebook, url: "https://facebook.com", color: "#3b5998" },
//               { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" }
//             ].map((social, idx) => (
//               <Link key={idx} href={social.url} isExternal>
//                 <IconButton
//                   aria-label={social.icon.name}
//                   icon={<social.icon />}
//                   variant="variant"
//                   boxSize="60px"
//                   fontSize="50px"
//                   _hover={{ ...iconHover, color: social.color }}
//                   cursor="pointer"
//                 />
//               </Link>
//             ))}
//           </HStack>
//         </Flex>
//       </Box>
//     );
//   };
  
//   export default Footer;






































































// import { 
//     Box, 
//     HStack, 
//     IconButton, 
//     useColorModeValue, 
//     Flex, 
//     Image, 
//     Text, 
//     VStack,
//     Link
//   } from "@chakra-ui/react";
//   import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";
  
//   const Footer = () => {
//     // Color mode configurations
//     const bg = useColorModeValue("gray.800", "orange.200"); // Dark in light mode, light orange in dark
//     const color = useColorModeValue("white", "gray.800"); // White text in light mode, dark text in dark
//     const iconHover = { transform: "translateY(-5px)", transition: "0.3s" };
  
//     return (
//       <Box as="footer" py={8} bg={bg} color={color}>
//         <Flex 
//           maxW="container.lg" 
//           mx="auto" 
//           px={4} 
//           direction={{ base: "column", md: "row" }}
//           justify="space-between"
//           align="center"
//           gap={8}
//         >
//           <VStack spacing={3} align="center">
//             <Image 
//               src="./assets/images/daalo.png"
//               alt="Company Logo"
//               boxSize="90px"
//               objectFit="contain"
//             />
//             <Text fontSize="xl" fontWeight="bold">EnglishPod</Text>
//             <Text fontStyle="italic" textAlign="center">
//               "Quality is not an act, it's a habit."
//             </Text>
//           </VStack>
  
//           <HStack spacing={8}>
//             <Link href="https://instagram.com" isExternal>
//               <IconButton
//                 aria-label="Instagram"
//                 icon={<FaInstagram />}
//                 variant="variant"
//                 boxSize="60px" // Button Size
//                 fontSize="50px" // Icon size
//                 _hover={{ ...iconHover, color: "#E1306C" }}
//               />
//             </Link>
  
//             <Link href="https://wa.me" isExternal>
//               <IconButton
//                 aria-label="WhatsApp"
//                 icon={<FaWhatsapp />}
//                 variant="variant"
//                 boxSize="60px" // Button Size
//                 fontSize="50px" // Icon size
//                 _hover={{ ...iconHover, color: "#25D366" }}
//               />
//             </Link>
  
//             <Link href="https://facebook.com" isExternal>
//               <IconButton
//                 aria-label="Facebook"
//                 icon={<FaFacebook />}
//                 variant="variant"
//                 boxSize="60px" // Button Size
//                 fontSize="50px" // Icon size
//                 _hover={{ ...iconHover, color: "#3b5998" }}
//               />
//             </Link>
  
//             <Link href="https://youtube.com" isExternal>
//               <IconButton
//                 aria-label="YouTube"
//                 icon={<FaYoutube />}
//                 variant="variant"
//                 boxSize="60px" // Button Size
//                 fontSize="50px" // Icon size
//                 _hover={{ ...iconHover, color: "#FF0000" }}
//               />
//             </Link>
//           </HStack>
//         </Flex>
//       </Box>
//     );
//   };
  
//   export default Footer;































// import { 
//     Box, 
//     HStack, 
//     IconButton, 
//     useColorModeValue, 
//     Flex, 
//     Image, 
//     Text, 
//     VStack, 
//     Link
//   } from "@chakra-ui/react";
//   import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";
  
//   const Footer = () => {
//     // Updated color values for light/dark modes
//     const bg = useColorModeValue("gray.800", "orange.800");
//     const color = useColorModeValue("white", "gray.800");
//     const iconHover = { transform: "translateY(-5px)", transition: "0.3s" };
  
//     return (
//       <Box as="footer" py={8} bg={bg} color={color}>
//         <Flex 
//           maxW="container.lg" 
//           mx="auto" 
//           px={4} 
//           direction={{ base: "column", md: "row" }}
//           justify="space-between"
//           align="center"
//           gap={8}
//         >
//           {/* Left side with logo and text */}
//           <VStack spacing={3} align="center">
//             <Image 
//               src="./assets/images/daalo.png" // Replace with your logo path
//               alt="Company Logo"
//               boxSize="70px"
//               objectFit="contain"
//             />
//             <Text fontSize="xl" fontWeight="bold">Your Brand Name</Text>
//             <Text fontStyle="italic" textAlign="center">
//               "Quality is not an act, it's a habit."
//             </Text>
//           </VStack>
  
//           {/* Social media icons */}
//           <HStack spacing={8}>
//           <Link href="https://instagram.com/yourprofile" isExternal>
//             <IconButton
//               aria-label="Instagram"
//               icon={<FaInstagram />}
//               variant="ghost"
//               boxSize="60px" // Button size
//               fontSize="40px" // Icon size
//               _hover={{ ...iconHover, color: "#E1306C" }}
//             />
//           </Link>

//           <Link href="https://wa.me/1234567890" isExternal>
//             <IconButton
//               aria-label="WhatsApp"
//               icon={<FaWhatsapp />}
//               variant="ghost"
//               boxSize="60px" // Button size
//               fontSize="40px" // Icon size
//               _hover={{ ...iconHover, color: "#25D366" }}
//             />
//           </Link>

//           <Link href="https://facebook.com/yourpage" isExternal>
//             <IconButton
//               aria-label="Facebook"
//               icon={<FaFacebook />}
//               variant="ghost"
//               boxSize="60px" // Button size
//               fontSize="40px" // Icon size
//               _hover={{ ...iconHover, color: "#3b5998" }}
//             />
//           </Link>

//           <Link href="https://youtube.com/yourchannel" isExternal>
//             <IconButton
//               aria-label="YouTube"
//               icon={<FaYoutube />}
//               variant="ghost"
//               boxSize="60px" // Button size
//               fontSize="40px" // Icon size
//               _hover={{ ...iconHover, color: "#FF0000" }}
//             />
//           </Link>
//           </HStack>
//         </Flex>
//       </Box>
//     );
//   };
  
//   export default Footer;
















































// import { Box, HStack, IconButton, useColorModeValue } from "@chakra-ui/react";
// import { FaInstagram, FaWhatsapp, FaFacebook, FaYoutube } from "react-icons/fa";

// const Footer = () => {
//   const bg = useColorModeValue("gray.800", "gray.200");
//   const color = useColorModeValue("white", "gray.800");
//   const iconHover = { transform: "translateY(-5px)", transition: "0.3s" };

//   return (
//     <Box as="footer" py={8} bg={bg} color={color}>
//       <HStack justify="center" spacing={8}>
//         <IconButton
//           aria-label="Instagram"
//           icon={<FaInstagram />}
//           variant="ghost"
//           fontSize="24px"
//           _hover={{ ...iconHover, color: "#E1306C" }}
//         />
//         <IconButton
//           aria-label="WhatsApp"
//           icon={<FaWhatsapp />}
//           variant="ghost"
//           fontSize="24px"
//           _hover={{ ...iconHover, color: "#25D366" }}
//         />
//         <IconButton
//           aria-label="Facebook"
//           icon={<FaFacebook />}
//           variant="ghost"
//           fontSize="24px"
//           _hover={{ ...iconHover, color: "#3b5998" }}
//         />
//         <IconButton
//           aria-label="YouTube"
//           icon={<FaYoutube />}
//           variant="ghost"
//           fontSize="24px"
//           _hover={{ ...iconHover, color: "#FF0000" }}
//         />
//       </HStack>
//     </Box>
//   );
// };

// export default Footer;