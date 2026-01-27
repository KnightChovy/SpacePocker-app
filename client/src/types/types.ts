export type SpaceType =
  | 'Meeting Room'
  | 'Conference Hall'
  | 'Private Office'
  | 'Co-working Space'
  | 'Event Space';

export type Amenity =
  | 'WiFi'
  | 'Projector'
  | 'Whiteboard'
  | 'Coffee Machine'
  | 'Air Conditioning'
  | 'Parking'
  | 'Kitchen Access'
  | 'Reception Service';

export type Badge = 'Verified' | 'New';

export interface Space {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  capacity: number;
  imageUrl: string;
  badge?: Badge;
  isInstantBook?: boolean;
  type?: SpaceType;
  amenities?: Amenity[];
  location?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export interface FilterState {
  priceRange: [number, number];
  spaceTypes: SpaceType[];
  amenities: Amenity[];
  minRating: number | null;
  searchQuery: string;
}
