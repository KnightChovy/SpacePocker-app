import type {
  StatItem,
  Activity,
  ChartDataItem,
  BookingDistribution,
  ScheduleRoom,
  ScheduleBooking,
  Building,
  NavItem,
  User,
  ManagerRoom,
  Booking,
} from '../types/types';

// Schedule Manager Data
export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar_month', active: true },
  { id: 'users', label: 'Users', icon: 'group' },
  { id: 'reports', label: 'Reports', icon: 'analytics' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const BUILDINGS: Building[] = [
  { id: 'north', name: 'North Campus', count: 4, checked: true },
  { id: 'innovation', name: 'Innovation Hub', count: 8, checked: true },
  { id: 'science', name: 'Science Block', count: 2, checked: false },
  { id: 'main', name: 'Main Hall', count: 12, checked: true },
];

export const ROOMS: ScheduleRoom[] = [
  { id: 'r1', name: 'Room 101 (Lab)', type: 'Lab', capacity: 20 },
  { id: 'r2', name: 'Room 102 (Conf)', type: 'Conference', capacity: 8 },
  { id: 'r3', name: 'Main Auditorium', type: 'Auditorium', capacity: 200 },
  { id: 'r4', name: 'Study Room A', type: 'Study', capacity: 4 },
  { id: 'r5', name: 'Room 103 (Classroom)', type: 'Classroom', capacity: 30 },
];

export const BOOKINGS: ScheduleBooking[] = [
  {
    id: 'b1',
    roomId: 'r1',
    title: 'Physics 101 Intro',
    subtitle: 'Prof. Smith • 25 students',
    startTime: '10:00',
    endTime: '12:00',
    type: 'primary',
  },
  {
    id: 'b2',
    roomId: 'r2',
    title: 'Marketing Sync',
    subtitle: 'Internal • Hybrid',
    startTime: '12:00',
    endTime: '13:30',
    type: 'teal',
  },
  {
    id: 'b3',
    roomId: 'r2',
    title: 'Client Workshop',
    subtitle: 'Pending Approval',
    startTime: '14:30',
    endTime: '16:45',
    type: 'amber',
  },
  {
    id: 'b4',
    roomId: 'r3',
    title: 'Annual Tech Symposium',
    subtitle: 'External Rental • Full Service',
    startTime: '10:30',
    endTime: '14:30',
    type: 'primary',
    icon: 'mic_external_on',
  },
  {
    id: 'b5',
    roomId: 'r4',
    title: 'Deep Cleaning & Maintenance',
    subtitle: '',
    startTime: '14:00',
    endTime: '17:00',
    type: 'maintenance',
    icon: 'cleaning_services',
  },
];

// Dashboard Data
export const stats: StatItem[] = [
  {
    label: 'Total Revenue',
    value: '$48,250',
    trend: 12.5,
    type: 'revenue',
  },
  {
    label: 'Active Bookings',
    value: 24,
    subtext: 'Currently ongoing',
    type: 'bookings',
  },
  {
    label: 'Occupancy Rate',
    value: '78%',
    trend: 5.2,
    subtext: 'Higher than avg (72%)',
    type: 'occupancy',
  },
  {
    label: 'Inquiries',
    value: 12,
    subtext: 'Requires attention today',
    type: 'inquiries',
  },
];

export const revenueData: ChartDataItem[] = [
  { name: 'Jan', value: 18000 },
  { name: 'Feb', value: 24000 },
  { name: 'Mar', value: 28000 },
  { name: 'Apr', value: 34000 },
  { name: 'May', value: 38000 },
  { name: 'Jun', value: 42000 },
];

export const roomTypeDistribution: BookingDistribution[] = [
  { roomType: 'Meeting', booked: 75, available: 25 },
  { roomType: 'Lecture', booked: 45, available: 55 },
  { roomType: 'Labs', booked: 60, available: 40 },
  { roomType: 'Studios', booked: 85, available: 15 },
  { roomType: 'Halls', booked: 30, available: 70 },
];

export const activities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Alex Morgan',
      avatar: 'https://picsum.photos/seed/alex/100/100',
    },
    action: 'approved booking for',
    target: 'Conf Room B',
    timestamp: '2 minutes ago',
    type: 'booking',
  },
  {
    id: '2',
    user: { name: 'System', avatar: '' },
    action: 'Maintenance reported for',
    target: 'Lab 305',
    detail: 'Projector not responding to inputs',
    timestamp: '1 hour ago',
    type: 'maintenance',
  },
  {
    id: '3',
    user: { name: 'Tech Corp Inc.', avatar: '' },
    action: 'New inquiry from',
    target: 'Tech Corp Inc.',
    timestamp: '3 hours ago',
    type: 'inquiry',
  },
  {
    id: '4',
    user: { name: 'Studio 4', avatar: '' },
    action: 'Booking cancelled for',
    target: 'Studio 4',
    timestamp: 'Yesterday, 4:30 PM',
    type: 'cancellation',
  },
];

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Morgan',
  role: 'Facility Manager',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
};

// Manager Room Data (for Room Management Page)
export const MANAGER_ROOMS: ManagerRoom[] = [
  {
    id: '1',
    name: 'Conference Room A',
    building: 'North Campus',
    type: 'Conference',
    capacity: 20,
    pricePerHour: 50,
    status: 'available',
    amenities: ['Projector', 'Whiteboard', 'WiFi', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
    description: 'Modern conference room with full AV setup',
  },
  {
    id: '2',
    name: 'Meeting Room 101',
    building: 'Innovation Hub',
    type: 'Meeting',
    capacity: 8,
    pricePerHour: 30,
    status: 'occupied',
    amenities: ['TV Screen', 'WiFi', 'Whiteboard'],
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300',
    description: 'Cozy meeting room perfect for small team discussions',
  },
  {
    id: '3',
    name: 'Study Room B',
    building: 'Main Hall',
    type: 'Study',
    capacity: 4,
    pricePerHour: 15,
    status: 'available',
    amenities: ['WiFi', 'Power Outlets', 'Desk Lamp'],
    imageUrl:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=300',
    description: 'Quiet study space for focused work',
  },
  {
    id: '4',
    name: 'Event Hall',
    building: 'Main Hall',
    type: 'Event',
    capacity: 200,
    pricePerHour: 200,
    status: 'maintenance',
    amenities: ['Stage', 'Sound System', 'Projector', 'WiFi', 'Microphones'],
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300',
    description: 'Large event space for conferences and gatherings',
  },
  {
    id: '5',
    name: 'Creative Studio',
    building: 'Innovation Hub',
    type: 'Studio',
    capacity: 10,
    pricePerHour: 45,
    status: 'available',
    amenities: ['Green Screen', 'Lighting Kit', 'WiFi', 'Camera Equipment'],
    imageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300',
    description: 'Professional studio for content creation',
  },
  {
    id: '6',
    name: 'Board Room',
    building: 'North Campus',
    type: 'Conference',
    capacity: 16,
    pricePerHour: 75,
    status: 'available',
    amenities: ['Video Conference', 'Projector', 'WiFi', 'Catering Service'],
    imageUrl:
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=300',
    description: 'Executive board room for high-level meetings',
  },
  {
    id: '7',
    name: 'Workshop Space',
    building: 'Science Block',
    type: 'Workshop',
    capacity: 30,
    pricePerHour: 55,
    status: 'occupied',
    amenities: ['Workbenches', 'Tools', 'WiFi', 'First Aid Kit'],
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300',
    description: 'Hands-on workshop space with equipment',
  },
  {
    id: '8',
    name: 'Lecture Hall 201',
    building: 'Science Block',
    type: 'Lecture',
    capacity: 100,
    pricePerHour: 120,
    status: 'available',
    amenities: ['Projector', 'Microphone', 'WiFi', 'Recording System'],
    imageUrl:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300',
    description: 'Large lecture hall with tiered seating',
  },
];

// Booking Management Data
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    bookingNumber: '#BK-7829',
    customer: {
      id: 'c1',
      name: 'Sarah Miller',
      initials: 'SM',
      department: 'Physics Dept.',
    },
    room: {
      id: 'r1',
      name: 'Lab 305',
      building: 'Science Building',
    },
    scheduleDate: 'Oct 25, 2023',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    amount: 120.0,
    status: 'confirmed',
  },
  {
    id: '2',
    bookingNumber: '#BK-7830',
    customer: {
      id: 'c2',
      name: 'James Chen',
      avatar: 'https://picsum.photos/seed/james/200/200',
      department: 'Arts Student Org',
    },
    room: {
      id: 'r2',
      name: 'Studio 4',
      building: 'Arts Center',
    },
    scheduleDate: 'Oct 28, 2023',
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    amount: 180.0,
    status: 'pending',
  },
  {
    id: '3',
    bookingNumber: '#BK-7815',
    customer: {
      id: 'c3',
      name: 'Guest Researcher',
      initials: 'GR',
      department: 'External',
    },
    room: {
      id: 'r3',
      name: 'Room A-101',
      building: 'Science Building',
    },
    scheduleDate: 'Oct 15, 2023',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    amount: 100.0,
    status: 'completed',
  },
  {
    id: '4',
    bookingNumber: '#BK-7822',
    customer: {
      id: 'c4',
      name: 'Maria Rodriguez',
      avatar: 'https://picsum.photos/seed/maria/200/200',
      department: 'Faculty',
    },
    room: {
      id: 'r4',
      name: 'Auditorium',
      building: 'Main Hall',
    },
    scheduleDate: 'Oct 22, 2023',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    amount: 600.0,
    status: 'cancelled',
  },
  {
    id: '5',
    bookingNumber: '#BK-7831',
    customer: {
      id: 'c5',
      name: 'Tech Conf 2023',
      initials: 'TC',
      department: 'Corporate',
    },
    room: {
      id: 'r4',
      name: 'Auditorium',
      building: 'Main Hall',
    },
    scheduleDate: 'Nov 05, 2023',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    amount: 1500.0,
    status: 'confirmed',
  },
];

export const CURRENT_MANAGER = {
  name: 'Alex Morgan',
  role: 'Facility Manager',
  avatar: 'https://picsum.photos/seed/alex/200/200',
};

import type {
  StatSummary,
  RevenueDataPoint,
  RoomPerformance,
  UsageHeatmapData,
} from '../types/types';

export const statsData: StatSummary[] = [
  {
    label: 'Total Revenue',
    value: '$124,500',
    change: 12.5,
    icon: 'payments',
    trend: 'up',
    color: 'primary',
  },
  {
    label: 'Avg. Occupancy',
    value: '78%',
    change: 1.2,
    icon: 'donut_large',
    trend: 'flat',
    color: 'accent-orange',
  },
  {
    label: 'Total Bookings',
    value: '1,402',
    change: 8.4,
    icon: 'event_available',
    trend: 'up',
    color: 'accent-teal',
  },
];

export const analyticsRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 52000 },
  { month: 'Mar', revenue: 48000, target: 55000 },
  { month: 'Apr', revenue: 61000, target: 58000 },
  { month: 'May', revenue: 68000, target: 62000 },
  { month: 'Jun', revenue: 75000, target: 65000 },
];

export const roomPerformances: RoomPerformance[] = [
  {
    id: '1',
    name: 'Auditorium',
    location: 'Main Hall',
    revenue: 12450,
    occupancy: 92,
    imageUrl: 'https://picsum.photos/seed/auditorium/100/100',
  },
  {
    id: '2',
    name: 'Room A-102',
    location: 'Science Bldg',
    revenue: 8320,
    occupancy: 85,
    imageUrl: 'https://picsum.photos/seed/rooma101/100/100',
  },
  {
    id: '3',
    name: 'Lab 315',
    location: 'Science Bldg',
    revenue: 6150,
    occupancy: 78,
    imageUrl: 'https://picsum.photos/seed/lab305/100/100',
  },
  {
    id: '4',
    name: 'Studio 4',
    location: 'Arts Center',
    revenue: 4800,
    occupancy: 65,
    imageUrl: 'https://picsum.photos/seed/studio4/100/100',
  },
];

export const usageHeatmap: UsageHeatmapData[] = [
  { time: '08-10', mon: 2, tue: 6, wed: 4, thu: 5, fri: 3, sat: 0, sun: 0 },
  { time: '10-12', mon: 8, tue: 10, wed: 10, thu: 9, fri: 6, sat: 2, sun: 0 },
  { time: '12-14', mon: 3, tue: 4, wed: 5, thu: 4, fri: 2, sat: 0, sun: 0 },
  { time: '14-16', mon: 7, tue: 9, wed: 8, thu: 7, fri: 4, sat: 1, sun: 0 },
  { time: '16-18', mon: 4, tue: 3, wed: 4, thu: 2, fri: 1, sat: 0, sun: 0 },
];
