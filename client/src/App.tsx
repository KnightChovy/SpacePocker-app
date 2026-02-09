import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';
import SpaceDetailPage from './pages/user/space/SpaceDetailPage';
import SpacesPage from './pages/user/space/SpacesPage';

// Manager imports
import ManagerLayout from './components/layouts/ManagerLayout';
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import ManagerSchedulePage from './pages/manager/ManagerSchedulePage';
import ManagerRoomPage from './pages/manager/ManagerRoomPage';
import ManagerBookingPage from './pages/manager/ManagerBookingPage';
import { AnalyticsPage } from './pages/manager/AnalyticsPage';

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

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="" element={<ManagerDashboardPage />} />
          <Route path="schedule" element={<ManagerSchedulePage />} />
          <Route path="rooms" element={<ManagerRoomPage />} />
          <Route path="bookings" element={<ManagerBookingPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
