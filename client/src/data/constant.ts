import { type Space, type Feature, type SpaceType, type Amenity, type BookingUser, type SpaceUser, type UserStats, BookingStatus } from '../types/types';

// TODO: XÓA DATA TĨNH NÀY KHI ĐÃ CÓ API - Backend sẽ trả về data tương tự
export const SPACES: Space[] = [
  {
    id: '1',
    name: 'The Nebula Studio',
    title: 'Modern Tech Classroom - Downtown Hub',
    description:
      'A sun-drenched creative studio perfect for photography and small workshops.',
    price: 50,
    rating: 4.9,
    capacity: 12,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhMv8qNFwG35b9XGVy9xWT2EGsCulDlda03EZowocuP9z_37zxsILgVRLMNKw1B8nEwgRggbCEZDwAaeGVJ_jscWx7tsHKkdTSjqZoHLnCG3U1ABeZeH1KBrxAWSPyNseqL2MpEYtxEj0RnN6vEub0MVXCSmNVk4ityVECZ1x7a5cRlUP6LNx6Ie7bur6Fc5jkL9yE5loJqEU5KcdQTLvQbiloVyWxRPu7jWfGOjUnbtDZiLjNgSVtiw5T7j0bvdo7kx1p1ksVvU1S',
    badge: 'Verified',
    isInstantBook: true,
    type: 'Co-working Space',
    location:
      '18 Nguyễn Văn Tăng, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh',
    locationDescription:
      'Tọa lạc tại khu vực Thủ Đức phát triển, gần các trung tâm công nghệ và giao thông công cộng thuận tiện.',
    coordinates: {
      lat: 10.84966,
      lng: 106.814059,
    },
    amenities: ['WiFi', 'Projector', 'Whiteboard', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    ],
    host: {
      name: 'Sarah Jenkins',
      joinedDate: '2021',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    reviews: [
      {
        id: '1',
        author: 'Marcus T.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        date: 'Oct 2023',
        content:
          'Excellent space. The lighting was perfect for our video shoot and the host was super accommodating.',
        rating: 2,
      },
      {
        id: '2',
        author: 'Elena R.',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        date: 'Sep 2023',
        content:
          'Great location and facilities. The coffee machine was a life saver for our all-day workshop!',
        rating: 5,
      },
      {
        id: '3',
        author: 'David K.',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        date: 'Aug 2023',
        content:
          'Professional setup with great amenities. Perfect for our team meeting.',
        rating: 5,
      },
      {
        id: '4',
        author: 'Lisa M.',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        date: 'Jul 2023',
        content:
          'The space exceeded our expectations. Highly recommended for corporate events.',
        rating: 5,
      },
      {
        id: '5',
        author: 'James P.',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        date: 'Jun 2023',
        content:
          'Outstanding venue with top-notch equipment. Our presentation went flawlessly.',
        rating: 5,
      },
    ],
  },
  {
    id: '2',
    name: 'Quantum Hall',
    title: 'Quantum Hall - Professional Conference Center',
    description:
      'Spacious lecture hall equipped with state-of-the-art AV systems.',
    price: 35,
    rating: 4.5,
    capacity: 40,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3xl0GFXISNp8qVpObELYgdUbG_D3YKSJS53o0bQaQbNnsiQ0_Ri-1L-2zxPihml5kAmfdEPr3zvGyMDWR6eGoFfYw97t8BSvFCgwsL3X66HVFvTpCln8HflxfKyEBNlYZucV5hg6sKEy2wWatxxcuHlHIFsIvAiKtrGzivtWbtlQwYzt5VJFtS16jmG_67fTePYzfCorYdfanV8f2LAMBJOYBXTJmk5oMuaXk1FU0YPoY7pralodPsuULJfDUyhhv7uJiCqe1vUT',
    isInstantBook: false,
    type: 'Conference Hall',
    location: 'University District, Boston',
    locationDescription:
      "Located in the heart of Boston's university district, easily accessible by public transit and close to major academic institutions.",
    coordinates: {
      lat: 42.3601,
      lng: -71.0589,
    },
    amenities: ['WiFi', 'Projector', 'Air Conditioning', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
    ],
    host: {
      name: 'Dr. Michael Chen',
      joinedDate: '2020',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    reviews: [
      {
        id: '1',
        author: 'Rebecca S.',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        date: 'Dec 2023',
        content:
          'Perfect venue for our academic conference. The AV system was flawless and the acoustics were excellent.',
        rating: 5,
      },
      {
        id: '2',
        author: 'Tom W.',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        date: 'Nov 2023',
        content:
          'Great space for presentations. Well-maintained and professional setup.',
        rating: 4,
      },
      {
        id: '3',
        author: 'Linda K.',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        date: 'Oct 2023',
        content:
          'Spacious hall with excellent facilities. The parking was convenient.',
        rating: 5,
      },
    ],
  },
  {
    id: '3',
    name: 'Stellar Pod',
    title: 'Stellar Pod - Premium Meeting Room',
    description: 'Private meeting hub for focused collaboration sessions.',
    price: 75,
    rating: 5.0,
    capacity: 6,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlPPMsf9lghdgPlt1bq56qVptcqi1bkMFjNHUyE4TPrQiOjR7JLsXdDAMhJn13nJq6P6OZqz7C0-9x5cEBJhqU-V_pmyD6SxjSOTTFZ5Ue2LFMBsqb4HbegPzXxkAn5or-4GwajEddanVttCumKFnSd9c1Sjb4Dl1hXPNX-HUf1Rp1kgj2UV3r897jjX4KH8ditSiJzuWO5OLmOY-fF5XhySVffajiAfUHOn4mDoSPHcTian4qESRqNpPKyK4XPlsPNr9mD1MKD08',
    badge: 'New',
    isInstantBook: true,
    type: 'Meeting Room',
    location: 'Tech Hub, Austin',
    locationDescription:
      "Situated in Austin's thriving tech hub, perfect for startup meetings and brainstorming sessions. Walking distance from major tech companies.",
    coordinates: {
      lat: 30.2672,
      lng: -97.7431,
    },
    amenities: [
      'WiFi',
      'Whiteboard',
      'Coffee Machine',
      'Air Conditioning',
      'Reception Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    ],
    host: {
      name: 'Emma Rodriguez',
      joinedDate: '2023',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    },
    reviews: [
      {
        id: '1',
        author: 'Alex M.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        date: 'Jan 2024',
        content:
          'Excellent private space for team meetings. The coffee machine is a nice touch!',
        rating: 5,
      },
      {
        id: '2',
        author: 'Sophia L.',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        date: 'Dec 2023',
        content:
          'Perfect for focused work sessions. Quiet and professional environment.',
        rating: 5,
      },
      {
        id: '3',
        author: 'John D.',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        date: 'Nov 2023',
        content: 'Great amenities and the reception service was very helpful.',
        rating: 5,
      },
    ],
  },
  {
    id: '4',
    name: 'Flux Loft',
    title: 'Flux Loft - Industrial Event Space',
    description:
      'An inspiring industrial loft perfect for team offsites and events.',
    price: 120,
    rating: 4.7,
    capacity: 25,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMKoL3JzoxYgHGottuGmjhX5He53La-5wwoV57afcnjcqisKsn1pgDZ0XYgWVXALSATvUA0jmr-YPioKHJiGjfYUMQsT1QKI98qZYfbuqY7hDtWiBpvtRYlwHOqlNNFr8toj_ViOg_JZ1lyrsaVlG_0R_1Scy2naYTOgDCGbMPVyU-TEEa4pzHj3C0ThjhncFcwJqpdOCbPul6r8Z3eOR_OD6FWwrZNb_xunWf9FYfuVDueG2Dxl34oYJ10LsIATswqxtw63chOpi',
    isInstantBook: false,
    type: 'Event Space',
    location: 'Brooklyn, New York',
    locationDescription:
      'A stunning industrial loft in Brooklyn with exposed brick walls and high ceilings. Perfect for corporate events, product launches, and creative gatherings.',
    coordinates: {
      lat: 40.6782,
      lng: -73.9442,
    },
    amenities: ['WiFi', 'Kitchen Access', 'Parking', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    ],
    host: {
      name: 'James Anderson',
      joinedDate: '2019',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    reviews: [
      {
        id: '1',
        author: 'Nicole P.',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        date: 'Jan 2024',
        content:
          'Amazing space for our product launch! The industrial aesthetic was perfect for our brand.',
        rating: 5,
      },
      {
        id: '2',
        author: 'Chris T.',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        date: 'Dec 2023',
        content:
          'Great venue with excellent kitchen facilities. Perfect for catering our event.',
        rating: 5,
      },
      {
        id: '3',
        author: 'Maya R.',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        date: 'Nov 2023',
        content:
          'Stunning loft space. The natural light is incredible. Highly recommend!',
        rating: 5,
      },
      {
        id: '4',
        author: 'Robert K.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        date: 'Oct 2023',
        content: 'Good space but parking can be tricky during peak hours.',
        rating: 4,
      },
    ],
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

// ============================================================
// SIDEBAR CONSTANTS - Filter options
// ============================================================

export const SPACE_TYPES: { label: SpaceType }[] = [
  { label: 'Meeting Room' },
  { label: 'Conference Hall' },
  { label: 'Private Office' },
  { label: 'Co-working Space' },
  { label: 'Event Space' },
];

export const AMENITIES: Amenity[] = [
  'WiFi',
  'Projector',
  'Whiteboard',
  'Coffee Machine',
  'Air Conditioning',
  'Parking',
  'Kitchen Access',
  'Reception Service',
];

// ============================================================
// SPACE DETAILS - Chi tiết amenities cho detail view
// ============================================================

export const SPACE_DETAILS_MAP: Record<
  string,
  {
    amenitiesDetail: { icon: string; label: string }[];
  }
> = {
  '1': {
    amenitiesDetail: [
      { icon: 'wifi', label: 'Fast wifi (500 Mbps)' },
      { icon: 'tv', label: '75" 4K TV' },
      { icon: 'videoCam', label: 'HD Projector' },
      { icon: 'ac_unit', label: 'Air Conditioning' },
      { icon: 'whiteboard', label: 'Whiteboard' },
    ],
  },
  '2': {
    amenitiesDetail: [
      { icon: 'wifi', label: 'High-speed WiFi' },
      { icon: 'videoCam', label: 'Professional Projector' },
      { icon: 'ac_unit', label: 'Climate Control' },
      { icon: 'directions_car', label: 'Free Parking' },
    ],
  },
  '3': {
    amenitiesDetail: [
      { icon: 'wifi', label: 'Gigabit WiFi' },
      { icon: 'whiteboard', label: 'Smart Whiteboard' },
      { icon: 'local_cafe', label: 'Espresso Machine' },
      { icon: 'ac_unit', label: 'Air Conditioning' },
      { icon: 'support_agent', label: 'Reception Service' },
    ],
  },
  '4': {
    amenitiesDetail: [
      { icon: 'wifi', label: 'Fast WiFi (1 Gbps)' },
      { icon: 'restaurant', label: 'Full Kitchen Access' },
      { icon: 'directions_car', label: 'Parking Available' },
      { icon: 'ac_unit', label: 'Central Air Conditioning' },
    ],
  },
};

export const USER_INFO = {
  name: "Alex Mitchell",
  shortName: "Alex M.",
  role: "Senior Designer",
  plan: "Pro Plan",
  email: "alex.m@example.com",
  phone: "+1 (555) 000-1234",
  profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7RBGmICJjpaetMn8SU0OUOrfBRhADQ2muJ_0A-WlTF6__1ZOh-onRgoS7Bob8czqWBy-nMJN2hpinYpEe2QeSdzcWlyHEJXTcEOGPlog46T1HMMjeyk19Cq9xvNPQWLRdpvnht0RLoAk_23_t2KQsMPtc5Nbg1XW4_Oq7bcRHAd_nbKeS-kwVZh3KA2fQCBgRiH8uOGlSwHIiKF8-HecShihzpWpcrwWJunygAM6E_Mw7Z5vmizrfyi0z9din6K0h_lOKsNys2ik"
};

export const USER_STATS: UserStats = {
  totalBookings: 12,
  hoursSpent: "48h",
  credits: 120.00
};

export const SPACESUSER: SpaceUser[] = [
  {
    id: "S-001",
    name: "Creative Studio A",
    location: "Downtown Hub, Floor 3",
    rating: 4.9,
    pricePerHour: 45,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKZY3FHhDC8vs2RXJGt_--Anw_Ams-vV4Kd26MJKKi9E-4mNx1D_RD1Y9hVTwiwtHOjTC36QjYv2jaTLDdDAvBXh_TdDayKMtqd5NmWFErDNZtYtA0NHYQ6QrYZm-4SjHnUvZJ7JlyyFHn3ULHJTDXatbOijjvrhChPccAsHtzLeG4C_pAWFeNQyl-auAkkuImiDw_M5uElOOpVwCbM_o7y0TLpVywnLQRkAdzlwdkX0Ih4qMYRwR5IRKwH6uz9OkKOk8LAQ0oBSU_",
    amenities: ["WIFI", "PROJECTOR"],
    capacity: "10 people"
  },
  {
    id: "S-002",
    name: "Podcast Room 02",
    location: "Westside Studio, B1",
    rating: 4.7,
    pricePerHour: 35,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC66z9AEFpf_-qIvuF52yYmdzGlP85vdOZT41iEynugoVhty_ibBh1LKRnZRug4UyBuhnAVs1vD4EKb0KYStEPZAO4DQhWpjyYYDgxBESYW63RLMfFmQpB1VVM8DB_nCJ6Rd9HYUQre2K4H7xSmuc-nhRYIcTcr1MNZcwJ_6WtX3b9_JzLpIYyobO7I-za1l87uc08FAA89aPNc9mcTomga16snggaqQQ6TA5NIVbIJprovrDAmDDnpfXQ_nr2-kzODBqujJrUirIfr",
    amenities: ["SOUNDPROOF", "MIC"],
    capacity: "4 people"
  },
  {
    id: "S-003",
    name: "Conference Hall B",
    location: "City Center, Floor 12",
    rating: 5.0,
    pricePerHour: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDboo55yMNQRs4MtqadEDjOq--Alw2-tQGCWbwFgal9UiFx4M0RuogNy07XuX4FdtYCKwFK4FXZcKel_JJU_J9w6kTBCsvD29og-ZKN29hhLIjjTF4IRcvkPg6dV-Q7heIwcFQ1Q4NZh9VwYlHVI58OsWuWA9UBZCeMPJy1b0JO64ixUC1P-zEy3CWPlpBYmTuPcJD4h3kb_v8h4o8kVWqtk7t-GmrNHV4ION4WRiwIxInmUbuf1bXoGcKPwHw1bWVsNi5wrlfJeMNF",
    amenities: ["50+ PEOPLE", "AV SYSTEM"],
    capacity: "50+ people"
  },
  {
    id: "S-004",
    name: "Sunny Loft Studio",
    location: "Arts District, Floor 2",
    rating: 4.8,
    pricePerHour: 45,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeo9Yu6q2P4hARVqMkas1owYyeId3YFgwqT0xevAO-47uavH7rl-ySCih_OS4oD2qnn0EQRGWMeqCJUrAuNfFG8bnk2agRhxUiKdn-4jHKgvR_Q5hjk405jCED3nLE5mWz4WYPWehi9uFG6flBUt3BpHcP947S83xieEPhUTbtRX4maTZWMm2KwfGB0s7mVE4lWqdWHWKAD4DAD9Uu9TAGXwVy7dXFK9NIzJqAWHlB0sLQreNCkYIIbFBa54v7EFDDVk3C9h9Bhe7y",
    amenities: ["NATURAL LIGHT", "WIFI"],
    capacity: "12 people"
  },
  {
    id: "S-005",
    name: "The Brick Room",
    location: "SoHo District",
    rating: 4.6,
    pricePerHour: 30,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiu2dP6fH6_aphA1S4Cj4EOJB4yZOOn082O6OA2VC5m59EWRlFIHXw6m1ZI7iZhfsBp2ApirkXplLgHD89nYcWsISuYUnRzxpbaSQNLkIgVZ8sVY3qWljX7mzv2hSoTGbzsGcgwUujo7Sq2wYuarJeNeZGZJ-npWAYTMl6cVifit2BMkXvZjy8Q6d2zfd-GrS5YqMbpfGebS3UkS0CZ8rmv3oHjXhZP2RE1M7dbAKrCG-g4iyyKkeZSjt3cLsb-93KSUlHB2AFtL7o",
    amenities: ["COFFEE", "WHITEBOARD"],
    capacity: "8 people"
  }
];

export const BOOKINGSUSER: BookingUser[] = [
  {
    id: "#BK-9928",
    spaceId: "S-003",
    spaceName: "Conference Hall B",
    location: "City Center, Floor 12",
    status: BookingStatus.COMPLETED,
    date: "Oct 20, 2023",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    duration: "8h",
    price: 450.00,
    paymentMethod: "Visa •••• 4242",
    image: SPACESUSER[2].image
  },
  {
    id: "#BK-8832",
    spaceId: "S-002",
    spaceName: "Podcast Room 02",
    location: "Westside Studio, B1",
    status: BookingStatus.COMPLETED,
    date: "Oct 15, 2023",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    duration: "2h",
    price: 60.00,
    paymentMethod: "Wallet",
    image: SPACESUSER[1].image
  },
  {
    id: "#BK-7120",
    spaceId: "S-004",
    spaceName: "Sunny Loft Studio",
    location: "Arts District, Floor 2",
    status: BookingStatus.COMPLETED,
    date: "Sep 30, 2023",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    duration: "4h",
    price: 180.00,
    paymentMethod: "Visa •••• 1234",
    image: SPACESUSER[3].image
  }
];