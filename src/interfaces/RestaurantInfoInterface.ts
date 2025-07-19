// src/interfaces/RestaurantInfoInterface.ts
/**
 * Represents the operating hours for a single day.
 */
export interface OperatingHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  openTime: string; // e.g., "09:00"
  closeTime: string; // e.g., "22:00"
  isOpen: boolean;
}

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
  isOpen: boolean; // This can now represent a general "Open Now" status
  operatingHours: OperatingHours[]; // Add the new property
}