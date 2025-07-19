/**
 * Represents a single menu item offered by a restaurant.
 */
export interface MenuItemInterface {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly category: string;
    readonly image: string;
    readonly popular: boolean;
    readonly spicy: boolean;
}
  