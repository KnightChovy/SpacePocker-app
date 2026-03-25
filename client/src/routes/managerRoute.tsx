import ManagerLayout from '@/components/layouts/ManagerLayout';
import ManagerBookingPage from '@/pages/manager/ManagerBookingPage';
import ManagerBuildingPage from '@/pages/manager/ManagerBuildingPage';
import ManagerDashboardPage from '@/pages/manager/ManagerDashboardPage';
import ManagerRoomPage from '@/pages/manager/ManagerRoomPage';
import ManagerSchedulePage from '@/pages/manager/ManagerSchedulePage';
import ManagerSettingsPage from '@/pages/manager/ManagerSettingsPage';
import ManagerProfilePage from '@/pages/manager/ManagerProfilePage';
import ManagerServiceCategoriesPage from '@/pages/manager/ManagerServiceCategoriesPage';
import { Route, Routes } from 'react-router-dom';

const ManagerRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ManagerLayout />}>
        <Route path="dashboard" element={<ManagerDashboardPage />} />
        <Route path="schedule" element={<ManagerSchedulePage />} />
        <Route path="rooms" element={<ManagerRoomPage />} />
        <Route path="bookings" element={<ManagerBookingPage />} />
        <Route path="buildings" element={<ManagerBuildingPage />} />
        <Route
          path="service-categories"
          element={<ManagerServiceCategoriesPage />}
        />
        <Route path="profile" element={<ManagerProfilePage />} />
        <Route path="settings" element={<ManagerSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default ManagerRoute;
