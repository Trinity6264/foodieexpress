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
    customerName: string;
    customerLocation: string;
    totalAmount: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    orderTime: Timestamp;
    items: OrderItem[];
}