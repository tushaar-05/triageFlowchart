import { useState } from 'react';
import './index.css';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth'>('landing');

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onLoginClick={() => setCurrentPage('auth')} />
      ) : (
        <AuthPage /* Maybe add an onBackClick if needed later */ />
      )}
    </>
  );
}

export default App;
