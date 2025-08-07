// Order tracking utilities

export type TrackingStatusNumber = 1 | 2 | 3 | 4 | 5;

export interface TrackingStep {
    id: TrackingStatusNumber;
    label: string;
    description: string;
}

// Tracking status mapping
export const TRACKING_STATUSES: Record<TrackingStatusNumber, TrackingStep> = {
    1: {
        id: 1,
        label: "Order Placed",
        description: "Your order has been received and confirmed"
    },
    2: {
        id: 2,
        label: "Preparing",
        description: "Restaurant is preparing your food"
    },
    3: {
        id: 3,
        label: "Ready for Pickup",
        description: "Your order is ready and waiting for delivery pickup"
    },
    4: {
        id: 4,
        label: "On the Way",
        description: "Your order is being delivered to you"
    },
    5: {
        id: 5,
        label: "Delivered",
        description: "Your order has been delivered successfully"
    }
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
