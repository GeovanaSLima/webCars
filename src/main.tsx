import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { register } from 'swiper/element/bundle'

import { Toaster } from 'react-hot-toast'
import { CarProvider } from './context/CarContext.tsx'

register();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <AuthProvider>
      <CarProvider>
        <RouterProvider router={router} />
      </CarProvider>
    </AuthProvider>
  </StrictMode>,
)
