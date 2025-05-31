/**
 * Interface representing a restaurant entity.
 */
export interface RestaurantInfoInterface {
    readonly id: number;
    readonly name: string;
    readonly cuisine: string;
    readonly rating: number;
    readonly deliveryTime: string;
    readonly deliveryFee: string;
    readonly image: string;
    readonly specialty: string;
    readonly location: string;
    readonly featured: boolean;
    readonly minOrder: string;
  }