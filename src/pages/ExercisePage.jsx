
/* ExercisePage.jsx */
// working but is not choosing from one 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Button,
  Input,
  useColorModeValue,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { supabase } from '../Supabase/Supabase.js';

export default function ExercisePage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [mode, setMode] = useState('list'); // 'list' | 'quiz' | 'result'
  const [currentEx, setCurrentEx] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const btnColor = useColorModeValue('orange', 'teal');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error: dbErr } = await supabase
          .from('exercises')
          .select('*');
        if (dbErr) throw dbErr;
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const startQuiz = (ex) => {
    setCurrentEx(ex);
    setAnswers(Array(ex.questions.length).fill(''));
    setCurrentQ(0);
    setScore(0);
    setMode('quiz');
  };

  const handleAnswerChange = (val) => {
    const a = [...answers];
    a[currentQ] = val;
    setAnswers(a);
  };

  const goNext = () => {
    if (currentQ < currentEx.questions.length - 1) setCurrentQ(currentQ + 1);
  };
  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const submitQuiz = () => {
    let sc = 0;
    currentEx.questions.forEach((_, i) => {
      if (
        answers[i]?.trim().toLowerCase() ===
        currentEx.correct_answers[i]?.trim().toLowerCase()
      ) sc++;
    });
    setScore(sc);
    setMode('result');
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );

  if (mode === 'list') {
    return (
      <Box p={6}>
        <Heading mb={4}>Available Exercises</Heading>
        <VStack spacing={4} align="stretch">
          {exercises.map((ex) => (
            <HStack
              key={ex.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              justify="space-between"
              _hover={{ bg: hoverBg, cursor: 'pointer' }}
            >
              <Text>Content ID: {ex.content_id}</Text>
              <Button colorScheme={btnColor} onClick={() => startQuiz(ex)}>
                Start
              </Button>
            </HStack>
          ))}
        </VStack>
      </Box>
    );
  }

  if (mode === 'quiz') {
    const qText = currentEx.questions[currentQ];
    return (
      <Box p={6}>
        <Heading mb={4}>
          Question {currentQ + 1} of {currentEx.questions.length}
        </Heading>
        <Box p={4} borderWidth="1px" borderRadius="md" _hover={{ bg: hoverBg }}>
          <Text mb={4}>{qText}</Text>
          <Input
            placeholder="Type your answer here"
            value={answers[currentQ]}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        </Box>
        <HStack spacing={4} mt={4}>
          <Button onClick={goBack} isDisabled={currentQ === 0}>
            Back
          </Button>
          {currentQ < currentEx.questions.length - 1 ? (
            <Button colorScheme={btnColor} onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button colorScheme={btnColor} onClick={submitQuiz}>
              Submit
            </Button>
          )}
        </HStack>
      </Box>
    );
  }

  // Result view
  return (
    <Box p={6}>
      <Heading mb={4}>Your Score</Heading>
      <Text fontSize="xl">
        {score} / {currentEx.questions.length}
      </Text>
      <Button mt={6} colorScheme={btnColor} onClick={() => setMode('list')}>
        Back to Exercises
      </Button>
    </Box>
  );
}


























/* ExercisePage.jsx */
// not fetching questions
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Heading,
//   VStack,
//   Text,
//   Spinner,
//   Button,
//   Radio,
//   RadioGroup,
//   Stack,
//   useColorModeValue,
//   HStack,
//   Alert,
//   AlertIcon,
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabase.js';

// export default function ExercisePage() {
//   const [exercises, setExercises] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [mode, setMode] = useState('list'); // 'list' | 'quiz' | 'result'
//   const [currentEx, setCurrentEx] = useState(null);
//   const [currentQ, setCurrentQ] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(0);

//   const btnColor = useColorModeValue('orange', 'teal');
//   const hoverBg = useColorModeValue('gray.100', 'gray.700');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: exData, error: exErr } = await supabase
//           .from('exercises')
//           .select('*');
//         if (exErr) throw exErr;

//         const contentIds = [...new Set(exData.map(e => e.content_id))];
//         const { data: contentRows, error: contentErr } = await supabase
//           .from('course_content')
//           .select('id, title')
//           .in('id', contentIds);
//         if (contentErr) throw contentErr;

//         const titleMap = Object.fromEntries(
//           contentRows.map(c => [c.id, c.title])
//         );

//         const merged = exData.map(ex => ({
//           ...ex,
//           title: titleMap[ex.content_id] || 'Untitled',
//         }));
//         setExercises(merged);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const startQuiz = (ex) => {
//     setCurrentEx(ex);
//     setAnswers(Array.isArray(ex.questions) ? Array(ex.questions.length).fill('') : []);
//     setCurrentQ(0);
//     setScore(0);
//     setMode('quiz');
//   };

//   const handleSelect = (val) => {
//     if (!currentEx) return;
//     const copy = [...answers];
//     copy[currentQ] = val;
//     setAnswers(copy);
//   };

//   const goNext = () => {
//     if (currentEx && Array.isArray(currentEx.questions) && currentQ < currentEx.questions.length - 1) {
//       setCurrentQ(currentQ + 1);
//     }
//   };

//   const goBack = () => {
//     if (currentQ > 0) setCurrentQ(currentQ - 1);
//   };

//   const submitQuiz = () => {
//     if (!currentEx || !Array.isArray(currentEx.correct_answers)) return;
//     let sc = 0;
//     currentEx.questions.forEach((_, i) => {
//       const userAns = (answers[i] || '').trim().toLowerCase();
//       const correctAns = (currentEx.correct_answers[i] || '').trim().toLowerCase();
//       if (userAns === correctAns) sc++;
//     });
//     setScore(sc);
//     setMode('result');
//   };

//   if (loading) return <Spinner />;
//   if (error) return (
//     <Alert status="error">
//       <AlertIcon />{error}
//     </Alert>
//   );

//   if (mode === 'list') {
//     return (
//       <Box p={6}>
//         <Heading mb={4}>Available Exercises</Heading>
//         <VStack spacing={4} align="stretch">
//           {exercises.map(ex => (
//             <HStack
//               key={ex.id}
//               p={4}
//               borderWidth="1px"
//               borderRadius="md"
//               justify="space-between"
//               _hover={{ bg: hoverBg, cursor: 'pointer' }}
//             >
//               <Text fontWeight="bold">{ex.title}</Text>
//               <Button colorScheme={btnColor} onClick={() => startQuiz(ex)}>
//                 Start
//               </Button>
//             </HStack>
//           ))}
//         </VStack>
//       </Box>
//     );
//   }

//   if (mode === 'quiz') {
//     if (
//       !currentEx ||
//       !Array.isArray(currentEx.questions) ||
//       !currentEx.questions[currentQ]
//     ) {
//       return (
//         <Box p={6}>
//           <Text>Invalid question data. Please select another exercise.</Text>
//           <Button mt={4} onClick={() => setMode('list')}>
//             Back to Exercises
//           </Button>
//         </Box>
//       );
//     }

//     const questionObj = currentEx.questions[currentQ] || {};
//     const questionText = questionObj.question || 'No question available';
//     const options = Array.isArray(questionObj.options) ? questionObj.options : [];

//     return (
//       <Box p={6}>
//         <Heading mb={2}>{currentEx.title}</Heading>
//         <Text mb={4}>Question {currentQ + 1} of {currentEx.questions.length}</Text>
//         <Box p={4} borderWidth="1px" borderRadius="md" _hover={{ bg: hoverBg }}>
//           <Text mb={4}>{questionText}</Text>
//           <RadioGroup
//             value={answers[currentQ] || ''}
//             onChange={handleSelect}
//           >
//             <Stack spacing={3}>
//               {options.map((opt, idx) => (
//                 <Radio key={idx} value={opt}>{opt}</Radio>
//               ))}
//             </Stack>
//           </RadioGroup>
//         </Box>
//         <HStack spacing={4} mt={4}>
//           <Button onClick={goBack} isDisabled={currentQ === 0}>Back</Button>
//           {currentQ < currentEx.questions.length - 1 ? (
//             <Button colorScheme={btnColor} onClick={goNext}>Next</Button>
//           ) : (
//             <Button colorScheme={btnColor} onClick={submitQuiz}>Submit</Button>
//           )}
//         </HStack>
//       </Box>
//     );
//   }

//   return (
//     <Box p={6}>
//       <Heading mb={4}>Your Score</Heading>
//       <Text fontSize="xl">{score} / {currentEx.questions.length}</Text>
//       <Button mt={6} colorScheme={btnColor} onClick={() => setMode('list')}>
//         Back to Exercises
//       </Button>
//     </Box>
//   );
// }



















































































































// src/components/ExerciseComponent.js
// working but usingwrong ui
// import React, { useEffect, useState } from 'react';
// import { supabase } from '../Supabase/Supabase.js';
// import { Toast, ToastContainer, Button, Form } from 'react-bootstrap';
// import Confetti from 'react-confetti';

// const ExercisePage = () => {
//   const [exercises, setExercises] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [userAnswers, setUserAnswers] = useState([]);

//   useEffect(() => {
//     fetchExercises();
//   }, []);

//   const fetchExercises = async () => {
//     setToastMsg('Loading exercises...');
//     setShowToast(true);
//     const { data, error } = await supabase.from('exercises').select('*');
//     if (error) {
//       setToastMsg('Error loading exercises.');
//     } else {
//       setExercises(data);
//       setToastMsg('Exercises loaded.');
//     }
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   const handleAnswer = (selectedOption) => {
//     const correct = exercises[current].answer === selectedOption;
//     if (correct) setScore(score + 1);
//     setUserAnswers([...userAnswers, { questionId: exercises[current].id, selectedOption }]);
//     if (current + 1 < exercises.length) {
//       setCurrent(current + 1);
//     } else {
//       finalizeScore();
//     }
//   };

//   const finalizeScore = () => {
//     const percentage = (score / exercises.length) * 100;
//     if (percentage >= 80) {
//       setToastMsg('Great job! You scored an A.');
//       setShowConfetti(true);
//     } else if (percentage >= 70) {
//       setToastMsg('Good effort! You scored a B.');
//     } else if (percentage >= 50) {
//       setToastMsg('You scored a C. Keep practicing!');
//     } else {
//       setToastMsg('You failed. Try again.');
//     }
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 5000);
//   };

//   return (
//     <div className="container mt-5">
//       {showConfetti && <Confetti />}
//       <ToastContainer position="top-end" className="p-3">
//         <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
//           <Toast.Body>{toastMsg}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//       {exercises.length > 0 && current < exercises.length && (
//         <div>
//           <h5>Question {current + 1} of {exercises.length}</h5>
//           <p>{exercises[current].question}</p>
//           {exercises[current].options.map((option, index) => (
//             <Button key={index} variant="outline-primary" className="m-2" onClick={() => handleAnswer(option)}>
//               {option}
//             </Button>
//           ))}
//         </div>
//       )}
//       {current >= exercises.length && (
//         <div>
//           <h3>Your Score: {(score / exercises.length) * 100}%</h3>
//           <Button onClick={() => window.location.reload()}>Retry</Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExercisePage;













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