// Confirm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, useColorMode, Text, Flex,
  Heading, Center
} from '@chakra-ui/react';

const Confirm = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const buttonHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: colorMode === 'dark' ? '0 0 20px teal' : '0 0 20px orange',
    _before: {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'md',
      boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
      opacity: 0.6
    }
  };

  return (
    <Center minH="100vh">
      <Box 
        maxW="md" 
        mx="auto" 
        p={8} 
        boxShadow="xl" 
        borderRadius="md"
        textAlign="center"
        width={{ base: "90%", md: "md" }}
      >
        <Heading mb={6} fontSize="3xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}>
          Welcome to EnglishPod!
        </Heading>
        
        <Text mb={8} fontSize="lg">
          You are now part of our learning community. Click the button below to confirm 
          and start your journey with us!
        </Text>

        <Button
          colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
          size="lg"
          onClick={() => navigate('/')}
          position="relative"
          overflow="hidden"
          _hover={buttonHoverStyle}
          transition="all 0.3s ease"
        >
          Confirm & Continue
        </Button>

        <Flex mt={6} justifyContent="center">
          <Text fontSize="sm" color="gray.500">
            Need help? Contact support@englishpod.com
          </Text>
        </Flex>
      </Box>
    </Center>
  );
};

export default Confirm;