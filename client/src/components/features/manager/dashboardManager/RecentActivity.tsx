import type { Activity } from '@/types/types';
import { CircleX, Mail, UserRoundCog } from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const getStyle = () => {
    switch (activity.type) {
      case 'booking':
        return 'border-primary';
      case 'maintenance':
        return 'border-accent-orange';
      case 'inquiry':
        return 'border-accent-teal';
      case 'cancellation':
        return 'border-gray-200';
    }
  };

  const getIcon = () => {
    switch (activity.type) {
      case 'maintenance':
        return (
          <span className="material-symbols-outlined text-[18px] text-accent-orange">
            <UserRoundCog />
          </span>
        );
      case 'inquiry':
        return (
          <span className="material-symbols-outlined text-[18px] text-accent-teal">
            <Mail />
          </span>
        );
      case 'cancellation':
        return (
          <span className="material-symbols-outlined text-[18px] text-gray-400">
            <CircleX />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 relative z-10">
      <div
        className={`size-10 rounded-full bg-white border-2 ${getStyle()} flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
      >
        {activity.user.avatar ? (
          <img
            src={activity.user.avatar}
            className="size-full object-cover"
            alt={activity.user.name}
          />
        ) : (
          getIcon()
        )}
      </div>
      <div className="flex flex-col pt-0.5">
        <p className="text-sm text-text-dark font-medium">
          {activity.user.name}{' '}
          <span className="text-gray-500 font-normal">{activity.action}</span>{' '}
          <span className="font-bold text-primary">{activity.target}</span>
        </p>
        {activity.detail && (
          <div className="mt-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-500 italic">
            "{activity.detail}"
          </div>
        )}
        <span className="text-xs text-gray-400 mt-1">{activity.timestamp}</span>
      </div>
    </div>
  );
};

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft flex flex-col h-full max-h-125">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-dark">Recent Activity</h3>
        <button className="text-xs text-primary font-medium hover:underline">
          View All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-4.75 top-2 bottom-2 w-0.5 bg-gray-100"></div>
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};
