import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes/routes.tsx'
import Header from './components/header.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import Footer from './components/footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes/>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
