export type LocationType = 
  | '哈尔滨' 
  | '亚布力' 
  | '雪乡' 
  | '延吉' 
  | '长白山' 
  | '横道河子' 
  | '二浪河' 
  | '长春';

export const LOCATIONS: LocationType[] = [
  '哈尔滨', '亚布力', '雪乡', '延吉', '长白山', '横道河子', '二浪河', '长春'
];

export interface Hotel {
  id: string;
  name: string;
  location: LocationType;
  stars: number;
  rating: number;
  tags: string[];
  description: string;
  imageUrl: string;
  bookingUrl: string;
  priceRange?: string; // e.g. "¥500 - ¥800"
}

export interface AIResponse {
  text: string;
  isLoading: boolean;
  error?: string;
}