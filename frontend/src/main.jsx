import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthModal from './components/AuthModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthModal />
  </StrictMode>,
)
