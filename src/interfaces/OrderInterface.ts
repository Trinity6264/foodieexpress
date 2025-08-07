import { Timestamp } from "firebase/firestore";

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface Order {
    id: string; // The document ID from Firestore
    userId: string; // The ID of the user who placed the order
    vendorId: string | null; // The ID of the restaurant/vendor
    customerName: string;
    customerLocation: string; // This could be an address or area
    totalAmount: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    trackingStatus: 1 | 2 | 3 | 4 | 5; // 1: Order Placed, 2: Preparing, 3: Ready for Pickup, 4: On the Way, 5: Delivered
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    paymentReference?: string;
    orderTime: Timestamp;
    updatedAt?: Timestamp;
    items: OrderItem[];
}