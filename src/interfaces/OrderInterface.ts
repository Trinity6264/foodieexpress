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
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    paymentReference?: string;
    orderTime: Timestamp;
    updatedAt?: Timestamp;
    items: OrderItem[];
}