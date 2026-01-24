import type { Space, Feature } from '../types/types';

export const SPACES: Space[] = [
  {
    id: '1',
    name: 'The Nebula Studio',
    description:
      'A sun-drenched creative studio perfect for photography and small workshops.',
    price: 50,
    rating: 4.9,
    capacity: 12,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhMv8qNFwG35b9XGVy9xWT2EGsCulDlda03EZowocuP9z_37zxsILgVRLMNKw1B8nEwgRggbCEZDwAaeGVJ_jscWx7tsHKkdTSjqZoHLnCG3U1ABeZeH1KBrxAWSPyNseqL2MpEYtxEj0RnN6vEub0MVXCSmNVk4ityVECZ1x7a5cRlUP6LNx6Ie7bur6Fc5jkL9yE5loJqEU5KcdQTLvQbiloVyWxRPu7jWfGOjUnbtDZiLjNgSVtiw5T7j0bvdo7kx1p1ksVvU1S',
    badge: 'Verified',
    isInstantBook: true,
  },
  {
    id: '2',
    name: 'Quantum Hall',
    description:
      'Spacious lecture hall equipped with state-of-the-art AV systems.',
    price: 35,
    rating: 4.8,
    capacity: 40,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3xl0GFXISNp8qVpObELYgdUbG_D3YKSJS53o0bQaQbNnsiQ0_Ri-1L-2zxPihml5kAmfdEPr3zvGyMDWR6eGoFfYw97t8BSvFCgwsL3X66HVFvTpCln8HflxfKyEBNlYZucV5hg6sKEy2wWatxxcuHlHIFsIvAiKtrGzivtWbtlQwYzt5VJFtS16jmG_67fTePYzfCorYdfanV8f2LAMBJOYBXTJmk5oMuaXk1FU0YPoY7pralodPsuULJfDUyhhv7uJiCqe1vUT',
    isInstantBook: false,
  },
  {
    id: '3',
    name: 'Stellar Pod',
    description: 'Private meeting hub for focused collaboration sessions.',
    price: 75,
    rating: 5.0,
    capacity: 6,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlPPMsf9lghdgPlt1bq56qVptcqi1bkMFjNHUyE4TPrQiOjR7JLsXdDAMhJn13nJq6P6OZqz7C0-9x5cEBJhqU-V_pmyD6SxjSOTTFZ5Ue2LFMBsqb4HbegPzXxkAn5or-4GwajEddanVttCumKFnSd9c1Sjb4Dl1hXPNX-HUf1Rp1kgj2UV3r897jjX4KH8ditSiJzuWO5OLmOY-fF5XhySVffajiAfUHOn4mDoSPHcTian4qESRqNpPKyK4XPlsPNr9mD1MKD08',
    badge: 'New',
    isInstantBook: false,
  },
  {
    id: '4',
    name: 'Flux Loft',
    description:
      'An inspiring industrial loft perfect for team offsites and events.',
    price: 120,
    rating: 4.7,
    capacity: 25,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMKoL3JzoxYgHGottuGmjhX5He53La-5wwoV57afcnjcqisKsn1pgDZ0XYgWVXALSATvUA0jmr-YPioKHJiGjfYUMQsT1QKI98qZYfbuqY7hDtWiBpvtRYlwHOqlNNFr8toj_ViOg_JZ1lyrsaVlG_0R_1Scy2naYTOgDCGbMPVyU-TEEa4pzHj3C0ThjhncFcwJqpdOCbPul6r8Z3eOR_OD6FWwrZNb_xunWf9FYfuVDueG2Dxl34oYJ10LsIATswqxtw63chOpi',
    isInstantBook: false,
  },
];

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'Instant Booking',
    description:
      'Skip the long email chains. Check availability in real-time and secure your space in seconds.',
    icon: 'zap',
  },
  {
    id: 'f2',
    title: 'Verified Owners',
    description:
      'Every host is vetted by our team to ensure safety, quality, and accurate listing descriptions.',
    icon: 'shield_check',
  },
  {
    id: 'f3',
    title: 'Flexible Terms',
    description:
      'Book by the hour, day, or week. No long-term leases, just the time you need to create.',
    icon: 'snowflake',
  },
];

export const PARTNERS = [
  'ACME Corp',
  'Globex',
  'Soylent',
  'Initech',
  'Umbrella',
];
