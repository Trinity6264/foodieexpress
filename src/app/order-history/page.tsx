'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Receipt, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
    fetchUserOrders, 
    clearUserOrders,
    selectUserOrders,
    selectUserOrdersLoading,
    selectOrdersError
} from '@/store/features/orderSlice';

const OrderHistoryPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    
    // Get state from Redux
    const allOrders = useAppSelector(selectUserOrders);
    const loading = useAppSelector(selectUserOrdersLoading);
    const error = useAppSelector(selectOrdersError);
    
    // Filter for completed orders (delivered or cancelled)
    const completedOrders = allOrders.filter(order => 
        order.trackingStatus === 5 || order.trackingStatus === 0
    );

    // Fetch user's orders from Redux
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Dispatch action to fetch user orders (sets up real-time listener)
        dispatch(fetchUserOrders(user.uid));

        // Cleanup function
        return () => {
            dispatch(clearUserOrders());
        };
    }, [user, dispatch, router]);

    const formatDate = (timestamp: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user) {
        return null; // Will redirect to login
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your order history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error loading order history: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                    <button 
                        onClick={() => router.back()}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">Order History</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {completedOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8">
                        <div className="text-center">
                            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Order History</h3>
                            <p className="text-gray-600 mb-8">
                                You haven&apos;t completed any orders yet.
                            </p>
                            
                            {/* Info about what appears here */}
                            <div className="text-gray-500 mb-6">
                                <p className="mb-4">Once you complete orders, you&apos;ll see:</p>
                                <ul className="space-y-2 text-left max-w-md mx-auto">
                                    <li className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                        Delivered orders with ratings
                                    </li>
                                    <li className="flex items-center">
                                        <Star className="w-4 h-4 text-red-500 mr-2" />
                                        Cancelled orders with reasons
                                    </li>
                                    <li className="flex items-center">
                                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                        Order timestamps and details
                                    </li>
                                    <li className="flex items-center">
                                        <Package className="w-4 h-4 text-purple-500 mr-2" />
                                        Easy reorder functionality
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                onClick={() => router.push('/restaurants')}
                                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Browse Restaurants
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                            {completedOrders.length} completed order{completedOrders.length !== 1 ? 's' : ''} 
                            ({completedOrders.filter(o => o.trackingStatus === 5).length} delivered, {completedOrders.filter(o => o.trackingStatus === 0).length} cancelled)
                        </div>
                        
                        {completedOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                                {/* Restaurant Info */}
                                <div className="flex items-center mb-4">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{order.restaurant.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Ordered on {formatDate(order.placedAt)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-medium text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </div>
                                        <div className={`text-sm font-medium flex items-center ${
                                            order.trackingStatus === 5 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {order.trackingStatus === 5 ? (
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                            ) : (
                                                <XCircle className="w-4 h-4 mr-1" />
                                            )}
                                            {order.trackingStatus === 5 ? 'Delivered' : 'Cancelled'}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
                                    <div className="space-y-1">
                                        {order.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-800">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="text-gray-600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="text-sm text-gray-500">
                                                +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rating Display or Cancellation Info */}
                                <div className="pt-4 border-t border-gray-100">
                                    {order.trackingStatus === 5 ? (
                                        // Delivered order - show rating info
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {order.isRated ? 'You rated this order' : 'Not rated yet'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {order.isRated && order.ratedAt ? formatDate(order.ratedAt) : ''}
                                            </span>
                                        </div>
                                    ) : (
                                        // Cancelled order - show cancellation info
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <XCircle className="w-4 h-4 text-red-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Cancelled {order.cancelledBy ? `by ${order.cancelledBy}` : ''}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {order.cancelledAt ? formatDate(order.cancelledAt) : ''}
                                            </span>
                                        </div>
                                    )}
                                    {order.cancellationReason && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Reason: {order.cancellationReason}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Reorder button - only for delivered orders */}
                                {order.trackingStatus === 5 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button 
                                            onClick={() => router.push(`/menu/${order.vendorId}`)}
                                            className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                                        >
                                            Order Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
