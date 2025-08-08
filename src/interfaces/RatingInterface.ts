import { Timestamp } from "firebase/firestore";

export interface Rating {
    id: string;
    orderId: string;
    userId: string;
    vendorId: string;
    restaurantName: string;
    rating: number; // 1-5 stars
    review: string;
    createdAt: Timestamp;
    orderDate: Timestamp;
    customerName: string;
}

export interface VendorRatingStats {
    vendorId: string;
    restaurantName: string;
    averageRating: number;
    totalRatings: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}
