export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'beans' | 'equipment' | 'accessories';
  weight?: string;
  origin?: string;
  roastLevel?: 'light' | 'medium' | 'dark';
  details?: {
    flavor?: string[];
    process?: string;
    altitude?: string;
    brewingTips?: string[];
    storageInstructions?: string;
  };
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}