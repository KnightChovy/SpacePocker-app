import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';
import SpaceDetailPage from './pages/user/space/SpaceDetailPage';
import SpacesPage from './pages/user/space/SpacesPage';
import UserRoute from './routes/userRoute';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth-register" element={<RegisterPage />} />
        <Route path="/auth-login" element={<LoginPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/spaces/detail/:id" element={<SpaceDetailPage />} />
        <Route path="/user/*" element={<UserRoute />} />
      </Routes>
    </>
  );
}

export default App;
