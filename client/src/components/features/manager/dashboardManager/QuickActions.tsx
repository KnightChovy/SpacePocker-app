import {
  PlusCircle,
  Wrench,
  UserPlus,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionItemProps {
  Icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  onClick?: () => void;
}

const ActionItem = ({ Icon, label, color, bg, onClick }: ActionItemProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-transparent hover:border-primary/50 hover:shadow-lg transition-all group gap-2"
  >
    <div
      className={`size-10 rounded-full ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
    >
      <Icon className="size-5" />
    </div>
    <span className="text-xs font-semibold text-slate-800">{label}</span>
  </button>
);

export const QuickActions = () => {
  const navigate = useNavigate();

  const handleNewBooking = () => {
    navigate('/manager/bookings');
    // The booking page will handle showing the modal
  };

  const handleMaintenance = () => {
    navigate('/manager/schedule');
    // Navigate to schedule page for maintenance scheduling
  };

  const handleAddUser = () => {
    // TODO: Implement user management modal or page
    console.log('Add user clicked - feature coming soon');
  };

  const handleReports = () => {
    navigate('/manager/analytics');
  };

  return (
    <div className="p-6 rounded-xl bg-white/60 backdrop-blur-md border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <ActionItem
          Icon={PlusCircle}
          label="New Booking"
          color="text-primary"
          bg="bg-primary/10"
          onClick={handleNewBooking}
        />
        <ActionItem
          Icon={Wrench}
          label="Maintenance"
          color="text-amber-600"
          bg="bg-amber-100"
          onClick={handleMaintenance}
        />
        <ActionItem
          Icon={UserPlus}
          label="Add User"
          color="text-teal-600"
          bg="bg-teal-100"
          onClick={handleAddUser}
        />
        <ActionItem
          Icon={FileText}
          label="Reports"
          color="text-indigo-600"
          bg="bg-indigo-100"
          onClick={handleReports}
        />
      </div>
    </div>
  );
};
