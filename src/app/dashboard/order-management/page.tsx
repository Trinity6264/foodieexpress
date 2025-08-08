'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Package, Clock, MapPin, DollarSign, User, CheckCircle, Truck, XCircle, UtensilsCrossed, AlertTriangle, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRestaurantOrders, updateRestaurantOrderStatus, selectRestaurantOrders, selectRestaurantOrdersStatus, selectOrdersError } from '@/store/features/orderSlice';
import { Order } from '@/interfaces/OrderInterface';

const OrderManagementPage = () => {
    const dispatch = useAppDispatch();
    const { restaurantInfo } = useAppSelector((state) => state.auth);
    const orders = useAppSelector(selectRestaurantOrders);
    const status = useAppSelector(selectRestaurantOrdersStatus);
    const error = useAppSelector(selectOrdersError);
    
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

    useEffect(() => {
        if (restaurantInfo && status === 'idle') {
            dispatch(fetchRestaurantOrders(restaurantInfo.id));
        }
    }, [restaurantInfo, status, dispatch]);

    // Filter orders based on selected status
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    // Calculate statistics
    const stats = {
        total: orders.length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        on_the_way: orders.filter(o => o.status === 'on_the_way').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    const getStatusColor = (orderStatus: Order['status']) => {
        const colors = {
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-purple-100 text-purple-800',
            on_the_way: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[orderStatus] || 'bg-gray-100 text-gray-800';
    };

    const getStatusDisplayName = (orderStatus: Order['status']) => {
        const names = {
            preparing: 'Preparing',
            ready: 'Ready for Pickup',
            on_the_way: 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return names[orderStatus] || orderStatus;
    };

    const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
        if (!restaurantInfo) return;
        dispatch(updateRestaurantOrderStatus({ restaurantId: restaurantInfo.id, orderId, status: newStatus }));
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

    const renderStatusFilter = () => {
        const filterOptions: { value: Order['status'] | 'all', label: string, count: number }[] = [
            { value: 'all', label: 'All Orders', count: stats.total },
            { value: 'preparing', label: 'Preparing', count: stats.preparing },
            { value: 'ready', label: 'Ready', count: stats.ready },
            { value: 'on_the_way', label: 'Out for Delivery', count: stats.on_the_way },
            { value: 'delivered', label: 'Delivered', count: stats.delivered },
            { value: 'cancelled', label: 'Cancelled', count: stats.cancelled },
        ];

        return (
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex items-center mb-4">
                    <Filter className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Filter Orders</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                statusFilter === option.value
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {option.label} ({option.count})
                        </button>
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
                    <button 
                        onClick={() => restaurantInfo && dispatch(fetchRestaurantOrders(restaurantInfo.id))}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (status === 'succeeded' && filteredOrders.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                        {statusFilter === 'all' ? 'No Orders' : `No ${getStatusDisplayName(statusFilter as Order['status'])} Orders`}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        {statusFilter === 'all' 
                            ? 'You currently have no orders to manage.' 
                            : `No orders with status "${getStatusDisplayName(statusFilter as Order['status'])}" found.`
                        }
                    </p>
                    {statusFilter !== 'all' && (
                        <button
                            onClick={() => setStatusFilter('all')}
                            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            Show All Orders
                        </button>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusDisplayName(order.status)}
                    </span>
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
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>${(order.total - order.delivery.fee - order.taxes.serviceFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery Fee:</span>
                            <span>${order.delivery.fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Service Fee:</span>
                            <span>${order.taxes.serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-2">
                            <div className="flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" /> 
                                Total:
                            </div>
                            <span>${order.total.toFixed(2)}</span>
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
                    {order.status === 'preparing' && (
                        <button 
                            onClick={() => handleUpdateStatus(order.id, 'ready')} 
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                        >
                            <Package className="w-4 h-4 mr-2" /> 
                            Mark as Ready
                        </button>
                    )}
                    
                    {order.status === 'ready' && (
                        <button 
                            onClick={() => handleUpdateStatus(order.id, 'on_the_way')} 
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                        >
                            <Truck className="w-4 h-4 mr-2" /> 
                            Out for Delivery
                        </button>
                    )}
                    
                    {order.status === 'on_the_way' && (
                        <button 
                            onClick={() => handleUpdateStatus(order.id, 'delivered')} 
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> 
                            Mark as Delivered
                        </button>
                    )}
                    
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button 
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')} 
                            className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
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
        </div>
    );
};

export default OrderManagementPage;