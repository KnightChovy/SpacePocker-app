import type { Feature } from '@/types/user/types';

export type UserSpaceCard = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  amenities: string[];
  capacity: string;
  pricePerHour: number;
};

export const FEATURES: Feature[] = [
  {
    id: 'fast-booking',
    title: 'Fast Booking',
    description: 'Find and reserve spaces in minutes with a simple flow.',
    icon: 'zap',
  },
  {
    id: 'secure-payments',
    title: 'Secure Payments',
    description: 'Payment and booking status updates you can trust.',
    icon: 'shield_check',
  },
  {
    id: 'climate-ready',
    title: 'Comfort Ready',
    description: 'Spaces with practical amenities for productive sessions.',
    icon: 'snowflake',
  },
];

export const SPACESUSER: UserSpaceCard[] = [
  {
    id: 'space-1',
    name: 'Ocean View Meeting Room',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    location: 'District 1, Ho Chi Minh City, Vietnam',
    rating: 4.8,
    amenities: ['WiFi', 'Projector', 'Whiteboard'],
    capacity: 'Up to 12',
    pricePerHour: 250000,
  },
  {
    id: 'space-2',
    name: 'Creative Workshop Studio',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    location: 'District 3, Ho Chi Minh City, Vietnam',
    rating: 4.6,
    amenities: ['Aircon', 'WiFi', 'Coffee'],
    capacity: 'Up to 20',
    pricePerHour: 180000,
  },
  {
    id: 'space-3',
    name: 'Quiet Focus Room',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    location: 'Binh Thanh, Ho Chi Minh City, Vietnam',
    rating: 4.7,
    amenities: ['WiFi', 'Power', 'Parking'],
    capacity: 'Up to 6',
    pricePerHour: 120000,
  },
];
