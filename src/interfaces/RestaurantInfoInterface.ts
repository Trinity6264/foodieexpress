// src/interfaces/RestaurantInfoInterface.ts
/**
 * Interface representing a restaurant entity.
 */
export interface RestaurantInfoInterface {
  id: string;
  userId: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  image: string;
  specialty: string;
  location: string;
  featured: boolean;
  minOrder: string;
  phone: string;
  address: string;
  description: string;
  isOpen: boolean;
}