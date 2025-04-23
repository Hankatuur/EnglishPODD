import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
// import { SubscriptionProvider } from './Components/SubscriptionContext.jsx'



createRoot(document.getElementById('root')).render(

  <StrictMode>
      {/* <SubscriptionProvider> */}
  <BrowserRouter>
   <ChakraProvider>
    <App />
    </ChakraProvider>
  </BrowserRouter>
  {/* </SubscriptionProvider> */}
  </StrictMode>
 
 
)
