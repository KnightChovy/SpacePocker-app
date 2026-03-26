import DashboardPage from '@/pages/admin/DashboardPage';
import SpacesPage from '@/pages/admin/SpacesPage';
import UsersPage from '@/pages/admin/UsersPage';
import AmenitiesPage from '@/pages/admin/AmenitiesPage';
import ServicesPage from '@/pages/admin/ServicesPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import SecurityPage from '@/pages/admin/SecurityPage';
import TransactionsPage from '@/pages/admin/TransactionsPage';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Routes, Route, Navigate } from 'react-router-dom';

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/amenities" element={<AmenitiesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
