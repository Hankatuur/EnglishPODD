import { pdfjs } from 'react-pdf';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Auth from './Auth/Auth';
import SignUp from './Components/SignUp';
import AdminPage from './pages/AdminPage';
import Confirm from './Components/Confirm';
import CreateAdmin from './Components/CreateAdmin';
import Material from './Components/Material';
import Login from './Components/LogIn';
import ExercisePage from './pages/ExercisePage';
import ThankYouPage from './Components/ThankYouPage';
import TestConnection from './Components/TestConnection';
import EnvCheck from './Components/EnvCheck';
import ProtectedRoute from './Components/ProtectedRoute';

// Set up PDF worker first
pdfjs.GlobalWorkerOptions.workerSrc = 
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      
      {/* Debug routes */}
      <Route path="/debug/connection" element={<TestConnection />} />
      <Route path="/debug/env" element={<EnvCheck />} />

      {/* Auth routes */}
      <Route path='/auth' element={<Auth />} />
      <Route path='/Log-In' element={<Login />} />
      <Route path='/Sign-Up' element={<SignUp />} />

      {/* Content routes */}
      <Route path='/materials' element={<Material />} />
      
      {/* Admin-related routes protected by the adminOnly logic */}
      <Route path='/Admin' element={
        <ProtectedRoute adminOnly>
          <AdminPage />
        </ProtectedRoute>
      } />
      
      <Route path='/Create' element={
        <ProtectedRoute adminOnly>
          <CreateAdmin />
        </ProtectedRoute>
      } />
      
      <Route path='/Confirm' element={<Confirm />} />
      <Route path='/Exercise' element={<ExercisePage />} />
      <Route path='/ThankYou' element={<ThankYouPage />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;































// working but problem in protecting route
// import { pdfjs } from 'react-pdf';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import './App.css';
// import HomePage from './pages/HomePage';
// import Auth from './Auth/Auth';
// import SignUp from './Components/SignUp';
// import AdminPage from './pages/AdminPage';
// import Confirm from './Components/Confirm';
// import CreateAdmin from './Components/CreateAdmin';
// import Material from './Components/Material';
// import Login from './Components/LogIn';
// import ExercisePage from './pages/ExercisePage';
// import ThankYouPage from './Components/ThankYouPage';
// // import EnrollComponent from './Components/HOOKS/EnrollComponent';
// import TestConnection from './Components/TestConnection';
// import EnvCheck from './Components/EnvCheck';
// import ProtectedRoute from './Components/ProtectedRoute';

// // Set up PDF worker first
// pdfjs.GlobalWorkerOptions.workerSrc = 
//   `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// function App() {
//   return (
//     <Routes>
//       <Route path='/' element={<HomePage />} />
      
//       {/* Debug routes */}
//       <Route path="/debug/connection" element={<TestConnection />} />
//       <Route path="/debug/env" element={<EnvCheck />} />

//       {/* Auth routes */}
//       <Route path='/auth' element={<Auth />} />
//       <Route path='/Log-In' element={<Login />} />
//       <Route path='/Sign-Up' element={<SignUp />} />

//       {/* Content routes */}
//       <Route path='/materials' element={<Material />} />
//       <Route path='/Admin' element={<AdminPage />} />
//       <Route path='/Confirm' element={<Confirm />} />
//       <Route path='/Exercise' element={<ExercisePage />} />
//       <Route path='/Create' element={<CreateAdmin />} />
//       {/* <Route path='/subscription' element={<EnrollComponent />} /> */}
//       <Route path='/ThankYou' element={<ThankYouPage />} />

//       <Route path='/Create' element={
//         <ProtectedRoute adminOnly>
//           <CreateAdmin />
//         </ProtectedRoute>
//       } />

//       {/* Catch-all route */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;















// import './App.css'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import HomePage from './pages/HomePage'
// import Auth from './Auth/Auth'
// // import About from '../Components/about'
// // import LogIn from './Components/LogIn'
// import SignUp from './Components/SignUp'
// import AdminPage from './pages/AdminPage'
// import Confirm from './Components/Confirm'
// import CreateAdmin from './Components/CreateAdmin'
// // import ProtectedRoute from './Components/ProtectedRoute'
// import Material from './Components/Material'
// // import StatsSection from './Components/StatsSection'

// import Login from './Components/LogIn'
// import ExercisePage from './pages/ExercisePage'
// import ThankYouPage from './Components/ThankYouPage'
// import EnrollComponent from './Components/HOOKS/EnrollComponent'
// import TestConnection from './Components/TestConnection'
// import EnvCheck from './Components/EnvCheck'




// // import Login from './Components/LogIn'
// // import SignUp from './Components/SignUp'
// // import SubscriptionManagement from './Components/Subscription'

// function App() {
 

//   return (
//    <>
//   <Routes>
//     <Route path='/' element={<HomePage/>}/>

//     <Route path="/debug/connection" element={<TestConnection />} />
//     <Route path="/debug/env" element={<EnvCheck />} />

//     <Route path='/auth' element={<Auth/>}/>
//     <Route path='/Log-In' element={<Login/>}/>
//     <Route path='/Sign-Up' element={<SignUp/>}/>
//     <Route path='/Admin' element={<AdminPage/>}/>
//     <Route path='/Confirm' element={<Confirm/>}/>
//     <Route path='/Exersice' element={<ExercisePage/>}/>
//     {/* <Route path='/Welcome' element={<StatsSection/>}/> */}
//     <Route path='/Create' element={<CreateAdmin/>}/>
//     <Route path='/subscription' element={<EnrollComponent/>}/>
//  <Route path='/materials' element={<Material />} />
    
//     <Route path='/ThankYou' element={<ThankYouPage/>}/>
//     {/* <Route path="/Create" element={
//         <ProtectedRoute adminOnly>
//           <CreateAdmin />
//         </ProtectedRoute>
//       }/> */}
    
//   </Routes>
//     </>
//   )
// }

// export default App







































// import './App.css';
// import { Route, Routes } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import Auth from './Auth/Auth';
// import SignUp from './Components/SignUp';
// import AdminPage from './pages/AdminPage';
// import Confirm from './Components/Confirm';
// import CreateAdmin from './Components/CreateAdmin';
// import ProtectedRoute from './Components/ProtectedRoute';
// import Material from './Components/Material';
// import Login from './Components/LogIn';
// import ExercisePage from './pages/ExercisePage';
// import ThankYouPage from './Components/ThankYouPage';

// function App() {
//   return (
//     <Routes>
//       {/* Main Pages */}
//       <Route path='/' element={<HomePage />} />
//       <Route path='/auth' element={<Auth />} />
      
//       {/* Course Materials (Dynamic Route) */}
//       <Route path='/materials/:courseid' element={<Material />} />

//       {/* Authentication */}
//       <Route path='/Log-In' element={<Login />} />
//       <Route path='/Sign-Up' element={<SignUp />} />

//       {/* Admin Section */}
//       <Route path='/Admin' element={<AdminPage />} />
//       <Route path='/Create' element={
//         <ProtectedRoute adminOnly>
//           <CreateAdmin />
//         </ProtectedRoute>
//       } />

//       {/* Other Pages */}
//       <Route path='/Confirm' element={<Confirm />} />
//       <Route path='/Exersice' element={<ExercisePage />} />
//       <Route path='/ThankYou' element={<ThankYouPage />} />

//       {/* Fallback Route */}
//       <Route path='*' element={<div>404 - Page Not Found</div>} />
//     </Routes>
//   );
// }

// export default App;



























