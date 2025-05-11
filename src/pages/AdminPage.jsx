/* AdminPage.jsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Progress,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { supabase } from '../Supabase/Supabase.js';
import mammoth from 'mammoth';

export default function AdminPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert .doc/.docx to JSON questions or answers array
  const convertDocToJson = async (wordFile) => {
    const buffer = await wordFile.arrayBuffer();
    const { value: rawText } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return rawText.split('\n').map(l => l.trim()).filter(Boolean);
  };

  // Load JSON file
  const loadJsonFile = async (jsonFile) => {
    const text = await jsonFile.text();
    return JSON.parse(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file || (type === 'exercise' && (!answerFile || !maxAttempts))) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (type === 'exercise') {
        // Process question file
        let questions;
        if (file.name.match(/\.json$/i)) {
          const data = await loadJsonFile(file);
          questions = Array.isArray(data.questions) ? data.questions : data;
        } else {
          questions = await convertDocToJson(file);
        }

        // Process answer file
        let correct_answers;
        if (answerFile.name.match(/\.json$/i)) {
          const data = await loadJsonFile(answerFile);
          correct_answers = Array.isArray(data.correct_answers)
            ? data.correct_answers
            : data;
        } else {
          correct_answers = await convertDocToJson(answerFile);
        }

        // Insert into course_content to get content_id
        const { data: [content], error: contentErr } = await supabase
          .from('course_content')
          .insert([{ title: title.trim(), content_type: 'exercise', storage_path: null, created_at: new Date() }])
          .select('id');
        if (contentErr) throw contentErr;

        // Insert into exercises
        const { error: exErr } = await supabase
          .from('exercises')
          .insert([{ content_id: content.id, questions, correct_answers, max_attempts: maxAttempts }]);
        if (exErr) throw exErr;

      } else {
        // Video or PDF
        const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${ext}`;

        const { error: uploadErr } = await supabase.storage.from(bucket).upload(fileName, file);
        if (uploadErr) throw uploadErr;

        const { error: dbErr } = await supabase
          .from('course_content')
          .insert([{ title: title.trim(), content_type: type, storage_path: fileName, created_at: new Date() }]);
        if (dbErr) throw dbErr;
      }

      toast({ status: 'success', title: 'Upload successful!' });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
      toast({ status: 'error', title: 'Upload failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6}>Admin Upload</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            isRequired
          />

          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="exercise">Exercise</option>
          </Select>

          <FormLabel>
            {type === 'exercise'
              ? 'Question File (.doc, .docx or .json)'
              : 'File'}
          </FormLabel>
          <Input
            type="file"
            accept={
              type === 'exercise'
                ? '.doc,.docx,application/json'
                : type === 'video'
                ? 'video/*'
                : '.pdf'
            }
            onChange={(e) => setFile(e.target.files[0])}
            isRequired
          />

          {type === 'exercise' && (
            <>
              <FormLabel>Answer File (.doc, .docx or .json)</FormLabel>
              <Input
                type="file"
                accept=".doc,.docx,application/json"
                onChange={(e) => setAnswerFile(e.target.files[0])}
                isRequired
              />

              <FormLabel>Max Attempts</FormLabel>
              <NumberInput
                min={1}
                value={maxAttempts}
                onChange={(_, val) => setMaxAttempts(val)}
              >
                <NumberInputField />
              </NumberInput>
            </>
          )}

          {loading && <Progress size="xs" isIndeterminate />}
          {error && <Text color="red.500">{error}</Text>}

          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Upload
          </Button>
        </VStack>
      </form>
    </Box>
  );
}


















// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
//   HStack,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabase.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [exerciseAnswerFile, setExerciseAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   const toast = useToast();
//   const navigate = useNavigate();

//   // Check if the user is an admin on component mount
//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({ status: 'error', title: 'Not logged in' });
//         navigate('/');
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.is_admin) {
//         toast({ status: 'error', title: 'Access Denied', description: 'You are not an admin.' });
//         navigate('/');
//         return;
//       }

//       // Fetch first course ID
//       const { data: courses, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .limit(1);

//       if (!courseError && courses.length > 0) {
//         setCourseId(courses[0].id);
//       }

//       setIsAdminLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       toast({
//         status: 'success',
//         title: 'Logged out successfully',
//         duration: 3000,
//       });
//       navigate('/'); // Redirect to the main page after logout
//     } catch (error) {
//       console.error('Logout failed:', error);
//       toast({
//         status: 'error',
//         title: 'Logout failed',
//         description: error.message,
//         duration: 5000,
//       });
//     }
//   };

//   // Handle file upload
//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
//     const bucket =
//       type === 'video' ? 'course-videos' :
//       type === 'pdf' ? 'course-pdfs' :
//       'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'File upload failed', description: uploadError.message });
//       setUploading(false);
//       return;
//     }

//     // Determine if the content is free based on the price
//     const isFree = price === 0;

//     const insertPayload = {
//       title,
//       content_type: type,
//       storage_path: fileName,
//       course_id: courseId,
//       price: Number(price),
//       is_free: isFree, // Add the is_free field
//     };

//     console.log('[AdminPage] Insert Payload:', insertPayload); // Debug log

//     const { error: dbError } = await supabase.from('course_content').insert([insertPayload]);

//     if (dbError) {
//       toast({ status: 'error', title: 'Insert failed', description: dbError.message });
//       setUploading(false);
//       return;
//     }

//     // Upload answer file if exercise
//     if (type === 'exercise' && exerciseAnswerFile) {
//       const answerName = `answers-${Date.now()}-${exerciseAnswerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, exerciseAnswerFile);

//       if (answerError) {
//         toast({ status: 'warning', title: 'Exercise uploaded, but answer upload failed.' });
//       }
//     }

//     toast({
//       status: 'success',
//       title: 'Upload Success',
//       description: `File uploaded to ${bucket}`,
//     });

//     setTitle('');
//     setFile(null);
//     setExerciseAnswerFile(null);
//     setPrice(0);
//     setUploading(false);
//   };

//   // Prevent unauthorized access and handle browser back navigation
//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       navigate('/');
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [navigate]);

//   if (isAdminLoading) {
//     return (
//       <Box p={6} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={2}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <HStack justify="space-between" mb={6}>
//         <Heading>Admin Upload</Heading>
//         <Button onClick={handleLogout} colorScheme="red">
//           Logout
//         </Button>
//       </HStack>

//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           min={0}
//         />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Answer File (optional)</FormLabel>
//             <Input
//               type="file"
//               onChange={(e) => setExerciseAnswerFile(e.target.files[0])}
//             />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;




// working but without log out button
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabase.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [exerciseAnswerFile, setExerciseAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   const toast = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({ status: 'error', title: 'Not logged in' });
//         navigate('/');
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.is_admin) {
//         toast({ status: 'error', title: 'Access Denied', description: 'You are not an admin.' });
//         navigate('/');
//         return;
//       }

//       // Fetch first course ID
//       const { data: courses, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .limit(1);

//       if (!courseError && courses.length > 0) {
//         setCourseId(courses[0].id);
//       }

//       setIsAdminLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
//     const bucket =
//       type === 'video' ? 'course-videos' :
//       type === 'pdf' ? 'course-pdfs' :
//       'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'File upload failed', description: uploadError.message });
//       setUploading(false);
//       return;
//     }

//     // Determine if the content is free based on the price
//     const isFree = price === 0;

//     const insertPayload = {
//       title,
//       content_type: type,
//       storage_path: fileName,
//       course_id: courseId,
//       price: Number(price),
//       is_free: isFree, // Add the is_free field
//     };

//     console.log('[AdminPage] Insert Payload:', insertPayload); // Debug log

//     const { error: dbError } = await supabase.from('course_content').insert([insertPayload]);

//     if (dbError) {
//       toast({ status: 'error', title: 'Insert failed', description: dbError.message });
//       setUploading(false);
//       return;
//     }

//     // Upload answer file if exercise
//     if (type === 'exercise' && exerciseAnswerFile) {
//       const answerName = `answers-${Date.now()}-${exerciseAnswerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, exerciseAnswerFile);

//       if (answerError) {
//         toast({ status: 'warning', title: 'Exercise uploaded, but answer upload failed.' });
//       }
//     }

//     toast({
//       status: 'success',
//       title: 'Upload Success',
//       description: `File uploaded to ${bucket}`,
//     });

//     setTitle('');
//     setFile(null);
//     setExerciseAnswerFile(null);
//     setPrice(0);
//     setUploading(false);
//   };

//   if (isAdminLoading) {
//     return (
//       <Box p={6} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={2}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           min={0}
//         />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Answer File (optional)</FormLabel>
//             <Input
//               type="file"
//               onChange={(e) => setExerciseAnswerFile(e.target.files[0])}
//             />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;





































// works but exercise json document missing
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [exerciseAnswerFile, setExerciseAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   const toast = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({ status: 'error', title: 'Not logged in' });
//         navigate('/');
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.is_admin) {
//         toast({ status: 'error', title: 'Access Denied', description: 'You are not an admin.' });
//         navigate('/');
//         return;
//       }

//       // Fetch first course ID
//       const { data: courses, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .limit(1);

//       if (!courseError && courses.length > 0) {
//         setCourseId(courses[0].id);
//       }

//       setIsAdminLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
//     const bucket =
//       type === 'video' ? 'course-videos' :
//       type === 'pdf' ? 'course-pdfs' :
//       'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'File upload failed', description: uploadError.message });
//       setUploading(false);
//       return;
//     }

//     // Determine if the content is free based on the price
//     const isFree = price === 0;

//     const insertPayload = {
//       title,
//       content_type: type,
//       storage_path: fileName,
//       course_id: courseId,
//       price: Number(price),
//       is_free: isFree, // Add the is_free field
//     };

//     console.log('[AdminPage] Insert Payload:', insertPayload); // Debug log

//     const { error: dbError } = await supabase.from('course_content').insert([insertPayload]);

//     if (dbError) {
//       toast({ status: 'error', title: 'Insert failed', description: dbError.message });
//       setUploading(false);
//       return;
//     }

//     // Upload answer file if exercise
//     if (type === 'exercise' && exerciseAnswerFile) {
//       const answerName = `answers-${Date.now()}-${exerciseAnswerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, exerciseAnswerFile);

//       if (answerError) {
//         toast({ status: 'warning', title: 'Exercise uploaded, but answer upload failed.' });
//       }
//     }

//     toast({
//       status: 'success',
//       title: 'Upload Success',
//       description: `File uploaded to ${bucket}`,
//     });

//     setTitle('');
//     setFile(null);
//     setExerciseAnswerFile(null);
//     setPrice(0);
//     setUploading(false);
//   };

//   if (isAdminLoading) {
//     return (
//       <Box p={6} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={2}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           min={0}
//         />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Answer File (optional)</FormLabel>
//             <Input
//               type="file"
//               onChange={(e) => setExerciseAnswerFile(e.target.files[0])}
//             />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // correct but you can add json documents 
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [exerciseAnswerFile, setExerciseAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   const toast = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({ status: 'error', title: 'Not logged in' });
//         navigate('/');
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.is_admin) {
//         toast({
//           status: 'error',
//           title: 'Access Denied',
//           description: 'You are not an admin.',
//         });
//         navigate('/');
//         return;
//       }

//       // Fetch first course ID
//       const { data: courses, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .limit(1);

//       if (!courseError && courses.length > 0) {
//         setCourseId(courses[0].id);
//       }

//       setIsAdminLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
//     const bucket =
//       type === 'video' ? 'course-videos' :
//       type === 'pdf' ? 'course-pdfs' :
//       'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({
//         status: 'error',
//         title: 'File upload failed',
//         description: uploadError.message,
//       });
//       setUploading(false);
//       return;
//     }

//     // Determine if the content is free based on the price
//     const isFree = price === 0;

//     const insertPayload = {
//       title,
//       content_type: type,
//       storage_path: fileName,
//       course_id: courseId,
//       price: Number(price),
//       is_free: isFree, // Add the is_free field
//     };

//     console.log('[AdminPage] Insert Payload:', insertPayload); // Debug log

//     const { error: dbError } = await supabase.from('course_content').insert([insertPayload]);

//     if (dbError) {
//       toast({
//         status: 'error',
//         title: 'Insert failed',
//         description: dbError.message,
//       });
//       setUploading(false);
//       return;
//     }

//     // Upload answer file if exercise
//     if (type === 'exercise' && exerciseAnswerFile) {
//       const answerName = `answers-${Date.now()}-${exerciseAnswerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, exerciseAnswerFile);

//       if (answerError) {
//         toast({ status: 'warning', title: 'Exercise uploaded, but answer upload failed.' });
//       }
//     }

//     toast({
//       status: 'success',
//       title: 'Upload Success',
//       description: `File uploaded to ${bucket}`,
//     });

//     setTitle('');
//     setFile(null);
//     setExerciseAnswerFile(null);
//     setPrice(0);
//     setUploading(false);
//   };

//   if (isAdminLoading) {
//     return (
//       <Box p={6} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={2}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           min={0}
//         />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Answer File (optional)</FormLabel>
//             <Input
//               type="file"
//               onChange={(e) => setExerciseAnswerFile(e.target.files[0])}
//             />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;




// working but is_free 
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [exerciseAnswerFile, setExerciseAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   const toast = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({ status: 'error', title: 'Not logged in' });
//         navigate('/');
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.is_admin) {
//         toast({ status: 'error', title: 'Access Denied', description: 'You are not an admin.' });
//         navigate('/');
//         return;
//       }

//       // Fetch first course ID
//       const { data: courses, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .limit(1);

//       if (!courseError && courses.length > 0) {
//         setCourseId(courses[0].id);
//       }

//       setIsAdminLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
//     const bucket =
//       type === 'video' ? 'course-videos' :
//       type === 'pdf' ? 'course-pdfs' :
//       'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'File upload failed', description: uploadError.message });
//       setUploading(false);
//       return;
//     }

//     const insertPayload = {
//       title,
//       content_type: type,
//       storage_path: fileName,
//       course_id: courseId,
//       price: Number(price),
//     };

//     const { error: dbError } = await supabase.from('course_content').insert([insertPayload]);

//     if (dbError) {
//       toast({ status: 'error', title: 'Insert failed', description: dbError.message });
//       setUploading(false);
//       return;
//     }

//     // Upload answer file if exercise
//     if (type === 'exercise' && exerciseAnswerFile) {
//       const answerName = `answers-${Date.now()}-${exerciseAnswerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, exerciseAnswerFile);

//       if (answerError) {
//         toast({ status: 'warning', title: 'Exercise uploaded, but answer upload failed.' });
//       }
//     }

//     toast({
//       status: 'success',
//       title: 'Upload Success',
//       description: `File uploaded to ${bucket}`,
//     });

//     setTitle('');
//     setFile(null);
//     setExerciseAnswerFile(null);
//     setPrice(0);
//     setUploading(false);
//   };

//   if (isAdminLoading) {
//     return (
//       <Box p={6} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={2}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           min={0}
//         />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Answer File (optional)</FormLabel>
//             <Input
//               type="file"
//               onChange={(e) => setExerciseAnswerFile(e.target.files[0])}
//             />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;
















// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
//   Text,
//   Spinner,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [answerFile, setAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [checkingAccess, setCheckingAccess] = useState(true);
//   const toast = useToast();
//   const navigate = useNavigate();

//   // ✅ Step 1: Admin Access Check
//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         navigate('/Log-In');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (error || !data?.is_admin) {
//         navigate('/');
//         return;
//       }

//       setCheckingAccess(false);
//     };

//     checkAdmin();
//   }, [navigate]);

//   // ✅ Step 2: Get First Course
//   useEffect(() => {
//     const fetchCourse = async () => {
//       const { data, error } = await supabase.from('courses').select('id').limit(1);
//       if (!error && data.length > 0) {
//         setCourseId(data[0].id);
//       }
//     };
//     fetchCourse();
//   }, []);

//   // ✅ Step 3: Upload Handler
//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);
//     setProgress(30);

//     const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;

//     const bucket =
//       type === 'video'
//         ? 'course-videos'
//         : type === 'pdf'
//         ? 'course-pdfs'
//         : 'course-exercises';

//     const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'File upload failed', description: uploadError.message });
//       setUploading(false);
//       return;
//     }

//     setProgress(70);

//     // Insert into course_content
//     const { error: dbError } = await supabase.from('course_content').insert([
//       {
//         title,
//         content_type: type,
//         storage_path: fileName,
//         course_id: courseId,
//         price: Number(price),
//       },
//     ]);

//     if (dbError) {
//       toast({ status: 'error', title: 'Insert failed', description: dbError.message });
//       setUploading(false);
//       return;
//     }

//     // ✅ Step 4: Handle Exercise Answer Upload
//     if (type === 'exercise' && answerFile) {
//       const answerName = `answer-${Date.now()}-${answerFile.name}`;
//       const { error: answerError } = await supabase.storage
//         .from('course-exercises')
//         .upload(answerName, answerFile);

//       if (answerError) {
//         toast({ status: 'error', title: 'Answer upload failed', description: answerError.message });
//         setUploading(false);
//         return;
//       }
//     }

//     setProgress(100);

//     toast({
//       status: 'success',
//       title: 'Upload Successful',
//       description: 'Content added successfully',
//     });

//     // Reset form
//     setTitle('');
//     setFile(null);
//     setAnswerFile(null);
//     setPrice(0);
//     setType('pdf');
//     setUploading(false);
//     setTimeout(() => setProgress(0), 1000);
//   };

//   if (checkingAccess) {
//     return (
//       <Box p={10} textAlign="center">
//         <Spinner size="xl" />
//         <Text mt={4}>Checking admin access...</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload Panel</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price (0 for free)</FormLabel>
//         <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

//         <FormLabel>Upload File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Upload Answer File</FormLabel>
//             <Input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
//           </>
//         )}

//         {uploading && <Progress value={progress} size="sm" colorScheme="blue" isAnimated />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;









// is working but is not checking if is admin or user
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   Select,
//   VStack,
//   FormLabel,
//   useToast,
//   Heading,
//   Progress,
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [questionFile, setQuestionFile] = useState(null);
//   const [answerFile, setAnswerFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const { data, error } = await supabase.from('courses').select('id').limit(1);
//       if (error) {
//         toast({ status: 'error', title: 'Course fetch failed', description: error.message });
//       } else if (data.length > 0) {
//         setCourseId(data[0].id);
//       }
//     };

//     fetchCourse();
//   }, []);

//   const handleUpload = async () => {
//     if (!title || !type || !courseId) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);
//     const startTime = performance.now();
//     let storagePath = '';

//     try {
//       if (type === 'pdf' || type === 'video') {
//         if (!file) throw new Error('File is required');
//         const bucket = type === 'pdf' ? 'course-pdfs' : 'course-videos';
//         const fileName = `${Date.now()}-${title.replace(/\s+/g, '-')}`;
//         const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
//         if (uploadError) throw uploadError;
//         storagePath = fileName;
//       }

//       if (type === 'exercise') {
//         if (!questionFile || !answerFile) throw new Error('Question and Answer files are required');
//         const bucket = 'course-exercises';
//         const timestamp = Date.now();
//         const qName = `${timestamp}-${title.replace(/\s+/g, '-')}-questions`;
//         const aName = `${timestamp}-${title.replace(/\s+/g, '-')}-answers`;

//         const { error: qErr } = await supabase.storage.from(bucket).upload(qName, questionFile);
//         const { error: aErr } = await supabase.storage.from(bucket).upload(aName, answerFile);
//         if (qErr || aErr) throw new Error((qErr?.message || '') + ' ' + (aErr?.message || ''));

//         storagePath = JSON.stringify({ question: qName, answer: aName });
//       }

//       const { error: dbError } = await supabase.from('course_content').insert([{
//         title,
//         content_type: type,
//         storage_path: storagePath,
//         course_id: courseId,
//         price: Number(price),
//       }]);

//       if (dbError) throw dbError;

//       toast({
//         status: 'success',
//         title: 'Upload successful',
//         description: `Completed in ${Math.round(performance.now() - startTime)}ms`,
//       });

//       setTitle('');
//       setFile(null);
//       setPrice(0);
//       setQuestionFile(null);
//       setAnswerFile(null);
//     } catch (err) {
//       toast({ status: 'error', title: 'Upload failed', description: err.message });
//     }

//     setUploading(false);
//   };

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price</FormLabel>
//         <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

//         {(type === 'pdf' || type === 'video') && (
//           <>
//             <FormLabel>File</FormLabel>
//             <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
//           </>
//         )}

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Question File</FormLabel>
//             <Input type="file" onChange={(e) => setQuestionFile(e.target.files[0])} />
//             <FormLabel>Answer File</FormLabel>
//             <Input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
//           </>
//         )}

//         {uploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}
//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;

























// bucket name for exersie is wrong
// import { useState, useEffect } from 'react';
// import {
//   Box, Button, Input, Select, VStack,
//   FormLabel, useToast, Heading, Progress
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [questionFile, setQuestionFile] = useState(null);
//   const [answerFile, setAnswerFile] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [courseId, setCourseId] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const { data, error } = await supabase.from('courses').select('id').limit(1);
//       if (error) {
//         toast({ status: 'error', title: 'Course fetch failed', description: error.message });
//       } else if (data.length > 0) {
//         setCourseId(data[0].id);
//       }
//     };
//     fetchCourse();
//   }, []);

//   const uploadToStorage = async (bucket, file) => {
//     const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
//     const { error } = await supabase.storage.from(bucket).upload(fileName, file);
//     return error ? { error } : { path: fileName };
//   };

//   const handleUpload = async () => {
//     if (!title || !type || !courseId || (type === 'exercise' && (!questionFile || !answerFile))) {
//       toast({ status: 'error', title: 'Missing fields' });
//       return;
//     }

//     setUploading(true);
//     const startTime = performance.now();

//     if (type === 'exercise') {
//       const questionRes = await uploadToStorage('exercise-questions', questionFile);
//       const answerRes = await uploadToStorage('exercise-answers', answerFile);

//       if (questionRes.error || answerRes.error) {
//         toast({
//           status: 'error',
//           title: 'Upload failed',
//           description: (questionRes.error || answerRes.error).message,
//         });
//         setUploading(false);
//         return;
//       }

//       const { error } = await supabase.from('course_content').insert([{
//         title,
//         content_type: 'exercise',
//         course_id: courseId,
//         price: Number(price),
//         storage_path: `${questionRes.path},${answerRes.path}`,
//       }]);

//       if (error) {
//         toast({ status: 'error', title: 'Insert failed', description: error.message });
//       } else {
//         toast({ status: 'success', title: 'Exercise uploaded successfully' });
//       }
//     } else {
//       const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';
//       const uploadRes = await uploadToStorage(bucket, file);

//       if (uploadRes.error) {
//         toast({ status: 'error', title: 'Upload failed', description: uploadRes.error.message });
//         setUploading(false);
//         return;
//       }

//       const { error } = await supabase.from('course_content').insert([{
//         title,
//         content_type: type,
//         storage_path: uploadRes.path,
//         course_id: courseId,
//         price: Number(price),
//       }]);

//       if (error) {
//         toast({ status: 'error', title: 'Insert failed', description: error.message });
//       } else {
//         toast({ status: 'success', title: 'Upload successful' });
//       }
//     }

//     setUploading(false);
//     setTitle('');
//     setFile(null);
//     setQuestionFile(null);
//     setAnswerFile(null);
//     setPrice(0);

//     const endTime = performance.now();
//     const totalTime = Math.round((endTime - startTime) / 1000);
//     if (totalTime > 120) {
//       toast({
//         status: 'warning',
//         title: 'Upload completed but slow',
//         description: `Took ${totalTime} seconds. Consider uploading smaller files.`,
//       });
//     }
//   };

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//           <option value="exercise">Exercise</option>
//         </Select>

//         <FormLabel>Price</FormLabel>
//         <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

//         {type !== 'exercise' && (
//           <>
//             <FormLabel>File</FormLabel>
//             <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
//           </>
//         )}

//         {type === 'exercise' && (
//           <>
//             <FormLabel>Exercise Question File</FormLabel>
//             <Input type="file" onChange={(e) => setQuestionFile(e.target.files[0])} />
//             <FormLabel>Exercise Answer File</FormLabel>
//             <Input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
//           </>
//         )}

//         {uploading && <Progress size="sm" isIndeterminate colorScheme="blue" />}

//         <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
//           {uploading ? 'Uploading…' : 'Upload'}
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;








































// the only problem now is whenypu upload video or pdf it will take time then it will appear in
// bucket is working givin me ans upload succefull 
// import { useState, useEffect } from 'react';
// import { Box, Button, Input, Select, VStack, FormLabel, useToast, Heading } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [price, setPrice] = useState(0);  // Price for subscription
//   const [courseId, setCourseId] = useState('');  // Course ID
//   const toast = useToast();

//   // Fetch courses from the database, set the default course if no courses exist
//   useEffect(() => {
//     const fetchCourses = async () => {
//       const { data, error } = await supabase.from('courses').select('id, title');
//       if (error) {
//         toast({ status: 'error', title: 'Error fetching courses', description: error.message });
//         console.error('Error fetching courses:', error);
//       } else {
//         if (data.length === 0) {
//           // No courses exist, so we create one
//           await supabase.from('courses').insert([{ title: 'General Course' }]);
//           setCourseId(1);  // Use ID of the first course
//         } else {
//           setCourseId(data[0].id);  // Default to first course
//         }
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleUpload = async () => {
//     if (!file || !title || !type || !courseId) {
//       toast({ status: 'error', title: 'Please complete all fields' });
//       return;
//     }

//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}-${title}.${fileExt}`;

//     // Upload file to Supabase storage (depending on type: PDF, exercise, or video)
//     const { error: uploadError } = await supabase
//       .storage
//       .from(type === 'exercise' ? 'course-pdfs' : 'course-videos')
//       .upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'Upload failed', description: uploadError.message });
//       return;
//     }

//     // Insert content into the 'course_content' table, linking it to the selected course
//     const { error: insertError } = await supabase
//       .from('course_content')
//       .insert([
//         {
//           title,
//           content_type: type,
//           storage_path: fileName,
//           course_id: courseId,  // Automatically assign course ID
//           price,  // Subscription price
//         },
//       ]);

//     if (insertError) {
//       toast({ status: 'error', title: 'DB insert failed', description: insertError.message });
//     } else {
//       toast({ status: 'success', title: 'Upload successful' });
//       setTitle('');
//       setFile(null);
//       setPrice(0);  // Reset fields after successful upload
//     }
//   };

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <FormLabel>Type</FormLabel>
//         <Select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="pdf">PDF</option>
//           <option value="exercise">Exercise</option>
//           <option value="video">Video</option>
//         </Select>

//         <FormLabel>Price</FormLabel>
//         <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Set price for subscription" />

//         <FormLabel>File</FormLabel>
//         <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

//         <Button colorScheme="teal" onClick={handleUpload}>Upload</Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;






































































// this error is in adding pdfs vidoe adds but no answer in programmer
// import { useState } from 'react';
// import {
//   Box, Button, Input, Select, VStack, FormControl,
//   FormLabel, useToast, Heading, Grid
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     content_type: 'video',
//     access_type: 'free',
//     price: '',
//     order_number: 1,
//   });
//   const [files, setFiles] = useState({});
//   const toast = useToast();

//   const handleFileChange = (type, file) => {
//     setFiles(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   const uploadFile = async (bucket, file, path) => {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .upload(path, file);

//     if (error) throw error;
//     return data.path;
//   };

//   const handleUpload = async () => {
//     try {
//       // === Validate fields ===
//       if (!formData.title || !formData.category) {
//         throw new Error('Please fill in the title and category fields');
//       }

//       if (formData.content_type === 'exercise' && (!files.questions || !files.answers)) {
//         throw new Error('Both question and answer files required for exercises');
//       }

//       if (formData.content_type !== 'exercise' && !files.main) {
//         throw new Error('Please select a file to upload');
//       }

//       let storagePath = '';
//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdfs',
//         exercise: 'course-exercises',
//       };

//       // === Upload file(s) ===
//       if (formData.content_type === 'exercise') {
//         const timestamp = Date.now();
//         const questionPath = `exercises/${timestamp}-questions.pdf`;
//         const answerPath = `exercises/${timestamp}-answers.pdf`;

//         await uploadFile(bucketMap.exercise, files.questions, questionPath);
//         await uploadFile(bucketMap.exercise, files.answers, answerPath);

//         await supabase.from('exercises').insert([{
//           title: formData.title,
//           questions: questionPath,
//           correct_answers: answerPath,
//           max_allscripts: 3,
//         }]);


//         storagePath = questionPath;
//       } else {
//         const ext = files.main.name.split('.').pop();
//         const filePath = `${formData.content_type}s/${Date.now()}-${formData.title}.${ext}`;
//         storagePath = await uploadFile(bucketMap[formData.content_type], files.main, filePath);
//       }

//       // === Insert to course_content ===
//       const insertData = {
//         title: formData.title,
//         content_type: formData.content_type, // Use content_type here
//         content: formData.category,
//         storage_path: storagePath,
//         order_number: formData.order_number,
//         created_at: new Date().toISOString(),
//         ...(formData.access_type === 'subscription' ? { price: formData.price } : {}),
//       };

//       const { error } = await supabase.from('course_content').insert([insertData]);
//       if (error) throw error;

//       toast({
//         status: 'success',
//         title: 'Upload successful!',
//         description: 'Your content has been uploaded and saved.',
//         duration: 3000,
//         isClosable: true,
//       });

//       setFormData({
//         title: '',
//         category: '',
//         content_type: 'video',
//         access_type: 'free',
//         price: '',
//         order_number: 1,
//       });
//       setFiles({});
//     } catch (err) {
//       toast({
//         status: 'error',
//         title: 'Upload failed',
//         description: err.message,
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box maxW="800px" mx="auto" p={6}>
//       <Heading mb={6}>Upload Course Material</Heading>

//       <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//         <FormControl isRequired>
//           <FormLabel>Course Title</FormLabel>
//           <Input
//             placeholder="Enter course title"
//             value={formData.title}
//             onChange={e => setFormData({ ...formData, title: e.target.value })}
//           />
//         </FormControl>

//         {/* === Changed: Course Category is input now === */}
//         <FormControl isRequired>
//           <FormLabel>Course Category</FormLabel>
//           <Input
//             placeholder="e.g. Grammar, Speaking"
//             value={formData.category}
//             onChange={e => setFormData({ ...formData, category: e.target.value })}
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>Content Type</FormLabel>
//           <Select
//             value={formData.content_type}
//             onChange={e => setFormData({ ...formData, content_type: e.target.value })}
//           >
//             <option value="video">Video</option>
//             <option value="pdf">PDF</option>
//             <option value="exercise">Exercise</option>
//           </Select>
//         </FormControl>

//         {/* === Access Type Selector === */}
//         <FormControl>
//           <FormLabel>Access Type</FormLabel>
//           <Select
//             value={formData.access_type}
//             onChange={e => setFormData({ ...formData, access_type: e.target.value })}
//           >
//             <option value="free">Free</option>
//             <option value="subscription">Subscription</option>
//           </Select>
//         </FormControl>

//         {/* === Show Price if Subscription === */}
//         {formData.access_type === 'subscription' && (
//           <FormControl isRequired>
//             <FormLabel>Price (USD)</FormLabel>
//             <Input
//               type="number"
//               placeholder="e.g. 10"
//               value={formData.price}
//               onChange={e => setFormData({ ...formData, price: e.target.value })}
//             />
//           </FormControl>
//         )}

//         <FormControl>
//           <FormLabel>Order Number</FormLabel>
//           <Input
//             type="number"
//             value={formData.order_number}
//             onChange={e => setFormData({ ...formData, order_number: parseInt(e.target.value, 10) })}
//           />
//         </FormControl>

//         {/* === File Upload Fields === */}
//         {formData.content_type === 'exercise' ? (
//           <>
//             <FormControl isRequired>
//               <FormLabel>Questions PDF</FormLabel>
//               <Input type="file" accept="application/pdf"
//                 onChange={e => handleFileChange('questions', e.target.files[0])} />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Answers PDF</FormLabel>
//               <Input type="file" accept="application/pdf"
//                 onChange={e => handleFileChange('answers', e.target.files[0])} />
//             </FormControl>
//           </>
//         ) : (
//           <FormControl isRequired>
//             <FormLabel>Upload File</FormLabel>
//             <Input
//               type="file"
//               accept={formData.content_type === 'video' ? 'video/*' : 'application/pdf'}
//               onChange={e => handleFileChange('main', e.target.files[0])}
//             />
//           </FormControl>
//         )}
//       </Grid>

//       <Button
//         mt={6}
//         colorScheme="blue"
//         onClick={handleUpload}
//         size="lg"
//         width="full"
//       >
//         Publish Content
//       </Button>
//     </Box>
//   );
// };

// export default AdminPage;




























// this code only problem is uploading pdf 
// import { useState } from 'react';
// import {
//   Box, Button, Input, Select, VStack, FormControl,
//   FormLabel, useToast, Heading, Grid
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     content_type: 'video',
//     access_type: 'free',
//     price: '',
//     order_number: 1,
//   });
//   const [files, setFiles] = useState({});
//   const toast = useToast();

//   const handleFileChange = (type, file) => {
//     setFiles(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   const uploadFile = async (bucket, file, path) => {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .upload(path, file);

//     if (error) throw error;
//     return data.path;
//   };

//   const handleUpload = async () => {
//     try {
//       // === Validate fields ===
//       if (!formData.title || !formData.category) {
//         throw new Error('Please fill in the title and category fields');
//       }

//       if (formData.content_type === 'exercise' && (!files.questions || !files.answers)) {
//         throw new Error('Both question and answer files required for exercises');
//       }

//       if (formData.content_type !== 'exercise' && !files.main) {
//         throw new Error('Please select a file to upload');
//       }

//       let storagePath = '';
//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdfs',
//         exercise: 'course-excersie',
//       };

//       // === Upload file(s) ===
//       if (formData.content_type === 'exercise') {
//         const timestamp = Date.now();
//         const questionPath = `exercises/${timestamp}-questions.pdf`;
//         const answerPath = `exercises/${timestamp}-answers.pdf`;

//         await uploadFile(bucketMap.exercise, files.questions, questionPath);
//         await uploadFile(bucketMap.exercise, files.answers, answerPath);

//         await supabase.from('exercises').insert([{
//           title: formData.title,
//           questions: questionPath,
//           correct_answers: answerPath,
//           max_allscripts: 3,
//         }]);

//         storagePath = questionPath;
//       } else {
//         const ext = files.main.name.split('.').pop();
//         const filePath = `${formData.content_type}s/${Date.now()}-${formData.title}.${ext}`;
//         storagePath = await uploadFile(bucketMap[formData.content_type], files.main, filePath);
//       }

//       // === Insert to course_content ===
//       const insertData = {
//         title: formData.title,
//         content_type: formData.content_type,
//         content: formData.category,
//         storage_path: storagePath,
//         order_number: formData.order_number,
//         created_at: new Date().toISOString(),
//         ...(formData.access_type === 'subscription' ? { access_type: 'subscription', price: formData.price } : { access_type: 'free' }),
//       };

//       const { error } = await supabase.from('course_content').insert([insertData]);
//       if (error) throw error;

//       toast({
//         status: 'success',
//         title: 'Upload successful!',
//         description: 'Your content has been uploaded and saved.',
//         duration: 4000,
//         isClosable: true,
//       });

//       setFormData({
//         title: '',
//         category: '',
//         content_type: 'video',
//         access_type: 'free',
//         price: '',
//         order_number: 1,
//       });
//       setFiles({});
//     } catch (err) {
//       toast({
//         status: 'error',
//         title: 'Upload failed',
//         description: err.message,
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box maxW="800px" mx="auto" p={6}>
//       <Heading mb={6}>Upload Course Material</Heading>

//       <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//         <FormControl isRequired>
//           <FormLabel>Course Title</FormLabel>
//           <Input
//             placeholder="Enter course title"
//             value={formData.title}
//             onChange={e => setFormData({ ...formData, title: e.target.value })}
//           />
//         </FormControl>

//         {/* === Changed: Course Category is input now === */}
//         <FormControl isRequired>
//           <FormLabel>Course Category</FormLabel>
//           <Input
//             placeholder="e.g. Grammar, Speaking"
//             value={formData.category}
//             onChange={e => setFormData({ ...formData, category: e.target.value })}
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>Content Type</FormLabel>
//           <Select
//             value={formData.content_type}
//             onChange={e => setFormData({ ...formData, content_type: e.target.value })}
//           >
//             <option value="video">Video</option>
//             <option value="pdf">PDF</option>
//             <option value="exercise">Exercise</option>
//           </Select>
//         </FormControl>

//         {/* === Access Type Selector === */}
//         <FormControl>
//           <FormLabel>Access Type</FormLabel>
//           <Select
//             value={formData.access_type}
//             onChange={e => setFormData({ ...formData, access_type: e.target.value })}
//           >
//             <option value="free">Free</option>
//             <option value="subscription">Subscription</option>
//           </Select>
//         </FormControl>

//         {/* === Show Price if Subscription === */}
//         {formData.access_type === 'subscription' && (
//           <FormControl isRequired>
//             <FormLabel>Price (USD)</FormLabel>
//             <Input
//               type="number"
//               placeholder="e.g. 10"
//               value={formData.price}
//               onChange={e => setFormData({ ...formData, price: e.target.value })}
//             />
//           </FormControl>
//         )}

//         <FormControl>
//           <FormLabel>Order Number</FormLabel>
//           <Input
//             type="number"
//             value={formData.order_number}
//             onChange={e => setFormData({ ...formData, order_number: parseInt(e.target.value, 10) })}
//           />
//         </FormControl>

//         {/* === File Upload Fields === */}
//         {formData.content_type === 'exercise' ? (
//           <>
//             <FormControl isRequired>
//               <FormLabel>Questions PDF</FormLabel>
//               <Input type="file" accept="application/pdf"
//                 onChange={e => handleFileChange('questions', e.target.files[0])} />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Answers PDF</FormLabel>
//               <Input type="file" accept="application/pdf"
//                 onChange={e => handleFileChange('answers', e.target.files[0])} />
//             </FormControl>
//           </>
//         ) : (
//           <FormControl isRequired>
//             <FormLabel>Upload File</FormLabel>
//             <Input
//               type="file"
//               accept={formData.content_type === 'video' ? 'video/*' : 'application/pdf'}
//               onChange={e => handleFileChange('main', e.target.files[0])}
//             />
//           </FormControl>
//         )}
//       </Grid>

//       <Button
//         mt={6}
//         colorScheme="blue"
//         onClick={handleUpload}
//         size="lg"
//         width="full"
//       >
//         Publish Content
//       </Button>
//     </Box>
//   );
// };

// export default AdminPage;
























// import { useState } from 'react';
// import {
//   Box, Button, Input, Select, VStack, FormControl,
//   FormLabel, useToast, Heading, Grid
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     content_type: 'video',
//     course_ui: '',
//     content: '',
//     storage_path: '',
//     order_number: 1,
//     access_type: 'free',  // free or subscription
//     price: ''
//   });

//   const [files, setFiles] = useState({});
//   const toast = useToast();

//   const handleFileChange = (type, file) => {
//     setFiles(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   const uploadFile = async (bucket, file, path) => {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .upload(path, file);

//     if (error) throw error;
//     return data.path;
//   };

//   const handleUpload = async () => {
//     try {
//       let storagePath = '';
//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdfs',
//         exercise: 'course-exercises'
//       };

//       if (formData.content_type === 'exercise' && (!files.questions || !files.answers)) {
//         throw new Error('Both question and answer files required for exercises');
//       }

//       if (formData.content_type !== 'exercise' && !files.main) {
//         throw new Error('Please select a file to upload');
//       }

//       const slug = formData.course_ui.trim().toLowerCase().replace(/\s+/g, '-');

//       // 🔧 Fixed slug check using `.limit(1)` instead of `.single()` to avoid 406 error
//       const { data: existingCategory, error: checkError } = await supabase
//         .from('categories')
//         .select('*')
//         .eq('slug', slug)
//         .limit(1);

//       if (checkError) throw checkError;

//       if (existingCategory.length === 0) {
//         const { error: insertCategoryError } = await supabase
//           .from('categories')
//           .insert([{ name: formData.course_ui.trim(), slug }]);

//         if (insertCategoryError) throw insertCategoryError;
//       }

//       if (formData.content_type === 'exercise') {
//         const questionPath = `exercises/${Date.now()}-questions.pdf`;
//         const answerPath = `exercises/${Date.now()}-answers.pdf`;

//         await uploadFile(bucketMap.exercise, files.questions, questionPath);
//         await uploadFile(bucketMap.exercise, files.answers, answerPath);

//         const { error: exError } = await supabase
//           .from('exercises')
//           .insert([{
//             content_ui: formData.title,
//             questions: questionPath,
//             correct_answers: answerPath,
//             max_allscripts: 3
//           }]);

//         if (exError) throw exError;
//         storagePath = questionPath;
//       } else {
//         const ext = files.main.name.split('.').pop();
//         const fileName = `${formData.content_type}s/${Date.now()}-${formData.title}.${ext}`;
//         storagePath = await uploadFile(bucketMap[formData.content_type], files.main, fileName);
//       }

//       const insertData = {
//         ...formData,
//         storage_path: storagePath,
//         created_at: new Date().toISOString()
//       };

//       if (formData.access_type === 'free') {
//         delete insertData.price; // No price if free
//       }

//       const { error } = await supabase
//         .from('course_content')
//         .insert([insertData]);

//       if (error) throw error;

//       toast({
//         status: 'success',
//         title: 'Upload successful!',
//         description: 'Content is now available to users',
//         duration: 3000
//       });

//       setFormData({
//         title: '',
//         content_type: 'video',
//         course_ui: '',
//         content: '',
//         storage_path: '',
//         order_number: 1,
//         access_type: 'free',
//         price: ''
//       });
//       setFiles({});

//     } catch (error) {
//       toast({
//         status: 'error',
//         title: 'Upload failed',
//         description: error.message,
//         duration: 5000
//       });
//     }
//   };

//   return (
//     <Box maxW="800px" mx="auto" p={6}>
//       <Heading mb={6}>Content Management System</Heading>

//       <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//         <FormControl isRequired>
//           <FormLabel>Course Category</FormLabel>
//           {/* 🔧 Changed from dropdown to input field to avoid slug-related errors */}
//           <Input
//             value={formData.course_ui}
//             onChange={e => setFormData({ ...formData, course_ui: e.target.value })}
//             placeholder="e.g., Speaking, Grammar"
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>Content Type</FormLabel>
//           <Select
//             value={formData.content_type}
//             onChange={e => setFormData({ ...formData, content_type: e.target.value })}
//           >
//             <option value="video">Video</option>
//             <option value="pdf">PDF</option>
//             <option value="exercise">Exercise</option>
//           </Select>
//         </FormControl>

//         <FormControl isRequired>
//           <FormLabel>Title</FormLabel>
//           <Input
//             value={formData.title}
//             onChange={e => setFormData({ ...formData, title: e.target.value })}
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>Access Type</FormLabel>
//           <Select
//             value={formData.access_type}
//             onChange={e => setFormData({ ...formData, access_type: e.target.value })}
//           >
//             <option value="free">Free</option>
//             <option value="subscription">Subscription</option>
//           </Select>
//         </FormControl>

//         {/* Show price input only if subscription */}
//         {formData.access_type === 'subscription' && (
//           <FormControl isRequired>
//             <FormLabel>Price (USD)</FormLabel>
//             <Input
//               type="number"
//               min="0"
//               value={formData.price}
//               onChange={e => setFormData({ ...formData, price: e.target.value })}
//             />
//           </FormControl>
//         )}

//         {formData.content_type === 'exercise' ? (
//           <>
//             <FormControl>
//               <FormLabel>Questions PDF</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={e => handleFileChange('questions', e.target.files[0])}
//               />
//             </FormControl>
//             <FormControl>
//               <FormLabel>Answers PDF</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={e => handleFileChange('answers', e.target.files[0])}
//               />
//             </FormControl>
//           </>
//         ) : (
//           <FormControl>
//             <FormLabel>Upload File</FormLabel>
//             <Input
//               type="file"
//               accept={formData.content_type === 'video' ? 'video/*' : 'application/pdf'}
//               onChange={e => handleFileChange('main', e.target.files[0])}
//             />
//           </FormControl>
//         )}

//         <FormControl>
//           <FormLabel>Order Number</FormLabel>
//           <Input
//             type="number"
//             min="1"
//             value={formData.order_number}
//             onChange={e => setFormData({ ...formData, order_number: e.target.value })}
//           />
//         </FormControl>
//       </Grid>

//       <Button mt={6} colorScheme="blue" onClick={handleUpload} size="lg" width="full">
//         Publish Content
//       </Button>
//     </Box>
//   );
// };

// export default AdminPage;










































// import { useState } from 'react';
// import {
//   Box, Button, Input, Select, VStack,
//   FormLabel, useToast, Heading, useColorMode
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('pdf');
//   const [file, setFile] = useState(null);
//   const [price, setPrice] = useState('');
//   const toast = useToast();
//   const { colorMode } = useColorMode();

//   const handleUpload = async () => {
//     if (!file || !title || !type || !price) {
//       toast({ status: 'error', title: 'Please complete all fields' });
//       return;
//     }

//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}-${title}.${fileExt}`;
//     const bucket = type === 'video' ? 'course-videos' : 'course-pdfs';

//     const { error: uploadError } = await supabase
//       .storage
//       .from(bucket)
//       .upload(fileName, file);

//     if (uploadError) {
//       toast({ status: 'error', title: 'Upload failed', description: uploadError.message });
//       return;
//     }

//     const { error: insertError } = await supabase
//       .from('course_content')
//       .insert([{
//         title,
//         content_type: type,
//         storage_path: fileName,
//         price: parseFloat(price),
//       }]);

//     if (insertError) {
//       toast({ status: 'error', title: 'DB insert failed', description: insertError.message });
//     } else {
//       toast({ status: 'success', title: 'Upload successful' });
//       setTitle('');
//       setFile(null);
//       setPrice('');
//     }
//   };

//   const glowHoverStyle = {
//     _hover: {
//       boxShadow:
//         colorMode === 'light'
//           ? '0 0 10px 2px orange'
//           : '0 0 10px 2px teal',
//       transform: 'scale(1.03)',
//       transition: '0.3s all ease-in-out',
//     },
//   };

//   return (
//     <Box maxW="600px" mx="auto" p={6}>
//       <Heading mb={6}>Admin Upload</Heading>
//       <VStack spacing={4} align="stretch">
//         <FormLabel>Title</FormLabel>
//         <Input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           {...glowHoverStyle}
//         />

//         <FormLabel>Type</FormLabel>
//         <Select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           {...glowHoverStyle}
//         >
//           <option value="pdf">PDF</option>
//           <option value="exercise">Exercise</option>
//           <option value="video">Video</option>
//         </Select>

//         <FormLabel>File</FormLabel>
//         <Input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//           {...glowHoverStyle}
//         />

//         <FormLabel>Price ($)</FormLabel>
//         <Input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           {...glowHoverStyle}
//         />

//         <Button
//           onClick={handleUpload}
//           colorScheme={colorMode === 'light' ? 'orange' : 'teal'}
//           {...glowHoverStyle}
//         >
//           Upload
//         </Button>
//       </VStack>
//     </Box>
//   );
// };

// export default AdminPage;






































// this code error is no answer when you upload the content
// import { useState, useEffect } from 'react';
// import {
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select,
//   Spinner, Text, Progress, useColorMode, useColorModeValue,
//   Flex
// } from '@chakra-ui/react';
// import { motion } from 'framer-motion';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MotionBox = motion(Box);

// const AdminPage = () => {
//   const [uploadData, setUploadData] = useState({
//     type: 'video',
//     title: '',
//     file: null,
//     answerFile: null,
//     price: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();
//   const { colorMode } = useColorMode();

//   const formBg = useColorModeValue('orange.50', 'teal.900');
//   const buttonGlow = useColorModeValue(
//     '0 0 15px rgba(255,165,0,0.5)',
//     '0 0 15px rgba(56,178,172,0.5)'
//   );
//   const borderColor = useColorModeValue('orange.200', 'teal.300');
//   const textColor = useColorModeValue('orange.800', 'teal.100');

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();

//       if (authError || !user) {
//         window.location.href = '/login';
//         return;
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (!profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }

//       setLoading(false);
//     };

//     verifyAdmin();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       const requiredFields = [];
//       if (!uploadData.title) requiredFields.push('Title');
//       if (!uploadData.file) requiredFields.push('File');
//       if (uploadData.type === 'exercise' && !uploadData.answerFile) {
//         requiredFields.push('Answer file');
//       }
//       if (!uploadData.price) requiredFields.push('Price');

//       if (requiredFields.length > 0) {
//         throw new Error(`Missing: ${requiredFields.join(', ')}`);
//       }

//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdf',
//         exercise: 'course-pdf'
//       };

//       const filePath = `${bucketMap[uploadData.type]}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       let answerPath = '';
//       if (uploadData.type === 'exercise') {
//         answerPath = `course-pdf/answers/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('course-pdf')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       const { error: dbError } = await supabase.from('course_content').insert({
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null,
//         price: parseFloat(uploadData.price)
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful!',
//         description: 'Content is now available to users',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       setUploadData({
//         type: 'video',
//         title: '',
//         file: null,
//         answerFile: null,
//         price: ''
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = '/Log-In';
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner size="xl" thickness="4px" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//       <Text mt={4} color={textColor}>
//         Verifying Admin Privileges...
//       </Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Flex justify="space-between" align="center" mb={8}>
//         <Heading
//           fontSize="3xl"
//           fontWeight="bold"
//           bgGradient={colorMode === 'dark'
//             ? 'linear(to-r, teal.300, teal.500)'
//             : 'linear(to-r, orange.400, orange.600)'}
//           bgClip="text"
//         >
//           Content Management Panel
//         </Heading>
//         <Button
//           colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//           onClick={handleLogout}
//           leftIcon={<ArrowBackIcon />}
//         >
//           Logout
//         </Button>
//       </Flex>

//       <MotionBox
//         bg={formBg}
//         p={6}
//         borderRadius="2xl"
//         boxShadow="xl"
//         borderWidth="2px"
//         borderColor={borderColor}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 300 }}
//       >
//         <VStack spacing={6}>
//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Content Type</FormLabel>
//             <Select
//               value={uploadData.type}
//               onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//               size="lg"
//               focusBorderColor={borderColor}
//             >
//               <option value="video">Video Lesson</option>
//               <option value="pdf">PDF Material</option>
//               <option value="exercise">Exercise</option>
//             </Select>
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Title</FormLabel>
//             <Input
//               value={uploadData.title}
//               onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//               placeholder="Enter content title"
//               size="lg"
//               focusBorderColor={borderColor}
//             />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>
//               {uploadData.type === 'exercise' ? 'Questions File' : 'Main File'}
//             </FormLabel>
//             <Input
//               type="file"
//               accept={
//                 uploadData.type === 'video' ? 'video/*' :
//                 uploadData.type === 'pdf' ? 'application/pdf' : '*'
//               }
//               onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//               p={1}
//               size="lg"
//               variant="unstyled"
//             />
//           </FormControl>

//           {uploadData.type === 'exercise' && (
//             <FormControl isRequired>
//               <FormLabel fontSize="lg" color={textColor}>Answer Key</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//                 variant="unstyled"
//               />
//             </FormControl>
//           )}

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Price</FormLabel>
//             <Input
//               type="number"
//               value={uploadData.price}
//               onChange={(e) => setUploadData({ ...uploadData, price: e.target.value })}
//               placeholder="Enter content price"
//               size="lg"
//               focusBorderColor={borderColor}
//             />
//           </FormControl>

//           {uploadProgress > 0 && (
//             <Progress
//               value={uploadProgress}
//               size="sm"
//               colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//               borderRadius="full"
//               hasStripe
//             />
//           )}

//           <Button
//             colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//             onClick={handleUpload}
//             isLoading={uploadProgress > 0}
//             loadingText="Uploading..."
//             size="lg"
//             width="full"
//             _hover={{
//               transform: 'scale(1.05)',
//               boxShadow: buttonGlow
//             }}
//             transition="all 0.2s"
//           >
//             Publish Content
//           </Button>
//         </VStack>
//       </MotionBox>
//     </Box>
//   );
// };

// export default AdminPage;















// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select,
//   Spinner, Alert, AlertIcon, Text, 
//   Progress, useColorMode, useColorModeValue,
//   Flex, IconButton
// } from '@chakra-ui/react';
// import { motion } from 'framer-motion';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { supabase } from '../Supabase/Supabse.js';

// const MotionBox = motion(Box);

// const AdminPage = () => {
//   const [uploadData, setUploadData] = useState({
//     type: 'video',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
  
//   const formBg = useColorModeValue('orange.50', 'teal.900');
//   const buttonGlow = useColorModeValue(
//     '0 0 15px rgba(255,165,0,0.5)', 
//     '0 0 15px rgba(56,178,172,0.5)'
//   );
//   const borderColor = useColorModeValue('orange.200', 'teal.300');
//   const textColor = useColorModeValue('orange.800', 'teal.100');

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
      
//       if (authError || !user) {
//         window.location.href = '/login';
//         return;
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (!profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }
      
//       setLoading(false);
//     };

//     verifyAdmin();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       const requiredFields = [];
//       if (!uploadData.title) requiredFields.push('Title');
//       if (!uploadData.file) requiredFields.push('File upload');
//       if (uploadData.type === 'exercise' && !uploadData.answerFile) {
//         requiredFields.push('Answer file');
//       }

//       if (requiredFields.length > 0) {
//         throw new Error(`Missing: ${requiredFields.join(', ')}`);
//       }

//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdf',
//         exercise: 'course-pdf'
//       };

//       // Upload main file
//       const filePath = `${bucketMap[uploadData.type]}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       let answerPath = '';
//       if (uploadData.type === 'exercise') {
//         answerPath = `course-pdf/answers/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('course-pdf')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       // Save to correct table
//       const { error: dbError } = await supabase.from('course_content').insert({
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful!',
//         description: 'Content is now available to users',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       setUploadData({
//         type: 'video',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = '/Log-In';
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner 
//         size="xl" 
//         thickness="4px" 
//         color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//       />
//       <Text mt={4} color={textColor}>
//         Verifying Admin Privileges...
//       </Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Flex justify="space-between" align="center" mb={8}>
//         <Heading
//           fontSize="3xl"
//           fontWeight="bold"
//           bgGradient={colorMode === 'dark' 
//             ? 'linear(to-r, teal.300, teal.500)'
//             : 'linear(to-r, orange.400, orange.600)'}
//           bgClip="text"
//         >
//           Content Management Panel
//         </Heading>
//         <Button
//           colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//           onClick={handleLogout}
//           leftIcon={<ArrowBackIcon />}
//         >
//           Logout
//         </Button>
//       </Flex>

//       <MotionBox
//         bg={formBg}
//         p={6}
//         borderRadius="2xl"
//         boxShadow="xl"
//         borderWidth="2px"
//         borderColor={borderColor}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 300 }}
//       >
//         <VStack spacing={6}>
//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Content Type</FormLabel>
//             <Select
//               value={uploadData.type}
//               onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//               size="lg"
//               focusBorderColor={borderColor}
//             >
//               <option value="video">Video Lesson</option>
//               <option value="pdf">PDF Material</option>
//               <option value="exercise">Exercise</option>
//             </Select>
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Title</FormLabel>
//             <Input
//               value={uploadData.title}
//               onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//               placeholder="Enter content title"
//               size="lg"
//               focusBorderColor={borderColor}
//             />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>
//               {uploadData.type === 'exercise' ? 'Questions File' : 'Main File'}
//             </FormLabel>
//             <Input
//               type="file"
//               accept={
//                 uploadData.type === 'video' ? 'video/*' : 
//                 uploadData.type === 'pdf' ? 'application/pdf' : '*'
//               }
//               onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//               p={1}
//               size="lg"
//               variant="unstyled"
//             />
//           </FormControl>

//           {uploadData.type === 'exercise' && (
//             <FormControl isRequired>
//               <FormLabel fontSize="lg" color={textColor}>Answer Key</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//                 variant="unstyled"
//               />
//             </FormControl>
//           )}

//           {uploadProgress > 0 && (
//             <Progress 
//               value={uploadProgress} 
//               size="sm" 
//               colorScheme={colorMode === 'dark' ? 'teal' : 'orange'} 
//               borderRadius="full"
//               hasStripe
//             />
//           )}

//           <Button
//             colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//             onClick={handleUpload}
//             isLoading={uploadProgress > 0}
//             loadingText="Uploading..."
//             size="lg"
//             width="full"
//             _hover={{
//               transform: 'scale(1.05)',
//               boxShadow: buttonGlow
//             }}
//             transition="all 0.2s"
//           >
//             Publish Content
//           </Button>
//         </VStack>
//       </MotionBox>
//     </Box>
//   );
// };

// export default AdminPage;























// AdminPage.jsx
// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select,
//   Spinner, Alert, AlertIcon, Text, 
//   Progress, useColorMode, useColorModeValue,
//   Flex, IconButton
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';
// import { motion } from 'framer-motion';
// import { ArrowBackIcon } from '@chakra-ui/icons';

// const MotionBox = motion(Box);

// const AdminPage = () => {
//   const [uploadData, setUploadData] = useState({
//     type: 'video',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
  
//   // Color mode values
//   const formBg = useColorModeValue('orange.50', 'teal.900');
//   const buttonGlow = useColorModeValue(
//     '0 0 15px rgba(255,165,0,0.5)', 
//     '0 0 15px rgba(56,178,172,0.5)'
//   );
//   const borderColor = useColorModeValue('orange.200', 'teal.300');
//   const textColor = useColorModeValue('orange.800', 'teal.100');

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
      
//       if (authError || !user) {
//         window.location.href = '/login';
//         return;
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (!profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }
      
//       setLoading(false);
//     };

//     verifyAdmin();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       // Validation
//       const requiredFields = [];
//       if (!uploadData.title) requiredFields.push('Title');
//       if (!uploadData.file) requiredFields.push('File upload');
//       if (uploadData.type === 'exercise' && !uploadData.answerFile) {
//         requiredFields.push('Answer file');
//       }

//       if (requiredFields.length > 0) {
//         throw new Error(`Missing: ${requiredFields.join(', ')}`);
//       }

//       // Bucket configuration
//       const bucketMap = {
//         video: 'course-videos',
//         pdf: 'course-pdfs',
//         exercise: 'course-pdfs'
//       };

//       // Upload main file
//       const filePath = `${bucketMap[uploadData.type]}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       // Handle answer file
//       let answerPath = '';
//       if (uploadData.type === 'exercise') {
//         answerPath = `course-pdfs/answers/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('course-pdfs')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       // Save to database
//       const { error: dbError } = await supabase.from('content').insert({
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful!',
//         description: 'Content is now available to users',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       // Reset form
//       setUploadData({
//         type: 'video',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = '/login';
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner 
//         size="xl" 
//         thickness="4px" 
//         color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//       />
//       <Text mt={4} color={textColor}>
//         Verifying Admin Privileges...
//       </Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Flex justify="space-between" align="center" mb={8}>
//         <Heading
//           fontSize="3xl"
//           fontWeight="bold"
//           bgGradient={colorMode === 'dark' 
//             ? 'linear(to-r, teal.300, teal.500)'
//             : 'linear(to-r, orange.400, orange.600)'}
//           bgClip="text"
//         >
//           Content Management Panel
//         </Heading>
//         <Button
//           colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//           onClick={handleLogout}
//           leftIcon={<ArrowBackIcon />}
//         >
//           Logout
//         </Button>
//       </Flex>

//       <MotionBox
//         bg={formBg}
//         p={6}
//         borderRadius="2xl"
//         boxShadow="xl"
//         borderWidth="2px"
//         borderColor={borderColor}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 300 }}
//       >
//         <VStack spacing={6}>
//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Content Type</FormLabel>
//             <Select
//               value={uploadData.type}
//               onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//               size="lg"
//               focusBorderColor={borderColor}
//             >
//               <option value="video">Video Lesson</option>
//               <option value="pdf">PDF Material</option>
//               <option value="exercise">Exercise</option>
//             </Select>
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>Title</FormLabel>
//             <Input
//               value={uploadData.title}
//               onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//               placeholder="Enter content title"
//               size="lg"
//               focusBorderColor={borderColor}
//             />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel fontSize="lg" color={textColor}>
//               {uploadData.type === 'exercise' ? 'Questions File' : 'Main File'}
//             </FormLabel>
//             <Input
//               type="file"
//               accept={
//                 uploadData.type === 'video' ? 'video/*' : 
//                 uploadData.type === 'pdf' ? 'application/pdf' : '*'
//               }
//               onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//               p={1}
//               size="lg"
//               variant="unstyled"
//             />
//           </FormControl>

//           {uploadData.type === 'exercise' && (
//             <FormControl isRequired>
//               <FormLabel fontSize="lg" color={textColor}>Answer Key</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//                 variant="unstyled"
//               />
//             </FormControl>
//           )}

//           {uploadProgress > 0 && (
//             <Progress 
//               value={uploadProgress} 
//               size="sm" 
//               colorScheme={colorMode === 'dark' ? 'teal' : 'orange'} 
//               borderRadius="full"
//               hasStripe
//             />
//           )}

//           <Button
//             colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//             onClick={handleUpload}
//             isLoading={uploadProgress > 0}
//             loadingText="Uploading..."
//             size="lg"
//             width="full"
//             _hover={{
//               transform: 'scale(1.05)',
//               boxShadow: buttonGlow
//             }}
//             transition="all 0.2s"
//           >
//             Publish Content
//           </Button>
//         </VStack>
//       </MotionBox>
//     </Box>
//   );
// };

// export default AdminPage;



// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select,
//   Spinner, Alert, AlertIcon,
//   Text, Progress, useColorMode, useColorModeValue,
//   Flex, IconButton
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';
// import { motion } from 'framer-motion';
// import { ArrowBackIcon } from '@chakra-ui/icons';

// const MotionBox = motion(Box);

// const AdminPage = () => {
//   const [uploadData, setUploadData] = useState({
//     type: 'video',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
  
//   // Color mode values
//   const formBg = useColorModeValue('orange.50', 'teal.900');
//   const buttonGlow = useColorModeValue('0 0 15px rgba(255,165,0,0.5)', '0 0 15px rgba(56,178,172,0.5)');
//   const borderColor = useColorModeValue('orange.200', 'teal.300');
//   const textColor = useColorModeValue('orange.800', 'teal.100');

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
      
//       if (authError || !user) {
//         window.location.href = '/Log-In';
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }
      
//       setLoading(false);
//     };

//     verifyAdmin();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       // Validate required fields
//       const requiredFields = [
//         !uploadData.title && 'Title',
//         !uploadData.file && 'File upload'
//       ].filter(Boolean);

//       if (uploadData.type === 'exercise' && !uploadData.answerFile) {
//         requiredFields.push('Answer file');
//       }

//       if (requiredFields.length > 0) {
//         throw new Error(`Missing required fields: ${requiredFields.join(', ')}`);
//       }

//       const bucketMap = {
//         video: 'videos',
//         pdf: 'pdfs',
//         exercise: 'exercises'
//       };

//       // Upload main file
//       const filePath = `${bucketMap[uploadData.type]}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       // Handle answer file only for exercises
//       let answerPath = '';
//       if (uploadData.type === 'exercise' && uploadData.answerFile) {
//         answerPath = `exercises/answers/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('exercises')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       // Save to database
//       const { error: dbError } = await supabase.from('content').insert({
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful',
//         status: 'success',
//         duration: 3000,
//       });

//       setUploadData({
//         type: 'video',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (!error) window.location.href = '/Log-In';
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner 
//         size="xl" 
//         thickness="4px" 
//         color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//       />
//       <Text mt={4} color={textColor}>
//         Verifying Admin Privileges...
//       </Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Flex justifyContent="space-between" alignItems="center" mb={8}>
//         <Heading 
//           fontSize="3xl" 
//           fontWeight="bold"
//           color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//         >
//           Content Upload Manager
//         </Heading>
//         <IconButton
//           aria-label="Logout"
//           icon={<ArrowBackIcon />}
//           colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//           onClick={handleLogout}
//           variant="ghost"
//         />
//       </Flex>
      
//       <Alert 
//         status="info" 
//         mb={6} 
//         borderRadius="md"
//         bg={colorMode === 'dark' ? 'teal.800' : 'orange.100'}
//         color={textColor}
//       >
//         <AlertIcon />
//         You are logged in with full administrative privileges
//       </Alert>

//       <MotionBox
//         bg={formBg}
//         p={6}
//         borderRadius="xl"
//         boxShadow="lg"
//         borderWidth="2px"
//         borderColor={borderColor}
//         whileHover={{ scale: 1.02 }}
//         transition={{ type: "spring", stiffness: 300 }}
//       >
//         <VStack spacing={4} align="stretch">
//           <FormControl isRequired>
//             <FormLabel color={textColor}>Content Type</FormLabel>
//             <Select
//               value={uploadData.type}
//               onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//               size="lg"
//               bg={formBg}
//             >
//               <option value="video">Video</option>
//               <option value="pdf">PDF</option>
//               <option value="exercise">Exercise</option>
//             </Select>
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel color={textColor}>Content Title</FormLabel>
//             <Input
//               value={uploadData.title}
//               onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//               placeholder="Enter content title"
//               size="lg"
//               bg={formBg}
//             />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel color={textColor}>
//               {uploadData.type === 'exercise' ? 'Questions File' : 
//                `${uploadData.type.toUpperCase()} File`}
//             </FormLabel>
//             <Input
//               type="file"
//               accept={
//                 uploadData.type === 'video' ? 'video/*' : 
//                 uploadData.type === 'pdf' ? 'application/pdf' : '*'
//               }
//               onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//               p={1}
//               size="lg"
//             />
//           </FormControl>

//           {uploadData.type === 'exercise' && (
//             <FormControl isRequired>
//               <FormLabel color={textColor}>Answer Key</FormLabel>
//               <Input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//               />
//             </FormControl>
//           )}

//           {uploadProgress > 0 && (
//             <Progress 
//               value={uploadProgress} 
//               size="sm" 
//               colorScheme={colorMode === 'dark' ? 'teal' : 'orange'} 
//               borderRadius="full" 
//             />
//           )}

//           <Button
//             colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//             onClick={handleUpload}
//             isLoading={uploadProgress > 0}
//             loadingText="Uploading..."
//             size="lg"
//             mt={4}
//             width="full"
//             _hover={{
//               boxShadow: buttonGlow,
//               transform: 'translateY(-2px)'
//             }}
//             transition="all 0.2s"
//           >
//             Upload Content
//           </Button>
//         </VStack>
//       </MotionBox>
//     </Box>
//   );
// };

// export default AdminPage;























































// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select, 
//   Spinner, SimpleGrid, Alert, AlertIcon,
//   Text, Progress, useColorMode, useColorModeValue,
//   Flex, IconButton
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';
// import { motion } from 'framer-motion';
// import { ArrowBackIcon } from '@chakra-ui/icons';

// const MotionBox = motion(Box);

// const AdminPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [uploadData, setUploadData] = useState({
//     type: 'video',
//     courseId: '',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();
//   const { colorMode } = useColorMode();
  
//   // Color mode values
//   const formBg = useColorModeValue('orange.50', 'teal.900');
//   const buttonGlow = useColorModeValue('0 0 15px rgba(255,165,0,0.5)', '0 0 15px rgba(56,178,172,0.5)');
//   const borderColor = useColorModeValue('orange.200', 'teal.300');
//   const textColor = useColorModeValue('orange.800', 'teal.100');

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
      
//       if (authError || !user) {
//         window.location.href = '/Log-In';
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }
      
//       setLoading(false);
//     };

//     const loadCourses = async () => {
//       const { data, error } = await supabase.from('courses').select('*');
//       if (error) {
//         console.error('Error loading courses:', error);
//         toast({
//           title: 'Course Load Failed',
//           status: 'error',
//           duration: 3000,
//         });
//       }
//       setCourses(data || []);
//     };

//     verifyAdmin();
//     loadCourses();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       // Validate required fields based on content type
//       const requiredFields = [
//         !uploadData.courseId && 'Course selection',
//         !uploadData.title && 'Title',
//         !uploadData.file && 'File upload'
//       ].filter(Boolean);

//       if (uploadData.type === 'exercise' && !uploadData.answerFile) {
//         requiredFields.push('Answer file');
//       }

//       if (requiredFields.length > 0) {
//         throw new Error(`Missing required fields: ${requiredFields.join(', ')}`);
//       }

//       // Check if course exists
//       const { data: course, error: courseError } = await supabase
//         .from('courses')
//         .select('id')
//         .eq('id', uploadData.courseId)
//         .single();

//       if (courseError || !course) {
//         throw new Error('Selected course does not exist');
//       }

//       const bucketMap = {
//         video: 'videos',
//         pdf: 'pdfs',
//         exercise: 'exercises'
//       };

//       // Upload main file
//       const filePath = `${bucketMap[uploadData.type]}/${uploadData.courseId}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       // Handle answer file only for exercises
//       let answerPath = '';
//       if (uploadData.type === 'exercise' && uploadData.answerFile) {
//         answerPath = `exercises/answers/${uploadData.courseId}/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('exercises')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       // Save to database
//       const { error: dbError } = await supabase.from('content').insert({
//         course_id: uploadData.courseId,
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful',
//         status: 'success',
//         duration: 3000,
//       });

//       setUploadData({
//         type: 'video',
//         courseId: '',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (!error) window.location.href = '/Log-In';
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner 
//         size="xl" 
//         thickness="4px" 
//         color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//       />
//       <Text mt={4} color={textColor}>
//         Verifying Admin Privileges...
//       </Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="1200px" mx="auto">
//       <Flex justifyContent="space-between" alignItems="center" mb={8}>
//         <Heading 
//           fontSize="3xl" 
//           fontWeight="bold"
//           color={colorMode === 'dark' ? 'teal.300' : 'orange.500'}
//         >
//           Admin Content Manager
//         </Heading>
//         <IconButton
//           aria-label="Logout"
//           icon={<ArrowBackIcon />}
//           colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//           onClick={handleLogout}
//           variant="ghost"
//         />
//       </Flex>
      
//       <Alert 
//         status="info" 
//         mb={6} 
//         borderRadius="md"
//         bg={colorMode === 'dark' ? 'teal.800' : 'orange.100'}
//         color={textColor}
//       >
//         <AlertIcon />
//         You are logged in as an administrator
//       </Alert>

//       <SimpleGrid columns={[1, 2]} spacing={8}>
//         <MotionBox
//           bg={formBg}
//           p={6}
//           borderRadius="xl"
//           boxShadow="lg"
//           borderWidth="2px"
//           borderColor={borderColor}
//           whileHover={{ scale: 1.02 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <VStack spacing={4} align="stretch">
//             <FormControl isRequired>
//               <FormLabel color={textColor}>Content Type</FormLabel>
//               <Select
//                 value={uploadData.type}
//                 onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//                 size="lg"
//                 bg={formBg}
//               >
//                 <option value="video">Video</option>
//                 <option value="pdf">PDF</option>
//                 <option value="exercise">Exercise</option>
//               </Select>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>Select Course</FormLabel>
//               <Select
//                 value={uploadData.courseId}
//                 onChange={(e) => setUploadData({ ...uploadData, courseId: e.target.value })}
//                 placeholder="Choose course"
//                 size="lg"
//                 bg={formBg}
//               >
//                 {courses.map(course => (
//                   <option key={course.id} value={course.id}>{course.title}</option>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>Content Title</FormLabel>
//               <Input
//                 value={uploadData.title}
//                 onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//                 placeholder="Enter content title"
//                 size="lg"
//                 bg={formBg}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel color={textColor}>
//                 {uploadData.type === 'exercise' ? 'Questions File' : 
//                  `${uploadData.type.toUpperCase()} File`}
//               </FormLabel>
//               <Input
//                 type="file"
//                 accept={
//                   uploadData.type === 'video' ? 'video/*' : 
//                   uploadData.type === 'pdf' ? 'application/pdf' : '*'
//                 }
//                 onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//               />
//             </FormControl>

//             {uploadData.type === 'exercise' && (
//               <FormControl isRequired>
//                 <FormLabel color={textColor}>Answer Key</FormLabel>
//                 <Input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                   p={1}
//                   size="lg"
//                 />
//               </FormControl>
//             )}

//             {uploadProgress > 0 && (
//               <Progress 
//                 value={uploadProgress} 
//                 size="sm" 
//                 colorScheme={colorMode === 'dark' ? 'teal' : 'orange'} 
//                 borderRadius="full" 
//               />
//             )}

//             <Button
//               colorScheme={colorMode === 'dark' ? 'teal' : 'orange'}
//               onClick={handleUpload}
//               isLoading={uploadProgress > 0}
//               loadingText="Uploading..."
//               size="lg"
//               mt={4}
//               width="full"
//               _hover={{
//                 boxShadow: buttonGlow,
//                 transform: 'translateY(-2px)'
//               }}
//               transition="all 0.2s"
//             >
//               Upload Content
//             </Button>
//           </VStack>
//         </MotionBox>

//         <MotionBox
//           bg={formBg}
//           p={6}
//           borderRadius="xl"
//           boxShadow="lg"
//           borderWidth="2px"
//           borderColor={borderColor}
//           whileHover={{ scale: 1.02 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <Heading size="lg" mb={4} color={textColor}>Upload Guidelines</Heading>
//           <VStack align="start" spacing={3} color={textColor}>
//             <Text>📚 Supported Formats:</Text>
//             <Text>- Videos: MP4, MOV, AVI (max 500MB)</Text>
//             <Text>- PDFs: Course materials, articles</Text>
//             <Text>- Exercises: PDF/DOCX + PDF Answer Key</Text>
            
//             <Text mt={4}>🔐 Security Notes:</Text>
//             <Text>- All uploads are version controlled</Text>
//             <Text>- Answer keys stored separately</Text>
//             <Text>- Automatic weekly backups</Text>
//           </VStack>
//         </MotionBox>
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default AdminPage;







// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select, 
//   Spinner, SimpleGrid, Alert, AlertIcon,
//   Text, Progress
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse.js';

// const AdminPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [uploadData, setUploadData] = useState({
//     type: 'exercise',
//     courseId: '',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const toast = useToast();

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         window.location.href = '/Log-In';
//         return;
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (!profile || profile.role !== 'admin') {
//         window.location.href = '/';
//         return;
//       }
      
//       setLoading(false);
//     };

//     const loadCourses = async () => {
//       const { data, error } = await supabase.from('courses').select('*');
//       if (error) console.error('Error loading courses:', error);
//       setCourses(data || []);
//     };

//     verifyAdmin();
//     loadCourses();
//   }, []);

//   const handleUpload = async () => {
//     setUploadProgress(0);
//     try {
//       if (!uploadData.courseId || !uploadData.title || !uploadData.file) {
//         throw new Error('Please fill all required fields');
//       }

//       const bucketMap = {
//         video: 'videos',
//         pdf: 'pdfs',
//         exercise: 'exercises'
//       };

//       // Upload main file
//       const filePath = `${bucketMap[uploadData.type]}/${uploadData.courseId}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from(bucketMap[uploadData.type])
//         .upload(filePath, uploadData.file, {
//           cacheControl: '3600',
//           upsert: false,
//           onProgress: (progress) => {
//             setUploadProgress((progress.loadedBytes / progress.totalBytes) * 100);
//           }
//         });

//       if (uploadError) throw uploadError;

//       // Handle answer file
//       let answerPath = '';
//       if (uploadData.type === 'exercise' && uploadData.answerFile) {
//         answerPath = `exercises/answers/${uploadData.courseId}/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('exercises')
//           .upload(answerPath, uploadData.answerFile);
//         if (answerError) throw answerError;
//       }

//       // Save to database
//       const { error: dbError } = await supabase.from('content').insert({
//         course_id: uploadData.courseId,
//         title: uploadData.title,
//         type: uploadData.type,
//         file_path: filePath,
//         answer_path: answerPath || null
//       });

//       if (dbError) throw dbError;

//       toast({
//         title: 'Upload Successful',
//         status: 'success',
//         duration: 3000,
//       });

//       setUploadData({
//         type: 'exercise',
//         courseId: '',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploadProgress(0);
//     }
//   };

//   if (loading) return (
//     <Box textAlign="center" mt={20}>
//       <Spinner size="xl" thickness="4px" />
//       <Text mt={4}>Verifying Admin Privileges...</Text>
//     </Box>
//   );

//   return (
//     <Box p={8} maxW="1200px" mx="auto">
//       <Heading mb={8} fontSize="3xl" fontWeight="bold">
//         Admin Content Manager
//       </Heading>
      
//       <Alert status="info" mb={6} borderRadius="md">
//         <AlertIcon />
//         You are logged in as an administrator
//       </Alert>

//       <SimpleGrid columns={[1, 2]} spacing={8}>
//         <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
//           <VStack spacing={4} align="stretch">
//             <FormControl isRequired>
//               <FormLabel>Content Type</FormLabel>
//               <Select
//                 value={uploadData.type}
//                 onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//                 size="lg"
//               >
//                 <option value="exercise">Exercise</option>
//                 <option value="video">Video</option>
//                 <option value="pdf">PDF</option>
//               </Select>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Select Course</FormLabel>
//               <Select
//                 value={uploadData.courseId}
//                 onChange={(e) => setUploadData({ ...uploadData, courseId: e.target.value })}
//                 placeholder="Choose course"
//                 size="lg"
//               >
//                 {courses.map(course => (
//                   <option key={course.id} value={course.id}>{course.title}</option>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Content Title</FormLabel>
//               <Input
//                 value={uploadData.title}
//                 onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//                 placeholder="Enter content title"
//                 size="lg"
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Upload File</FormLabel>
//               <Input
//                 type="file"
//                 accept={
//                   uploadData.type === 'video' ? 'video/*' : 
//                   uploadData.type === 'pdf' ? 'application/pdf' : '*'
//                 }
//                 onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//                 p={1}
//                 size="lg"
//               />
//             </FormControl>

//             {uploadData.type === 'exercise' && (
//               <FormControl isRequired>
//                 <FormLabel>Answer Key</FormLabel>
//                 <Input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                   p={1}
//                   size="lg"
//                 />
//               </FormControl>
//             )}

//             {uploadProgress > 0 && (
//               <Progress value={uploadProgress} size="sm" colorScheme="blue" borderRadius="full" />
//             )}

//             <Button
//               colorScheme="blue"
//               onClick={handleUpload}
//               isLoading={uploadProgress > 0}
//               loadingText="Uploading..."
//               size="lg"
//               mt={4}
//               width="full"
//             >
//               Upload Content
//             </Button>
//           </VStack>
//         </Box>

//         <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
//           <Heading size="lg" mb={4}>Quick Guidelines</Heading>
//           <VStack align="start" spacing={3}>
//             <Text fontSize="md">📚 Supported Formats:</Text>
//             <Text>- Videos: MP4, MOV, AVI (max 500MB)</Text>
//             <Text>- PDFs: Course materials, articles</Text>
//             <Text>- Exercises: PDF or DOCX + Answer Key</Text>
            
//             <Text fontSize="md" mt={4}>🔐 Security Notes:</Text>
//             <Text>- All uploads are version controlled</Text>
//             <Text>- Answer keys are stored separately</Text>
//             <Text>- Weekly backup of all content</Text>
//           </VStack>
//         </Box>
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default AdminPage;






























// import { useState, useEffect } from 'react';
// import { 
//   Box, VStack, FormControl, FormLabel, Input,
//   Button, useToast, Heading, Select, 
//   Spinner, SimpleGrid
// } from '@chakra-ui/react';
// import { supabase } from '../Supabase/Supabse';

// const AdminPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [uploadData, setUploadData] = useState({
//     type: 'exercise',
//     courseId: '',
//     title: '',
//     file: null,
//     answerFile: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     const verifyAdmin = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       const { data: admin } = await supabase
//         .from('profiles')
//         .select()
//         .eq('user_id', user.id)
//         .single();

//       if (!admin) window.location = '/';
//       setLoading(false);
//     };

//     const loadCourses = async () => {
//       const { data } = await supabase.from('courses').select('*');
//       setCourses(data || []);
//     };

//     verifyAdmin();
//     loadCourses();
//   }, []);

//   const handleUpload = async () => {
//     setUploading(true);
    
//     try {
//       // Upload files
//       const filePath = `courses/${uploadData.courseId}/${Date.now()}-${uploadData.file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from('documents')
//         .upload(filePath, uploadData.file);

//       if (uploadError) throw uploadError;

//       // For exercises, handle answer file
//       if (uploadData.type === 'exercise') {
//         const answerPath = `courses/${uploadData.courseId}/answers/${Date.now()}-${uploadData.answerFile.name}`;
//         const { error: answerError } = await supabase.storage
//           .from('documents')
//           .upload(answerPath, uploadData.answerFile);

//         if (answerError) throw answerError;

//         // Save to exercises table
//         await supabase.from('exercises').insert({
//           course_id: uploadData.courseId,
//           title: uploadData.title,
//           questions_document_url: filePath,
//           answers_document_url: answerPath
//         });
//       }

//       toast({
//         title: 'Upload Successful',
//         status: 'success',
//         duration: 3000,
//       });

//       // Reset form
//       setUploadData({
//         type: 'exercise',
//         courseId: '',
//         title: '',
//         file: null,
//         answerFile: null
//       });

//     } catch (error) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) return <Spinner size="xl" />;

//   return (
//     <Box p={8} maxW="1200px" mx="auto">
//       <Heading mb={8}>Admin Content Manager</Heading>

//       <SimpleGrid columns={2} spacing={8}>
//         <Box bg="white" p={6} borderRadius="md" boxShadow="md">
//           <VStack spacing={4}>
//             <FormControl>
//               <FormLabel>Content Type</FormLabel>
//               <Select
//                 value={uploadData.type}
//                 onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
//               >
//                 <option value="exercise">Exercise</option>
//                 <option value="video">Video</option>
//                 <option value="pdf">PDF</option>
//               </Select>
//             </FormControl>

//             <FormControl>
//               <FormLabel>Course</FormLabel>
//               <Select
//                 value={uploadData.courseId}
//                 onChange={(e) => setUploadData({ ...uploadData, courseId: e.target.value })}
//                 placeholder="Select course"
//               >
//                 {courses.map(course => (
//                   <option key={course.id} value={course.id}>{course.title}</option>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl>
//               <FormLabel>Title</FormLabel>
//               <Input
//                 value={uploadData.title}
//                 onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>
//                 {uploadData.type === 'exercise' ? 'Questions File' : 
//                  uploadData.type === 'video' ? 'Video File' : 'PDF File'}
//               </FormLabel>
//               <Input
//                 type="file"
//                 accept={
//                   uploadData.type === 'video' ? 'video/*' : 
//                   uploadData.type === 'pdf' ? 'application/pdf' : '*'
//                 }
//                 onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
//               />
//             </FormControl>

//             {uploadData.type === 'exercise' && (
//               <FormControl>
//                 <FormLabel>Answer Key</FormLabel>
//                 <Input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setUploadData({ ...uploadData, answerFile: e.target.files[0] })}
//                 />
//               </FormControl>
//             )}

//             <Button
//               colorScheme="blue"
//               onClick={handleUpload}
//               isLoading={uploading}
//               w="full"
//               mt={4}
//             >
//               Upload Content
//             </Button>
//           </VStack>
//         </Box>

//         {/* Add content preview/management section here */}
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default AdminPage;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../Supabase/Supabse.js';
// import { 
//   Tabs, TabList, TabPanels, Tab, TabPanel, 
//   FormControl, FormLabel, VStack, Box,
//   useColorMode, useToast, Text, Input,
//   Spinner, Flex, Center
// } from '@chakra-ui/react';

// const AdminPage = () => {
//   const { colorMode } = useColorMode();
//   const toast = useToast();
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         navigate('/Log-In');
//         return;
//       }

//       const { data: profile, error } = await supabase
//         .from('admin')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single();

//       if (error || !profile?.is_admin) {
//         toast({
//           title: 'Unauthorized',
//           description: 'Admin access required',
//           status: 'error',
//           duration: 3000
//         });
//         navigate('/');
//       }
//       setLoading(false);
//     };

//     checkAdmin();
//   }, [navigate, toast]);

//   const uploadStyle = {
//     border: '2px dashed',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//     _hover: {
//       boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//       transform: 'translateY(-2px)'
//     },
//     transition: 'all 0.3s ease',
//     p: 6,
//     borderRadius: 'md',
//     cursor: 'pointer',
//     position: 'relative'
//   };

//   const handleFileUpload = async (file, fileType) => {
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       const fileName = `${Date.now()}-${file.name}`;
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       const { error: dbError } = await supabase
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .insert([{
//           title: file.name,
//           file_path: uploadData.path,
//           file_type: file.type,
//           file_size: file.size,
//         }]);

//       if (dbError) throw dbError;

//       toast({
//         render: () => (
//           <Box
//             color="white"
//             p={3}
//             bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'}
//             borderRadius="md"
//           >
//             <Text fontWeight="bold">{fileType.toUpperCase()} Uploaded!</Text>
//             <Text>{file.name} was successfully uploaded</Text>
//           </Box>
//         ),
//         duration: 3000,
//       });
//     } catch (error) {
//       toast({
//         title: 'Upload failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Center minH="100vh">
//         <Spinner size="xl" />
//       </Center>
//     );
//   }

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Tabs variant="enclosed">
//         <TabList>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload Video
//           </Tab>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload PDF
//           </Tab>
//         </TabList>

//         <TabPanels mt={4}>
//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('video-upload').click()}
//                 opacity={uploading ? 0.7 : 1}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     top={0}
//                     left={0}
//                     right={0}
//                     bottom={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl">Select Video File</FormLabel>
//                 <Input
//                   type="file"
//                   id="video-upload"
//                   accept="video/*"
//                   hidden
//                   onChange={(e) => {
//                     if (e.target.files?.[0]) {
//                       handleFileUpload(e.target.files[0], 'video');
//                     }
//                   }}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2}>
//                   Supported formats: MP4, AVI, MOV | Max size: 100MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>

//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('pdf-upload').click()}
//                 opacity={uploading ? 0.7 : 1}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     top={0}
//                     left={0}
//                     right={0}
//                     bottom={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl">Select PDF File</FormLabel>
//                 <Input
//                   type="file"
//                   id="pdf-upload"
//                   accept="application/pdf"
//                   hidden
//                   onChange={(e) => {
//                     if (e.target.files?.[0]) {
//                       handleFileUpload(e.target.files[0], 'pdf');
//                     }
//                   }}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2}>
//                   Maximum file size: 50MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default AdminPage;
















// import React, { useState } from 'react';
// import { supabase } from '../Supabase/Supabse.js';
// import { 
//   Tabs, TabList, TabPanels, Tab, TabPanel, 
//   FormControl, FormLabel, VStack, Box,
//   useColorMode, useToast, Text, Input,
//   Spinner, Flex
// } from '@chakra-ui/react';

// const AdminPage = () => {
//   const { colorMode } = useColorMode();
//   const toast = useToast();
//   const [uploading, setUploading] = useState(false);

//   const uploadStyle = {
//     border: '2px dashed',
//     borderColor: colorMode === 'dark' ? 'teal.300' : 'orange.300',
//     _hover: {
//       boxShadow: colorMode === 'dark' ? '0 0 15px teal' : '0 0 15px orange',
//       transform: 'translateY(-2px)'
//     },
//     transition: 'all 0.3s ease',
//     p: 6,
//     borderRadius: 'md',
//     cursor: 'pointer',
//     position: 'relative'
//   };

//   const handleFileUpload = async (file, fileType) => {
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       // Upload file to storage
//       const fileName = `${Date.now()}-${file.name}`;
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       // Add metadata to database
//       const { error: dbError } = await supabase
//         .from(fileType === 'video' ? 'videos' : 'pdfs')
//         .insert([{
//           title: file.name,
//           file_path: uploadData.path,
//           file_type: file.type,
//           file_size: file.size,
//         }]);

//       if (dbError) throw dbError;

//       toast({
//         render: () => (
//           <Box
//             color="white"
//             p={3}
//             bg={colorMode === 'dark' ? 'teal.500' : 'orange.500'}
//             borderRadius="md"
//           >
//             <Text fontWeight="bold">{fileType.toUpperCase()} Uploaded!</Text>
//             <Text>{file.name} was successfully uploaded</Text>
//           </Box>
//         ),
//         duration: 3000,
//       });
//     } catch (error) {
//       toast({
//         title: 'Upload failed',
//         description: error.message,
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Box p={8} maxW="800px" mx="auto">
//       <Tabs variant="enclosed">
//         <TabList>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload Video
//           </Tab>
//           <Tab 
//             _selected={{ color: 'white', bg: colorMode === 'dark' ? 'teal.500' : 'orange.500' }}
//             isDisabled={uploading}
//           >
//             Upload PDF
//           </Tab>
//         </TabList>

//         <TabPanels mt={4}>
//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('video-upload').click()}
//                 opacity={uploading ? 0.7 : 1}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     top={0}
//                     left={0}
//                     right={0}
//                     bottom={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl">Select Video File</FormLabel>
//                 <Input
//                   type="file"
//                   id="video-upload"
//                   accept="video/*"
//                   hidden
//                   onChange={(e) => {
//                     if (e.target.files?.[0]) {
//                       handleFileUpload(e.target.files[0], 'video');
//                     }
//                   }}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2}>
//                   Supported formats: MP4, AVI, MOV | Max size: 100MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>

//           <TabPanel>
//             <VStack spacing={6}>
//               <FormControl
//                 {...uploadStyle}
//                 onClick={() => !uploading && document.getElementById('pdf-upload').click()}
//                 opacity={uploading ? 0.7 : 1}
//               >
//                 {uploading && (
//                   <Flex
//                     position="absolute"
//                     top={0}
//                     left={0}
//                     right={0}
//                     bottom={0}
//                     bg="blackAlpha.600"
//                     alignItems="center"
//                     justifyContent="center"
//                     borderRadius="md"
//                   >
//                     <Spinner size="xl" color={colorMode === 'dark' ? 'teal.300' : 'orange.500'} />
//                   </Flex>
//                 )}
//                 <FormLabel fontSize="xl">Select PDF File</FormLabel>
//                 <Input
//                   type="file"
//                   id="pdf-upload"
//                   accept="application/pdf"
//                   hidden
//                   onChange={(e) => {
//                     if (e.target.files?.[0]) {
//                       handleFileUpload(e.target.files[0], 'pdf');
//                     }
//                   }}
//                   disabled={uploading}
//                 />
//                 <Text fontSize="sm" color="gray.500" mt={2}>
//                   Maximum file size: 50MB
//                 </Text>
//               </FormControl>
//             </VStack>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Box>
//   );
// };

// export default AdminPage;