import { Timestamp } from "firebase/firestore";

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface RestaurantInfo {
    name: string;
    rating: number;
    phone: string;
    address: string;
}

export interface DeliveryInfo {
    address: string;
    instructions?: string;
    fee: number;
}

export interface DriverInfo {
    name?: string;
    phone?: string;
    rating?: number;
    vehicle?: string;
}

export interface TaxBreakdown {
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    nhilRate: number;
    nhilAmount: number;
    getfundRate: number;
    getfundAmount: number;
    totalTaxes: number;
    serviceFee: number;
}

export interface Order {
    id: string; // The document ID from Firestore
    orderNumber: string; // Unique order number for display
    userId: string; // The ID of the user who placed the order
    vendorId: string | null; // The ID of the restaurant/vendor
    status: 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
    trackingStatus: 1 | 2 | 3 | 4 | 5; // 1: Order Placed, 2: Preparing, 3: Ready for Pickup, 4: On the Way, 5: Delivered
    placedAt: Timestamp;
    estimatedDelivery?: Timestamp;
    restaurant: RestaurantInfo;
    delivery: DeliveryInfo;
    driver?: DriverInfo;
    items: OrderItem[];
    taxes: TaxBreakdown;
    total: number;
    paymentMethod: string;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    paymentReference?: string;
    updatedAt?: Timestamp;
    isRated?: boolean; // Whether the order has been rated by the customer
    ratedAt?: Timestamp; // When the order was rated
}