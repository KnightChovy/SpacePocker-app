import type { Building, ScheduleBooking } from '@/types/types';

export const BUILDINGS: Building[] = [
  { id: 'b1', name: 'Main Building', count: 12, checked: true },
  { id: 'b2', name: 'Science Building', count: 8, checked: true },
  { id: 'b3', name: 'Arts Center', count: 5, checked: false },
];

export type TimelineRoom = {
  id: string;
  name: string;
  capacity: number;
};

export const ROOMS: TimelineRoom[] = [
  { id: 'r1', name: 'Lab 305', capacity: 12 },
  { id: 'r2', name: 'Studio 4', capacity: 20 },
  { id: 'r3', name: 'Room A-101', capacity: 30 },
  { id: 'r4', name: 'Auditorium', capacity: 100 },
];

export const BOOKINGS: ScheduleBooking[] = [
  {
    id: 'bk1',
    roomId: 'r1',
    title: 'Team Sync',
    subtitle: 'Engineering',
    startTime: '09:00',
    endTime: '10:00',
    type: 'primary',
    icon: 'groups',
  },
  {
    id: 'bk2',
    roomId: 'r2',
    title: 'Workshop',
    subtitle: 'Design',
    startTime: '10:00',
    endTime: '12:00',
    type: 'teal',
    icon: 'brush',
  },
  {
    id: 'bk3',
    roomId: 'r4',
    title: 'Maintenance',
    subtitle: 'AV System',
    startTime: '13:00',
    endTime: '15:00',
    type: 'maintenance',
    icon: 'build',
  },
];
