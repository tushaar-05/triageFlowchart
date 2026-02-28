import { useState } from 'react';
import './index.css';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onLoginClick={() => setCurrentPage('auth')} />
      )}
      {currentPage === 'auth' && (
        <AuthPage onLoginSuccess={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'dashboard' && (
        <DashboardPage onLogout={() => setCurrentPage('auth')} />
      )}
    </>
  );
}

export default App;
