import { Timestamp } from "firebase/firestore";

export interface Transaction {
    id: string;
    orderId: string;
    userId: string;
    vendorId: string;
    type: 'payment' | 'refund' | 'payout';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: string;
    paymentReference?: string;
    description: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    processingFee?: number;
    platformCommission?: number;
    vendorEarnings?: number; // Amount vendor receives after fees
}

export interface VendorEarnings {
    vendorId: string;
    totalEarnings: number;
    totalOrders: number;
    pendingEarnings: number;
    availableBalance: number;
    totalWithdrawn: number;
    averageOrderValue: number;
    lastUpdated: Timestamp;
    monthlyEarnings: {
        [key: string]: number; // Format: "YYYY-MM"
    };
}

export interface UserSpending {
    userId: string;
    totalSpent: number;
    totalOrders: number;
    averageOrderValue: number;
    favoriteVendor?: string;
    lastOrderDate?: Timestamp;
    lastUpdated: Timestamp;
    monthlySpending: {
        [key: string]: number; // Format: "YYYY-MM"
    };
}

export interface PayoutRequest {
    id: string;
    vendorId: string;
    amount: number;
    requestedAt: Timestamp;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    processedAt?: Timestamp;
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        routingNumber?: string;
    };
    notes?: string;
}
