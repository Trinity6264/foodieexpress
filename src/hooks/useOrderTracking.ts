import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
    fetchUserOrders, 
    setSelectedOrder, 
    clearUserOrders,
    updateOrderTrackingStatus,
    selectUserOrders,
    selectSelectedOrder,
    selectUserOrdersLoading,
    selectOrdersError
} from '@/store/features/orderSlice';
import { Timestamp } from 'firebase/firestore';

export const useOrderTracking = (userId?: string) => {
    const dispatch = useAppDispatch();
    
    const orders = useAppSelector(selectUserOrders);
    const selectedOrder = useAppSelector(selectSelectedOrder);
    const loading = useAppSelector(selectUserOrdersLoading);
    const error = useAppSelector(selectOrdersError);

    // Initialize order tracking
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserOrders(userId));
        }
        
        return () => {
            // Cleanup when component unmounts or userId changes
            dispatch(clearUserOrders());
        };
    }, [dispatch, userId]);

    // Actions
    const selectOrder = (orderId: string) => {
        dispatch(setSelectedOrder(orderId));
    };

    const updateStatus = (orderId: string, trackingStatus: number) => {
        dispatch(updateOrderTrackingStatus({ orderId, trackingStatus }));
    };

    const clearOrders = () => {
        dispatch(clearUserOrders());
    };

    const getOrderById = (orderId: string) => {
        return orders.find(order => order.id === orderId);
    };

    // Helper functions
    const getStatusFromTracking = (trackingStatus: number): string => {
        switch (trackingStatus) {
            case 1: return "placed";
            case 2: return "preparing";
            case 3: return "ready";
            case 4: return "on_the_way";
            case 5: return "delivered";
            default: return "placed";
        }
    };

    const getEstimatedTime = (order: typeof selectedOrder) => {
        if (!order) return "";
        
        const estimatedDelivery = order.estimatedDelivery || new Date(Date.now() + 45 * 60 * 1000);
        // Handle both Date and Timestamp objects
        const deliveryTime = estimatedDelivery instanceof Date 
            ? estimatedDelivery 
            : 'toDate' in estimatedDelivery ? (estimatedDelivery as Timestamp).toDate() : new Date();
        const diff = deliveryTime.getTime() - new Date().getTime();
        const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));

        if (order.trackingStatus === 5) {
            return "Delivered";
        }

        if (minutes <= 0) {
            return "Any moment now";
        }

        return `${minutes} min${minutes > 1 ? 's' : ''}`;
    };

    const getStatusMessage = (order: typeof selectedOrder) => {
        if (!order) return "";
        
        switch (order.trackingStatus) {
            case 2:
                return "Your delicious meal is being prepared with care";
            case 3:
                return "Your order is ready! Driver will pick it up soon";
            case 4:
                return "Your order is on its way to you";
            case 5:
                return "Order delivered! Hope you enjoyed your meal";
            default:
                return "Order confirmed and being processed";
        }
    };

    return {
        // State
        orders,
        selectedOrder,
        loading,
        error,
        
        // Actions
        selectOrder,
        updateStatus,
        clearOrders,
        getOrderById,
        
        // Helpers
        getStatusFromTracking,
        getEstimatedTime,
        getStatusMessage,
        
        // Computed values
        hasPendingOrders: orders.length > 0,
        totalOrders: orders.length,
    };
};

export default useOrderTracking;
