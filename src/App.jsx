
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Auth from './Auth/Auth'
// import About from '../Components/about'
// import LogIn from './Components/LogIn'
import SignUp from './Components/SignUp'
import AdminPage from './pages/AdminPage'
import Confirm from './Components/Confirm'
import CreateAdmin from './Components/CreateAdmin'
import ProtectedRoute from './Components/ProtectedRoute'
import Material from './Components/Material'
// import StatsSection from './Components/StatsSection'

import Login from './Components/LogIn'
import ExercisePage from './pages/ExercisePage'
import ThankYouPage from './Components/ThankYouPage'
import Subs from './pages/Subs'

// import Login from './Components/LogIn'
// import SignUp from './Components/SignUp'
// import SubscriptionManagement from './Components/Subscription'

function App() {
 

  return (
   <>
  <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/Materials' element={<Material/>}/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/Log-In' element={<Login/>}/>
    <Route path='/Sign-Up' element={<SignUp/>}/>
    <Route path='/Admin' element={<AdminPage/>}/>
    <Route path='/Confirm' element={<Confirm/>}/>
    <Route path='/Exersice' element={<ExercisePage/>}/>
    {/* <Route path='/Welcome' element={<StatsSection/>}/> */}
    <Route path='/Create' element={<CreateAdmin/>}/>
    <Route path='/subscription' element={<Subs/>}/>
    <Route path='/ThankYou' element={<ThankYouPage/>}/>
    {/* <Route path="/Create" element={
        <ProtectedRoute adminOnly>
          <CreateAdmin />
        </ProtectedRoute>
      }/> */}
    
  </Routes>
    </>
  )
}

export default App
