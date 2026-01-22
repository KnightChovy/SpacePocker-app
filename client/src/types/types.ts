export interface Space {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  capacity: number;
  imageUrl: string;
  badge?: 'Verified' | 'New';
  isInstantBook?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
}
