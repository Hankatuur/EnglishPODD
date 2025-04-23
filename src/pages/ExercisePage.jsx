// ExercisePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Confetti from 'react-confetti';
import { supabase } from '../Supabase/Supabase.js';

const ExercisePage = () => {
  const toast = useToast();
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('black', 'white');
  const backgroundColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase.from('exercises').select('*');
        if (error) throw new Error(error.message);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: 'Error fetching exercises',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchExercises();
  }, [toast]);

  const handleStartExercise = (exerciseId) => {
    const selectedExercise = exercises.find((exercise) => exercise.id === parseInt(exerciseId));
    setCurrentExercise(selectedExercise);
    setUserAnswers({});
    setShowConfetti(false);
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitExercise = () => {
    if (!currentExercise) return;

    const totalMarks = currentExercise.questions.length * 10;
    let correctAnswers = 0;

    currentExercise.questions.forEach((question) => {
      if (userAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / currentExercise.questions.length) * totalMarks;

    if (calculatedScore >= 80) {
      toast({
        title: 'Congratulations!',
        description: `You passed with ${calculatedScore.toFixed(2)} out of ${totalMarks} marks.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setShowConfetti(true);
    } else if (calculatedScore < 50) {
      toast({
        title: 'Failed',
        description: `You scored ${calculatedScore.toFixed(2)} out of ${totalMarks}. Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Almost there!',
        description: `You scored ${calculatedScore.toFixed(2)} out of ${totalMarks}. Try harder next time!`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} bg={backgroundColor} color={textColor}>
      {currentExercise ? (
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Exercise: {currentExercise.title}
          </Heading>

          {currentExercise.questions.map((question, index) => (
            <Box
              key={question.id}
              my={4}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              borderColor={borderColor}
            >
              <Text fontWeight="bold">{index + 1}. {question.question}</Text>
              <FormLabel mt={2}>Your Answer:</FormLabel>
              <Input
                type="text"
                value={userAnswers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            </Box>
          ))}

          <Button colorScheme="blue" onClick={handleSubmitExercise} mt={4} w="full">
            Submit Exercise
          </Button>

          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
        </Box>
      ) : (
        <Flex direction="column" align="center" justify="center" gap={4}>
          <Heading as="h2" size="lg">Available Exercises</Heading>
          {exercises.length > 0 ? (
            <Select placeholder="Choose an exercise" onChange={(e) => handleStartExercise(e.target.value)}>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title}
                </option>
              ))}
            </Select>
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>No exercises available.</AlertTitle>
            </Alert>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default ExercisePage;













// not working it does'nt  have correct ui and validations
// import { useEffect, useState } from 'react';
// import {
//   Box, Input, InputGroup, InputLeftElement,
//   Spinner, SimpleGrid, Text, Flex, Button, useColorModeValue, Alert, AlertIcon
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse';

// const ExerciseCard = ({ title, storage_path, created_at }) => {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const hoverShadow = useColorModeValue('0px 4px 20px rgba(255,165,0,0.2)', '0px 4px 20px rgba(56,178,172,0.2)');
//   const fileUrl = supabase.storage.from('course-pdfs').getPublicUrl(storage_path).data.publicUrl;

//   return (
//     <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md" _hover={{ boxShadow: hoverShadow }}>
//       <Text fontSize="xl" fontWeight="bold">{title}</Text>
//       <Text fontSize="sm" color="gray.500">Added: {new Date(created_at).toLocaleDateString()}</Text>
//       <Button mt={4} colorScheme="orange" as="a" href={fileUrl} target="_blank" rightIcon={<ArrowForwardIcon />}>
//         View Exercise
//       </Button>
//     </Box>
//   );
// };

// const ExercisePage = () => {
//   const [exercises, setExercises] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchExercises = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('course_content')
//           .select('*')
//           .eq('content_type', 'exercise')
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setExercises(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExercises();
//   }, []);

//   const filtered = exercises.filter(ex => ex.title.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <Box p={6}>
//       <InputGroup maxW="500px" mb={6}>
//         <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
//         <Input placeholder="Search exercises..." onChange={(e) => setSearch(e.target.value)} />
//       </InputGroup>

//       {error && (
//         <Alert status="error"><AlertIcon />{error}</Alert>
//       )}

//       {loading ? (
//         <Flex justify="center"><Spinner size="xl" /></Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filtered.map(exercise => <ExerciseCard key={exercise.id} {...exercise} />)}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default ExercisePage;




























// wrong table coulmn name in supabase 
// import { useState, useEffect } from 'react';
// import {
//   Box, Flex, SimpleGrid, Input,
//   InputGroup, InputLeftElement,
//   Text, Button, useColorModeValue,
//   Spinner, Alert, AlertIcon
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const ExerciseCard = ({ title, file_path, answer_path, created_at }) => {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const hoverShadow = useColorModeValue(
//     '0px 4px 20px rgba(255, 165, 0, 0.2)',
//     '0px 4px 20px rgba(56, 178, 172, 0.2)'
//   );

//   const getFileUrl = (path) => {
//     return supabase.storage
//       .from('course-pdf')
//       .getPublicUrl(path).data.publicUrl;
//   };

//   return (
//     <Box
//       bg={cardBg}
//       p={6}
//       borderRadius="xl"
//       boxShadow="md"
//       _hover={{
//         boxShadow: hoverShadow,
//         transform: 'translateY(-3px)'
//       }}
//       transition="all 0.2s"
//     >
//       <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
//       <Text fontSize="sm" color="gray.500" mb={4}>
//         Added: {new Date(created_at).toLocaleDateString()}
//       </Text>
      
//       <Flex direction="column" gap={3}>
//         <Button
//           as="a"
//           href={getFileUrl(file_path)}
//           target="_blank"
//           rightIcon={<ArrowForwardIcon />}
//           colorScheme="orange"
//           variant="outline"
//         >
//           View Exercise
//         </Button>
//         <Button
//           as="a"
//           href={getFileUrl(answer_path)}
//           target="_blank"
//           rightIcon={<ArrowForwardIcon />}
//           colorScheme="teal"
//         >
//           View Answers
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// const Exersice = () => {
//   const [exercises, setExercises] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchExercises = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('course_content')
//           .select('*')
//           .eq('type', 'exercise')
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setExercises(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExercises();
//   }, []);

//   const filteredExercises = exercises.filter(exercise =>
//     exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (error) {
//     return (
//       <Box p={6}>
//         <Alert status="error" borderRadius="md">
//           <AlertIcon />
//           Error loading exercises: {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box p={6} maxW="1200px" mx="auto">
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.400" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search exercises..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           variant="filled"
//           borderRadius="full"
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" thickness="3px" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredExercises.map((exercise) => (
//             <ExerciseCard key={exercise.id} {...exercise} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default Exersice;

























// import { useState, useEffect } from 'react';
// import {
//   Box, Flex, SimpleGrid, Input,
//   InputGroup, InputLeftElement,
//   Text, Button, useColorModeValue,
//   Spinner, Alert, AlertIcon
// } from '@chakra-ui/react';
// import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const ExerciseCard = ({ title, file_path, answer_path, created_at }) => {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const hoverShadow = useColorModeValue(
//     '0px 4px 20px rgba(255, 165, 0, 0.2)',
//     '0px 4px 20px rgba(56, 178, 172, 0.2)'
//   );

//   const getFileUrl = (path) => {
//     return supabase.storage
//       .from('course-pdfs')
//       .getPublicUrl(path).data.publicUrl;
//   };

//   return (
//     <Box
//       bg={cardBg}
//       p={6}
//       borderRadius="xl"
//       boxShadow="md"
//       _hover={{
//         boxShadow: hoverShadow,
//         transform: 'translateY(-3px)'
//       }}
//       transition="all 0.2s"
//     >
//       <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
//       <Text fontSize="sm" color="gray.500" mb={4}>
//         Added: {new Date(created_at).toLocaleDateString()}
//       </Text>
      
//       <Flex direction="column" gap={3}>
//         <Button
//           as="a"
//           href={getFileUrl(file_path)}
//           target="_blank"
//           rightIcon={<ArrowForwardIcon />}
//           colorScheme="orange"
//           variant="outline"
//         >
//           View Exercise
//         </Button>
//         <Button
//           as="a"
//           href={getFileUrl(answer_path)}
//           target="_blank"
//           rightIcon={<ArrowForwardIcon />}
//           colorScheme="teal"
//         >
//           View Answers
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// const Exersice = () => {
//   const [exercises, setExercises] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchExercises = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('content')
//           .select('*')
//           .eq('type', 'exercise')
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setExercises(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExercises();
//   }, []);

//   const filteredExercises = exercises.filter(exercise =>
//     exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (error) {
//     return (
//       <Box p={6}>
//         <Alert status="error" borderRadius="md">
//           <AlertIcon />
//           Error loading exercises: {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box p={6} maxW="1200px" mx="auto">
//       <InputGroup maxW="600px" mb={8} mx="auto">
//         <InputLeftElement pointerEvents="none">
//           <SearchIcon color="gray.400" />
//         </InputLeftElement>
//         <Input
//           placeholder="Search exercises..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           variant="filled"
//           borderRadius="full"
//         />
//       </InputGroup>

//       {loading ? (
//         <Flex justify="center">
//           <Spinner size="xl" thickness="3px" />
//         </Flex>
//       ) : (
//         <SimpleGrid columns={[1, 2, 3]} spacing={6}>
//           {filteredExercises.map((exercise) => (
//             <ExerciseCard key={exercise.id} {...exercise} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   );
// };

// export default Exersice;




// import React from 'react'

// const Exersice = () => {
//   return (
//     <div>Exersice</div>
//   )
// }

// export default Exersice