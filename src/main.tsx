import { createRoot } from 'react-dom/client'
import 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
