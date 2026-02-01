import RegisterPage from './pages/auth/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';
import SpacesPage from './pages/SpacesPage';
import SpaceDetailPage from './pages/SpaceDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth-register" element={<RegisterPage />} />
      <Route path="/auth-login" element={<LoginPage />} />
      <Route path="/spaces" element={<SpacesPage />} />
      <Route path="/spaces/detail/:id" element={<SpaceDetailPage />} />
    </Routes>
  );
}

export default App;
