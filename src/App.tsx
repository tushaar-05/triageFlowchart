import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProtocolBuilderPage from './pages/ProtocolBuilderPage';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoginClick={() => navigate('/auth')} />} />
      <Route path="/auth" element={<AuthPage onLoginSuccess={() => navigate('/dashboard')} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/builder" element={<ProtocolBuilderPage onBack={() => navigate('/dashboard')} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;
