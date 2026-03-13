import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SpaceDetailPage from './pages/user/space/SpaceDetailPage';
import SpacesPage from './pages/user/space/SpacesPage';
import UserRoute from './routes/userRoute';
import AdminRoute from './routes/adminRoute';
import ManagerRoute from './routes/managerRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth-register" element={<RegisterPage />} />
        <Route path="/auth-login" element={<LoginPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/spaces/detail/:id" element={<SpaceDetailPage />} />

        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
