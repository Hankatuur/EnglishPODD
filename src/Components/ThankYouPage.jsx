import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

const ThankYouPage = () => {
  const { id } = useParams(); // Get the 'id' from the URL

  return (
    <Box p={6} textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Thank You for Watching!
      </Text>
      <Text mb={4}>
        You watched material with ID: {id}. Now that you've completed the video, you can move on to the next section, take exercises, or explore more materials.
      </Text>
      <Link to="/Exersice">
        <Button colorScheme="blue" size="lg">
          Go to Exercises
        </Button>
      </Link>
    </Box>
  );
};

export default ThankYouPage;
