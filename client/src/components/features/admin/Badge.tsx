import React from 'react';
import type { Role, Status } from '@/types/admin-types';

interface BadgeProps {
  type: Role | Status;
}

export const RoleBadge: React.FC<BadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200 icon-shield_person';
      case 'Host':
        return 'bg-teal-50 text-teal-600 border-teal-100 icon-apartment';
      case 'Guest':
        return 'bg-gray-100 text-gray-700 border-gray-200 icon-person';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 icon-person';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'Admin':
        return 'shield_person';
      case 'Host':
        return 'apartment';
      case 'Guest':
        return 'person';
      default:
        return 'person';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStyles().split(' icon-')[0]}`}
    >
      <span className="material-symbols-outlined text-[14px]">{getIcon()}</span>
      {type}
    </span>
  );
};

export const StatusBadge: React.FC<BadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200 dot-green-500';
      case 'Idle':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dot-yellow-500';
      case 'Suspended':
        return 'bg-red-50 text-red-700 border-red-200 dot-red-500';
      case 'Offline':
        return 'bg-gray-100 text-gray-500 border-gray-200 dot-gray-400';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200 dot-gray-400';
    }
  };

  const dotColor = getStyles().split('dot-')[1];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStyles().split(' dot-')[0]}`}
    >
      <span
        className={`size-1.5 rounded-full bg-${dotColor} ${type === 'Active' ? 'animate-pulse' : ''}`}
      ></span>
      {type}
    </span>
  );
};
