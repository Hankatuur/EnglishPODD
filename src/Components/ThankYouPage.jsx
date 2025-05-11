import React, { useEffect } from 'react';
import { Button, Box, Text, useColorMode, Container, Stack } from '@chakra-ui/react';

const ThankYouPage = () => {
  const { colorMode } = useColorMode();
  const hoverColor = colorMode === 'light' ? 'orange.500' : 'teal.500'; // Hover color based on theme

  useEffect(() => {
    // If you need to perform any logic like tracking subscriptions or redirecting, handle it here
    console.log("Subscription successful!");
  }, []);

  return (
    <Container centerContent py={10}>
      <Box
        p={6}
        borderRadius="md"
        boxShadow="md"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        maxWidth="400px"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Thank You for Subscribing!
        </Text>

        <Text mb={6}>
          Your subscription was successful, and you now have access to all premium content. Enjoy!
        </Text>

        <Stack mt={6} spacing={4} direction="row" justify="center">
          <Button
            as="a"
            href="/" // Redirect user to their dashboard or course content
            size="lg"
            colorScheme={colorMode === 'light' ? 'orange' : 'teal'}
            variant="solid"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
              backgroundColor: hoverColor,
            }}
            transition="all 0.3s ease"
          >
            Go to Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ThankYouPage;

