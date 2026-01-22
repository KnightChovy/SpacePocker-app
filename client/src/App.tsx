import RegisterPage from './pages/auth/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth-register" element={<RegisterPage />} />
      <Route path="/auth-login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
