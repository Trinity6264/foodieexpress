// Order tracking utilities

export type TrackingStatusNumber = 1 | 2 | 3 | 4 | 5;
export type OrderStatus = 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';

export interface TrackingStep {
    id: TrackingStatusNumber;
    label: string;
    description: string;
    status: OrderStatus;
}

// Tracking status mapping
export const TRACKING_STATUSES: Record<TrackingStatusNumber, TrackingStep> = {
    1: {
        id: 1,
        label: "Order Placed",
        description: "Your order has been received and confirmed",
        status: 'preparing'
    },
    2: {
        id: 2,
        label: "Preparing",
        description: "Restaurant is preparing your food",
        status: 'preparing'
    },
    3: {
        id: 3,
        label: "Ready for Pickup",
        description: "Your order is ready and waiting for delivery pickup",
        status: 'ready'
    },
    4: {
        id: 4,
        label: "On the Way",
        description: "Your order is being delivered to you",
        status: 'on_the_way'
    },
    5: {
        id: 5,
        label: "Delivered",
        description: "Your order has been delivered successfully",
        status: 'delivered'
    }
};

// Convert tracking status number to order status
export const getOrderStatusFromTracking = (trackingStatus: TrackingStatusNumber): OrderStatus => {
    return TRACKING_STATUSES[trackingStatus]?.status || 'preparing';
};

// Convert order status to tracking status number
export const getTrackingStatusFromOrder = (orderStatus: OrderStatus): TrackingStatusNumber => {
    const statusMap: Record<OrderStatus, TrackingStatusNumber> = {
        'preparing': 2,
        'ready': 3,
        'on_the_way': 4,
        'delivered': 5,
        'cancelled': 1 // Reset to initial if cancelled
    };
    return statusMap[orderStatus] || 1;
};

// Get tracking status label
export const getTrackingStatusLabel = (status: TrackingStatusNumber): string => {
    return TRACKING_STATUSES[status]?.label || "Unknown Status";
};

// Get tracking status description
export const getTrackingStatusDescription = (status: TrackingStatusNumber): string => {
    return TRACKING_STATUSES[status]?.description || "Status information unavailable";
};

// Check if a tracking step is completed
export const isTrackingStepCompleted = (currentStatus: TrackingStatusNumber, stepStatus: TrackingStatusNumber): boolean => {
    return currentStatus >= stepStatus;
};

// Check if a tracking step is active (current step)
export const isTrackingStepActive = (currentStatus: TrackingStatusNumber, stepStatus: TrackingStatusNumber): boolean => {
    return currentStatus === stepStatus;
};

// Get all tracking steps for display
export const getAllTrackingSteps = (): TrackingStep[] => {
    return Object.values(TRACKING_STATUSES);
};

// Get progress percentage
export const getTrackingProgress = (currentStatus: TrackingStatusNumber): number => {
    return ((currentStatus - 1) / 4) * 100; // Convert to percentage (0-100%)
};

// Format order number for display
export const formatOrderNumber = (orderNumber: string): string => {
    return orderNumber.replace(/ORD-(\d+)-(.+)/, 'Order #$2');
};

// Generate order number
export const generateOrderNumber = (): string => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};
