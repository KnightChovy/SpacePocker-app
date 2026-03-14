import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/user/dashboard/Dashboard';
import Bookings from '@/pages/user/dashboard/Bookings';
import Favorites from '@/pages/user/dashboard/Favorites';
import Settings from '@/pages/user/dashboard/Settings';
import Billings from '@/pages/user/dashboard/Billings';
import UserLayout from '@/components/layouts/UserLayout';
import BookingRequestWizardPage from '@/pages/user/booking/BookingRequestWizardPage';

const UserRoute = () => {
  return (
    <Routes>
      {/* Booking wizard (no navbar/sidebar) */}
      <Route path="booking" element={<BookingRequestWizardPage />} />

      <Route element={<UserLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="settings" element={<Settings />} />
        <Route path="billing" element={<Billings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
