import FinancialPage from '@/pages/admin/FinancialPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import SpacesPage from '@/pages/admin/SpacesPage';
import UsersPage from '@/pages/admin/UsersPage';
import { Routes, Route, Navigate } from 'react-router-dom';

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/spaces" element={<SpacesPage />} />
      <Route path="/finance" element={<FinancialPage />} />
      <Route path="/settings" element={<DashboardPage />} />
      <Route path="/security" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoute;
