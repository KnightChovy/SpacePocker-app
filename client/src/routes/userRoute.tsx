import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/user/Layout';
import Dashboard from '@/pages/user/dashboard/Dashboard';
import Bookings from '@/pages/user/dashboard/Bookings';
import Favorites from '@/pages/user/dashboard/Favorites';
import Settings from '@/pages/user/dashboard/Settings';
import Billings from '@/pages/user/dashboard/Billings';

const UserRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billing" element={<Billings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default UserRoute;
