import type React from 'react';

export interface Transaction {
  id: string;
  userName: string;
  userAvatar: string;
  spaceName: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Stat {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export type Role = 'Admin' | 'Host' | 'Guest';
export type Status = 'Active' | 'Idle' | 'Suspended' | 'Offline';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
  avatarUrl?: string;
  isRestricted?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  section: 'Main Menu' | 'System';
}

export type SpaceStatus =
  | 'Approved'
  | 'Pending Review'
  | 'Rejected'
  | 'Archived';
export type SpaceCategory = 'Meeting Room' | 'Classroom' | 'Office' | 'Storage';

export interface Space {
  id: string;
  name: string;
  subName: string;
  image: string;
  host: {
    name: string;
    avatar: string;
    initials?: string;
  };
  location: string;
  category: SpaceCategory;
  price: number;
  priceUnit: 'hr' | 'day';
  status: SpaceStatus;
  capacity?: number;
}

export interface InventoryStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export enum TransactionStatus {
  SUCCEEDED = 'Succeeded',
  REFUNDED = 'Refunded',
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export enum PayoutStatus {
  PAID = 'Paid',
  SCHEDULED = 'Scheduled',
  PROCESSING = 'Processing',
  CANCELLED = 'Cancelled',
}

export interface PaymentUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface PaymentTransaction {
  id: string;
  user: PaymentUser;
  date: string;
  time: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
  payoutStatus: PayoutStatus;
}

export interface StatData {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  iconBg: string;
  iconColor: string;
}
