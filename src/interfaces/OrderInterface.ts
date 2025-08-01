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
    customerName: string;
    customerLocation: string; // This could be an address or area
    totalAmount: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    orderTime: Timestamp;
    items: OrderItem[];
}