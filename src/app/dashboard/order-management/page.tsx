'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChefHat, Package, Clock, MapPin,  User, CheckCircle, Truck, XCircle, UtensilsCrossed, AlertTriangle, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startRestaurantOrdersListener, updateOrderTrackingStatus, cancelOrder, selectRestaurantOrders, selectRestaurantOrdersStatus, selectOrdersError } from '@/store/features/orderSlice';
import { Order } from '@/interfaces/OrderInterface';

const OrderManagementPage = () => {
    const dispatch = useAppDispatch();
    const { restaurantInfo } = useAppSelector((state) => state.auth);
    const orders = useAppSelector(selectRestaurantOrders);
    const status = useAppSelector(selectRestaurantOrdersStatus);
    const error = useAppSelector(selectOrdersError);
    
    const [statusFilter, setStatusFilter] = useState<Order['trackingStatus'] | 'all'>('all');
    const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set());
    const [retryLoading, setRetryLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const setupListener = async () => {
            if (restaurantInfo && status === 'idle') {
                console.log('Starting restaurant orders listener for:', restaurantInfo.id);
                try {
                    const result = await dispatch(startRestaurantOrdersListener(restaurantInfo.id)).unwrap();
                    if (result && result.unsubscribe) {
                        unsubscribeRef.current = result.unsubscribe;
                    }
                } catch (error) {
                    console.error('Failed to start listener:', error);
                }
            }
        };

        setupListener();
        
        // Cleanup listener when component unmounts or dependencies change
        return () => {
            if (unsubscribeRef.current) {
                console.log('Cleaning up restaurant orders listener');
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [restaurantInfo, status, dispatch]);

    // Filter orders based on selected tracking status
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.trackingStatus === statusFilter);

    // Calculate statistics
    const stats = {
        total: orders.length,
        cancelled: orders.filter(o => o.trackingStatus === 0).length,
        placed: orders.filter(o => o.trackingStatus === 1).length,
        preparing: orders.filter(o => o.trackingStatus === 2).length,
        ready: orders.filter(o => o.trackingStatus === 3).length,
        on_the_way: orders.filter(o => o.trackingStatus === 4).length,
        delivered: orders.filter(o => o.trackingStatus === 5).length,
    };

    const getStatusColor = (trackingStatus: Order['trackingStatus']) => {
        const colors = {
            0: 'bg-red-100 text-red-800 border-l-4 border-red-500',
            1: 'bg-gray-100 text-gray-800 border-l-4 border-gray-500',
            2: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500',
            3: 'bg-purple-100 text-purple-800 border-l-4 border-purple-500',
            4: 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-500',
            5: 'bg-green-100 text-green-800 border-l-4 border-green-500'
        };
        return colors[trackingStatus] || 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    };

    const getStatusIcon = (trackingStatus: Order['trackingStatus']) => {
        const icons = {
            0: <XCircle className="w-4 h-4" />,
            1: <Clock className="w-4 h-4" />,
            2: <ChefHat className="w-4 h-4" />,
            3: <Package className="w-4 h-4" />,
            4: <Truck className="w-4 h-4" />,
            5: <CheckCircle className="w-4 h-4" />
        };
        return icons[trackingStatus] || <Clock className="w-4 h-4" />;
    };

    const getStatusDisplayName = (trackingStatus: Order['trackingStatus']) => {
        const names = {
            0: 'Cancelled',
            1: 'Order Placed',
            2: 'Preparing',
            3: 'Ready for Pickup',
            4: 'Out for Delivery',
            5: 'Delivered'
        };
        return names[trackingStatus] || 'Unknown';
    };

    const handleFilterChange = async (newFilter: Order['trackingStatus'] | 'all') => {
        setFilterLoading(true);
        // Add a small delay to show the loading animation
        setTimeout(() => {
            setStatusFilter(newFilter);
            setFilterLoading(false);
        }, 300);
    };

    const handleRetry = async () => {
        if (!restaurantInfo) return;
        setRetryLoading(true);
        try {
            console.log('Retrying restaurant orders listener for:', restaurantInfo.id);
            const result = await dispatch(startRestaurantOrdersListener(restaurantInfo.id)).unwrap();
            if (result && result.unsubscribe) {
                unsubscribeRef.current = result.unsubscribe;
            }
        } catch (error) {
            console.error('Failed to start orders listener:', error);
        } finally {
            setRetryLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newTrackingStatus: Order['trackingStatus']) => {
        setLoadingOrders(prev => new Set(prev).add(orderId));
        try {
            await dispatch(updateOrderTrackingStatus({ orderId, trackingStatus: newTrackingStatus })).unwrap();
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setLoadingOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const handleCancelOrder = (orderId: string) => {
        setOrderToCancel(orderId);
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        const finalReason = cancellationReason === 'Other' ? customReason.trim() : cancellationReason;
        
        if (!orderToCancel || !finalReason) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        setCancelLoading(true);
        try {
            await dispatch(cancelOrder({ 
                orderId: orderToCancel, 
                reason: finalReason,
                cancelledBy: 'vendor'
            })).unwrap();
            
            // Close modal and reset state
            setCancelModalOpen(false);
            setOrderToCancel(null);
            setCancellationReason('');
            setCustomReason('');
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCloseCancelModal = () => {
        setCancelModalOpen(false);
        setOrderToCancel(null);
        setCancellationReason('');
        setCustomReason('');
    };

    const formatTime = (timestamp: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const LoadingButton = ({ 
        onClick, 
        loading, 
        className, 
        children, 
        icon,
        ...props 
    }: {
        onClick: () => void;
        loading: boolean;
        className: string;
        children: React.ReactNode;
        icon?: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button
            onClick={onClick}
            disabled={loading}
            className={`${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''} transition-all duration-200`}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );

    const CancellationModal = () => {
        if (!cancelModalOpen) return null;

        const predefinedReasons = [
            'Customer requested cancellation',
            'Out of stock ingredients',
            'Kitchen equipment failure',
            'Unable to fulfill order in time',
            'Delivery address issue',
            'Payment issue',
            'Other'
        ];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                            Please select or provide a reason for cancelling this order:
                        </p>

                        <div className="space-y-3 mb-4">
                            {predefinedReasons.map((reason, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="cancellationReason"
                                        value={reason}
                                        checked={cancellationReason === reason}
                                        onChange={(e) => setCancellationReason(e.target.value)}
                                        className="mr-3 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">{reason}</span>
                                </label>
                            ))}
                        </div>

                        {cancellationReason === 'Other' && (
                            <textarea
                                placeholder="Please specify the reason..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                rows={3}
                            />
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCloseCancelModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                                Keep Order
                            </button>
                            <LoadingButton
                                onClick={handleConfirmCancel}
                                loading={cancelLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                            >
                                Cancel Order
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStatusFilter = () => {
        const filterOptions: { value: Order['trackingStatus'] | 'all', label: string, count: number }[] = [
            { value: 'all', label: 'All Orders', count: stats.total },
            { value: 0, label: 'Cancelled', count: stats.cancelled },
            { value: 1, label: 'Order Placed', count: stats.placed },
            { value: 2, label: 'Preparing', count: stats.preparing },
            { value: 3, label: 'Ready', count: stats.ready },
            { value: 4, label: 'Out for Delivery', count: stats.on_the_way },
            { value: 5, label: 'Delivered', count: stats.delivered },
        ];

        return (
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex items-center mb-4">
                    <Filter className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Filter Orders</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <LoadingButton
                            key={option.value}
                            onClick={() => handleFilterChange(option.value)}
                            loading={filterLoading && statusFilter !== option.value}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                statusFilter === option.value
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {option.label} ({option.count})
                        </LoadingButton>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            );
        }

        if (status === 'failed') {
            return (
                <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium">Error Fetching Orders</h3>
                    <p className="mt-2">{error}</p>
                    <LoadingButton
                        onClick={handleRetry}
                        loading={retryLoading}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
                    >
                        Retry
                    </LoadingButton>
                </div>
            );
        }

        if (status === 'succeeded' && filteredOrders.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                        {statusFilter === 'all' ? 'No Orders' : `No ${getStatusDisplayName(statusFilter as Order['trackingStatus'])} Orders`}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        {statusFilter === 'all' 
                            ? 'You currently have no orders to manage.' 
                            : `No orders with status "${getStatusDisplayName(statusFilter as Order['trackingStatus'])}" found.`
                        }
                    </p>
                    {statusFilter !== 'all' && (
                        <LoadingButton
                            onClick={() => handleFilterChange('all')}
                            loading={filterLoading}
                            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
                        >
                            Show All Orders
                        </LoadingButton>
                    )}
                </div>
            );
        }

        return filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Order #{order.orderNumber}
                        </h3>
                        <div className="mt-2 space-y-1">
                            <p className="text-gray-600 text-sm flex items-center">
                                <User className="w-4 h-4 mr-2" /> 
                                Customer ID: {order.userId.substring(0, 8)}...
                            </p>
                            <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="w-4 h-4 mr-2" /> 
                                {order.delivery.address}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center">
                                <Clock className="w-4 h-4 mr-2" /> 
                                Ordered at {formatTime(order.placedAt)}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center ${getStatusColor(order.trackingStatus)}`}>
                        {getStatusIcon(order.trackingStatus)}
                        <span className="ml-2">{getStatusDisplayName(order.trackingStatus)}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Items Ordered:</h4>
                    <ul className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                            <li key={index} className="flex items-center justify-between text-sm text-gray-700">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <span>{item.name} x {item.quantity}</span>
                                </div>
                                <span className="font-medium">₵{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>₵{(order.total - order.delivery.fee - order.taxes.serviceFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery Fee:</span>
                            <span>₵{order.delivery.fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Service Fee:</span>
                            <span>₵{order.taxes.serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-2">
                            <div className="flex items-center"> 
                                ₵Total:
                            </div>
                            <span>₵{order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {order.delivery.instructions && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Delivery Instructions:</strong> {order.delivery.instructions}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    {order.trackingStatus === 1 && (
                        <LoadingButton
                            onClick={() => handleUpdateStatus(order.id, 2)}
                            loading={loadingOrders.has(order.id)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer"
                            icon={<ChefHat className="w-4 h-4" />}
                        >
                            Start Preparing
                        </LoadingButton>
                    )}
                    
                    {order.trackingStatus === 2 && (
                        <LoadingButton
                            onClick={() => handleUpdateStatus(order.id, 3)}
                            loading={loadingOrders.has(order.id)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium cursor-pointer"
                            icon={<Package className="w-4 h-4" />}
                        >
                            Mark as Ready
                        </LoadingButton>
                    )}
                    
                    {order.trackingStatus === 3 && (
                        <LoadingButton
                            onClick={() => handleUpdateStatus(order.id, 4)}
                            loading={loadingOrders.has(order.id)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium cursor-pointer"
                            icon={<Truck className="w-4 h-4" />}
                        >
                            Out for Delivery
                        </LoadingButton>
                    )}
                    
                    {order.trackingStatus === 4 && (
                        <LoadingButton
                            onClick={() => handleUpdateStatus(order.id, 5)}
                            loading={loadingOrders.has(order.id)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium cursor-pointer"
                            icon={<CheckCircle className="w-4 h-4" />}
                        >
                            Mark as Delivered
                        </LoadingButton>
                    )}
                    
                    {order.trackingStatus < 5 && order.trackingStatus > 0 && (
                        <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium cursor-pointer"
                        >
                            <XCircle className="w-4 h-4 mr-2" /> 
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        ));
    };

    if (!restaurantInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Access Required</h2>
                    <p className="text-gray-600 mb-4">You need to set up your restaurant first.</p>
                    <Link 
                        href="/restaurant-setup" 
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        Set Up Restaurant
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center">
                        <ChefHat className="w-6 h-6 text-orange-600 mr-2" />
                        Order Management
                    </h1>
                    <Link 
                        href="/dashboard/restaurant-info" 
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
                    <div className="text-sm text-gray-600">
                        {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </div>
                </div>
                
                {renderStatusFilter()}
                
                <div className="space-y-6">
                    {renderContent()}
                </div>
            </div>
            
            {/* Cancellation Modal */}
            <CancellationModal />
        </div>
    );
};

export default OrderManagementPage;