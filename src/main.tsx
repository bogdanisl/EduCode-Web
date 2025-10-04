import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes/routes.tsx'
import Header from './components/header.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
