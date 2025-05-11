import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Link, IconButton, useColorMode,
  useColorModeValue, Image, Stack, Button
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase.js';
import SearchBar from '../Components/SearchBar.jsx';

const Navbar = () => {
  const bgColor = useColorModeValue("orange.500", "teal.600");
  const hoverColor = useColorModeValue("orange.700", "teal.800");
  const Glow = useColorModeValue("0 0 10px orange", "0 0 10px teal");
  const { colorMode, toggleColorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
      setUser(null);
    }
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Materials", href: "/materials" },
    { label: "Exercises", href: "/Exercise" }
  ];

  const AuthButtons = () => (
    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
      {user ? (
        <Button
          onClick={handleLogout}
          bg={bgColor}
          color="white"
          _hover={{ bg: hoverColor, boxShadow: Glow, transform: "scale(1.05)" }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            as={RouterLink}
            to="/Sign-Up"
            bg={bgColor}
            color="white"
            _hover={{ bg: hoverColor, boxShadow: Glow, transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Sign Up
          </Button>
          <Button
            as={RouterLink}
            to="/Log-In"
            bg={bgColor}
            color="white"
            _hover={{ bg: hoverColor, boxShadow: Glow, transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Log In
          </Button>
        </>
      )}
    </Stack>
  );

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
      <Flex h={16} alignItems="center" justifyContent="space-between" flexDirection={{ base: "row", md: "row" }}>
        <Box>
          <Image src="/assets/images/daalo.png" height="100px" width="100px" alt="logo-web" />
        </Box>

        <Flex display={{ base: "none", md: "flex" }} align="center" justify="space-evenly" w="100%" gap={4}>
          <Flex as="nav" gap={20}>
            {links.map((link) => (
              <Link
                key={link.href}
                as={RouterLink}
                to={link.href}
                _hover={{ color: "teal.500", textDecoration: "none" }}
                fontWeight="bold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              onClick={scrollToFooter}
              cursor="pointer"
              _hover={{ color: "teal.500", textDecoration: "none" }}
              fontWeight="bold"
            >
              Contact
            </Link>
          </Flex>

          <Box ml={4}>
            <SearchBar />
          </Box>

          <IconButton
            size="md"
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          <AuthButtons />
        </Flex>

        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={toggleMenu}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Menu"
        />
      </Flex>

      {isOpen && (
        <Box pt={4} display={{ md: "none" }}>
          <Stack spacing={4}>
            {links.map((link) => (
              <Link
                key={link.href}
                as={RouterLink}
                to={link.href}
                _hover={{ color: "teal.500", textDecoration: "none" }}
                fontWeight="semibold"
                py={1}
              >
                {link.label}
              </Link>
            ))}
            <Link
              onClick={scrollToFooter}
              cursor="pointer"
              _hover={{ color: "teal.500", textDecoration: "none" }}
              fontWeight="semibold"
              py={1}
            >
              Contact
            </Link>

            <Box pt={2}>
              <SearchBar />
            </Box>

            <Flex align="center" justify="space-between">
              <IconButton
                size="md"
                aria-label="Toggle Dark Mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
              <AuthButtons />
            </Flex>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;



































// // Navbar.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box, Flex, Link, IconButton, useColorMode,
//   useColorModeValue, Image, Stack, Button
// } from "@chakra-ui/react";
// import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabase.js';
// import SearchBar from '../Components/SearchBar.jsx';

// const Navbar = () => {
//   const bgColor = useColorModeValue("orange.500", "teal.600");
//   const hoverColor = useColorModeValue("orange.700", "teal.800");
//   const Glow = useColorModeValue("0 0 10px orange", "0 0 10px teal");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => authListener?.subscription.unsubscribe();
//   }, []);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (!error) {
//       navigate('/');
//       setUser(null);
//     }
//   };

//   const links = [
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },
//     { label: "Materials", href: "/Materials" },
//     { label: "Exercises", href: "/exercises" },
//     { label: "Contact", href: "/footer" },


//   ];

//   const AuthButtons = () => (
//     <Stack direction={{ base: "column", md: "row" }} spacing={4}>
//       {user ? (
//         <Button
//           onClick={handleLogout}
//           bg={bgColor}
//           color="white"
//           _hover={{
//             bg: hoverColor,
//             boxShadow: Glow,
//             transform: "scale(1.05)"
//           }}
//           transition="all 0.2s"
//         >
//           Logout
//         </Button>
//       ) : (
//         <>
//           <Button
//             as={RouterLink}
//             to="/Sign-Up"
//             bg={bgColor}
//             color="white"
//             _hover={{
//               bg: hoverColor,
//               boxShadow: Glow,
//               transform: "scale(1.05)"
//             }}
//             transition="all 0.2s"
//           >
//             Sign Up
//           </Button>
//           <Button
//             as={RouterLink}
//             to="/Log-In"
//             bg={bgColor}
//             color="white"
//             _hover={{
//               bg: hoverColor,
//               boxShadow: Glow,
//               transform: "scale(1.05)"
//             }}
//             transition="all 0.2s"
//           >
//             Log In
//           </Button>
//         </>
//       )}
//     </Stack>
//   );

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
//       <Flex h={16} alignItems="center" justifyContent="space-between" flexDirection={{ base: "row", md: "row" }}>
//         <Box>
//           <Image src="/assets/images/daalo.png" height="100px" width="100px" alt="logo-web" />
//         </Box>

//         {/* Desktop view */}
//         <Flex display={{ base: "none", md: "flex" }} align="center" justify="space-evenly" w="100%" gap={4}>
//           <Flex as="nav" gap={20}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="bold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </Flex>

//           {/* Search bar only on desktop */}
//           <Box ml={4}>
//             <SearchBar />
//           </Box>

//           <IconButton
//             size="md"
//             aria-label="Toggle Dark Mode"
//             icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//           />
//           <AuthButtons />
//         </Flex>

//         {/* Mobile menu toggle button */}
//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           onClick={toggleMenu}
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//         />
//       </Flex>

//       {/* Mobile view menu */}
//       {isOpen && (
//         <Box pt={4} display={{ md: "none" }}>
//           <Stack spacing={4}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="semibold"
//                 py={1}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {/* Only one search bar for mobile view */}
//             <Box pt={2}>
//               <SearchBar />
//             </Box>

//             <Flex align="center" justify="space-between">
//               <IconButton
//                 size="md"
//                 aria-label="Toggle Dark Mode"
//                 icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//                 onClick={toggleColorMode}
//               />
//               <AuthButtons />
//             </Flex>
//           </Stack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navbar;



























// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Flex, Link, IconButton, useColorMode, 
//   useColorModeValue, Image, Stack, Button 
// } from "@chakra-ui/react";
// import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';
// import SearchBar from '../Components/SearchBar.jsx';

// const Navbar = () => {
//   const bgColor = useColorModeValue("orange.500", "teal.600");
//   const hoverColor = useColorModeValue("orange.700", "teal.800");
//   const Glow = useColorModeValue("0 0 10px orange", "0 0 10px teal");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => authListener?.subscription.unsubscribe();
//   }, []);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (!error) {
//       navigate('/');
//       setUser(null);
//     }
//   };

//   const links = [
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },
//     { label: "Materials", href: "/Materials" },
//     { label: "Exercises", href: "/exercises" },
//     { label: "Contact", href: "/contact" },
//   ];

//   const AuthButtons = () => (
//     <Stack direction={{ base: "column", md: "row" }} spacing={4}>
//       {user ? (
//         <Button
//           onClick={handleLogout}
//           bg={bgColor}
//           color="white"
//           _hover={{
//             bg: hoverColor,
//             boxShadow: Glow,
//             transform: "scale(1.05)"
//           }}
//           transition="all 0.2s"
//         >
//           Logout
//         </Button>
//       ) : (
//         <>
//           <Button
//             as={RouterLink}
//             to="/Sign-Up"
//             bg={bgColor}
//             color="white"
//             _hover={{
//               bg: hoverColor,
//               boxShadow: Glow,
//               transform: "scale(1.05)"
//             }}
//             transition="all 0.2s"
//           >
//             Sign Up
//           </Button>
//           <Button
//             as={RouterLink}
//             to="/Log-In"
//             bg={bgColor}
//             color="white"
//             _hover={{
//               bg: hoverColor,
//               boxShadow: Glow,
//               transform: "scale(1.05)"
//             }}
//             transition="all 0.2s"
//           >
//             Log In
//           </Button>
//         </>
//       )}
//     </Stack>
//   );

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
//       <Flex h={16} alignItems="center" justifyContent="space-between" flexDirection={{ base: "row", md: "row" }}>
//         <Box>
//           <Image src="/assets/images/daalo.png" height="100px" width="100px" alt="logo-web" />
//         </Box>

//         <Flex display={{ base: "none", md: "flex" }} align="center" justify="space-evenly" w="100%" gap={4}>
//           <Flex as="nav" gap={20}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="bold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </Flex>

//           <IconButton
//             size="md"
//             aria-label="Toggle Dark Mode"
//             icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//           />
//           <AuthButtons />
//         </Flex>

//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           onClick={toggleMenu}
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//         />
//       </Flex>

//       {isOpen && (
//         <Box pt={4} display={{ md: "none" }}>
//           <Stack spacing={4}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="semibold"
//                 py={1}
//               >
//                 <SearchBar/>
//                 {link.label}
//               </Link>
//             ))}
//             <Flex align="center" justify="space-between">
//               <IconButton
//                 size="md"
//                 aria-label="Toggle Dark Mode"
//                 icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//                 onClick={toggleColorMode}
//               />
//               <AuthButtons />
//             </Flex>
//           </Stack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navbar;


























// import React, { useState } from 'react';
// import { 
//   Box, Flex, Link, IconButton, useColorMode, 
//   useColorModeValue, Image, Stack, Button 
// } from "@chakra-ui/react";
// import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import { Link as RouterLink } from 'react-router-dom';

// const Navbar = () => {
//   const bgColor = useColorModeValue("orange.500", "teal.600");
//   const hoverColor = useColorModeValue("orange.700", "teal.800");
//   const Glow = useColorModeValue("0 0 10px orange", "0 0 10px teal");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const links = [
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },
//     { label: "Materials", href: "/materials" },
//     { label: "Exercises", href: "/exercises" },
//     { label: "Contact", href: "/contact" },
//   ];

//   const AuthButtons = () => (
//     <Stack direction={{ base: "column", md: "row" }} spacing={4}>
//       <Button
//         as={RouterLink}
//         to="/Sign-Up"
//         bg={bgColor}
//         color="white"
//         _hover={{
//           bg: hoverColor,
//           boxShadow: Glow,
//           transform: "scale(1.05)"
//         }}
//         transition="all 0.2s"
//       >
//         Sign Up
//       </Button>
//       <Button
//         as={RouterLink}
//         to="/Log-In"
//         bg={bgColor}
//         color="white"
//         _hover={{
//           bg: hoverColor,
//           boxShadow: Glow,
//           transform: "scale(1.05)"
//         }}
//         transition="all 0.2s"
//       >
//         Log In
//       </Button>
//     </Stack>
//   );

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
//       <Flex h={16} alignItems="center" justifyContent="space-between" flexDirection={{ base: "row", md: "row" }}>
//         <Box>
//           <Image src="/assets/images/daalo.png" height="100px" width="100px" alt="logo-web" />
//         </Box>

//         <Flex display={{ base: "none", md: "flex" }} align="center" justify="space-evenly" w="100%" gap={4}>
//           <Flex as="nav" gap={20}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="bold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </Flex>

//           <IconButton
//             size="md"
//             aria-label="Toggle Dark Mode"
//             icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//           />
//           <AuthButtons />
//         </Flex>

//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           onClick={toggleMenu}
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//         />
//       </Flex>

//       {isOpen && (
//         <Box pt={4} display={{ md: "none" }}>
//           <Stack spacing={4}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 as={RouterLink}
//                 to={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="semibold"
//                 py={1}
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <Flex align="center" justify="space-between">
//               <IconButton
//                 size="md"
//                 aria-label="Toggle Dark Mode"
//                 icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//                 onClick={toggleColorMode}
//               />
//               <AuthButtons />
//             </Flex>
//           </Stack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navbar;














// import React, { useState } from 'react';
// import { Box, Flex, Link, IconButton, useColorMode, useColorModeValue, Image, Stack, Button } from "@chakra-ui/react";
// import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import SearchBar from '../Components/SearchBar';

// const Navbar = () => {
//   const bgColor = useColorModeValue("orange.500", "teal.600");
//   const hoverColor = useColorModeValue("orange.700", "teal.800");
//   const Glow = useColorModeValue("0 0 10px orange", "0 0 10px teal");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const links = [
//     { label: "Home", href: "#home" },
//     { label: "About", href: "about" },
//     { label: "Materials", href: "#material" },
//     { label: "Exercises", href: "#exercise" },
//     { label: "Contact", href: "#contact" },
//   ];

//   const AuthButtons = () => (
//     <Stack direction={{ base: "column", md: "row" }} spacing={4}>
//       <Button
//         bg={bgColor}
//         color="white"
//         _hover={{
//           bg: hoverColor,
//           boxShadow: Glow,
//           transform: "scale(1.05)"
//         }}
//         transition="all 0.2s"
//       >
//         Sign Up
//       </Button>
//       <Button
//         bg={bgColor}
//         color="white"
//         _hover={{
//           bg: hoverColor,
//           boxShadow: Glow,
//           transform: "scale(1.05)"
//         }}
//         transition="all 0.2s"
//       >
//         Log In
//       </Button>
//     </Stack>
//   );

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
//       <Flex
//         h={16}
//         alignItems="center"
//         justifyContent="space-between"
//         flexDirection={{ base: "row", md: "row" }}
//         fontSize={20}
//       >
//         {/* Logo */}
//         <Box>
//           <Image src="/assets/images/daalo.png" height="100px" width="100px" alt="logo-web" />
//         </Box>

//         {/* Desktop Nav Section */}
//         <Flex
//           display={{ base: "none", md: "flex" }}
//           align="center"
//           justify="space-evenly"
//           w="100%"
//           gap={4}
//         >
//           <Flex as="nav" gap={20}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="bold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </Flex>

//           <SearchBar />

//           <IconButton
//             size="md"
//             aria-label="Toggle Dark Mode"
//             icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//           />
//           <AuthButtons />
//         </Flex>

//         {/* Hamburger Icon for Mobile */}
//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           onClick={toggleMenu}
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//         />
//       </Flex>

//       {/* Mobile Nav */}
//       {isOpen && (
//         <Box pt={4} display={{ md: "none" }}>
//           <Stack spacing={4}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="semibold"
//                 py={1}
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <SearchBar />
//             <Flex align="center" justify="space-between">
//               <IconButton
//                 size="md"
//                 aria-label="Toggle Dark Mode"
//                 icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//                 onClick={toggleColorMode}
//               />
//               <AuthButtons />
//             </Flex>
//           </Stack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navbar;





























// import React, { useState } from 'react';
// import {Box,Flex,HStack,Link,IconButton,useColorMode,useColorModeValue,Image,Stack, Button,} from "@chakra-ui/react";
// import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import SearchBar from '../Components/SearchBar';

// const Navbar = () => {
//   const bgColor = useColorModeValue("orange.500","teal.600");
//   const hoverColor = useColorModeValue("orange.700","teal.800");
//   const Glow = useColorModeValue("0 0 10px orange","0 0 1px teal");
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const links = [
//     { label: "Home", href: "#home" },
//     { label: "About", href: "about" },
//     { label: "Materials", href: "#material" },
//     { label: "Exercises", href: "#exercise" },
//     { label: "Contact", href: "#contact" },
//   ];

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={{ base: 4, md: 8 }} py={3} shadow="md" w="100%">
//       <Flex
//         h={16}
//         alignItems="center"
//         justifyContent="space-between"
//         flexDirection={{ base: "row", md: "row" }}
//         fontSize={20}
//       >
//         {/* Logo */}
//         <Box>
//         <Image src="/assets/images/daalo.png" height={"100px"} width={"100px"} alt='logo-web'/>
//         </Box>

//         {/* Desktop Nav Section */}
//         <Flex
//           display={{ base: "none", md: "flex" }}
//           align="center"
//           justify="space-evenly"
//           w="100%"
//           gap={4}
//         >
//           <Flex as="nav" gap={20}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="bold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </Flex>

//           <SearchBar />

//           <IconButton
//             size="md"
//             aria-label="Toggle Dark Mode"
//             icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//           />
//           <Stack direction='row' spacing={4} align='center'>
//   <Button bg={bgColor} 
//   color="white"
//   _hover={{bg:hoverColor,boxShadow:Glow}}
//   variant='ghost'>
//     Sign Up
//   </Button>
//   <Button 
//    bg={bgColor} 
//    color="white"
//    _hover={{bg:hoverColor,boxShadow:Glow}}
//    variant='ghost'>
//     Log In
//   </Button>
  
  
// </Stack>
//         </Flex>

//         {/* Hamburger Icon for Mobile */}
//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           onClick={toggleMenu}
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//         />
//       </Flex>

//       {/* Mobile Nav */}
//       {isOpen && (
//         <Box pt={4} display={{ md: "none" }}>
//           <Stack spacing={4}>
//             {links.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 _hover={{ color: "teal.500", textDecoration: "none" }}
//                 fontWeight="semibold"
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <SearchBar />
//             <IconButton
//               size="md"
//               aria-label="Toggle Dark Mode"
//               icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//               onClick={toggleColorMode}
//             />
//           </Stack>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Navbar;
















// import React from 'react'
// import {Box,Flex,HStack,Link,IconButton,useColorMode, useColorModeValue,Button, Image, Input,} from "@chakra-ui/react";
//   import { MoonIcon, Search2Icon, SunIcon } from "@chakra-ui/icons";
// import SearchBar from '../Components/SearchBar';
  
// const Navbar = () => {
//     const { colorMode, toggleColorMode } = useColorMode();

//   return (
//     <Box bg={useColorModeValue("gray.100", "gray.900")} px={8} py={3}  shadow="md">
//     <Flex h={16} alignItems={"center"} justifyContent={"space-evenly"} cursor={"pointer"} >
//       <Box size="40px" mr={2} borderRadius={"full"} cursor={"pointer"} fontSize={11} fontWeight={"bold"}>
//         <Image src="/assets/images/daalo.png" height={"100px"} width={"100px"} alt='logo-web'/>
//       </Box>

//       <Flex as="nav" maxW="500px"  gap={6}  justify="space-between" w="100%" >

//     <Link href="#home" _hover={{ color: "teal.500", textDecoration: "none" }}>Home</Link>
//   <Link href="#about" _hover={{ color: "teal.500", textDecoration: "none" }}>About</Link>
//   <Link href="#material" _hover={{ color: "teal.500", textDecoration: "none" }}>Materials</Link>
//   <Link href="#exercise" _hover={{ color: "teal.500", textDecoration: "none" }}>Exercises</Link>
//   <Link href="#contact" _hover={{ color: "teal.500", textDecoration: "none" }}>Contact</Link>
// </Flex>
//   <Flex>
//  <SearchBar/>
// </Flex>


//       <IconButton
//         size="md"
//         aria-label="Toggle Dark Mode"
//         icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
//         onClick={toggleColorMode}
//       />
//     </Flex>
// </Box>

//   )
// }

// export default Navbar