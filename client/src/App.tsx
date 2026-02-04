import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';
import SpaceDetailPage from './pages/user/space/SpaceDetailPage';
import SpacesPage from './pages/user/space/SpacesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSpacesPage from './pages/admin/AdminSpacesPage';
import AdminFinancialPage from './pages/admin/AdminFinancialPage';

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
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/spaces" element={<AdminSpacesPage />} />
        <Route path="/admin/finance" element={<AdminFinancialPage />} />
        <Route path="/admin/settings" element={<AdminDashboardPage />} />
        <Route path="/admin/security" element={<AdminDashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
