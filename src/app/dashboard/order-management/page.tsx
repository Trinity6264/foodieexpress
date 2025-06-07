'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Package, Clock, MapPin, DollarSign, User, CheckCircle, Truck, XCircle, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders, updateOrderStatus } from '@/store/features/orderSlice';
import { Order } from '@/interfaces/OrderInterface';

const OrderManagementPage = () => {
    const dispatch = useAppDispatch();
    const { restaurantInfo } = useAppSelector((state) => state.auth);
    const { orders, status, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        if (restaurantInfo && status === 'idle') {
            dispatch(fetchOrders(restaurantInfo.id));
        }
    }, [restaurantInfo, status, dispatch]);

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Preparing: 'bg-blue-100 text-blue-800',
            Ready: 'bg-purple-100 text-purple-800',
            'Out for Delivery': 'bg-indigo-100 text-indigo-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
        if (!restaurantInfo) return;
        dispatch(updateOrderStatus({ restaurantId: restaurantInfo.id, orderId, status: newStatus }));
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div></div>;
        }

        if (status === 'failed') {
            return (
                <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium">Error Fetching Orders</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (status === 'succeeded' && orders.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No new orders</h3>
                    <p className="text-gray-600">You currently have no active orders to manage.</p>
                </div>
            );
        }

        return orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Order #{order.id.substring(0, 7)}...</h3>
                        <p className="text-gray-600 text-sm flex items-center mt-1"><User className="w-4 h-4 mr-2" /> {order.customerName}</p>
                        <p className="text-gray-600 text-sm flex items-center"><MapPin className="w-4 h-4 mr-2" /> {order.customerLocation}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Items Ordered:</h4>
                    <ul className="space-y-2 mb-4">
                        {order.items.map(item => (
                            <li key={item.id} className="flex items-center justify-between text-sm text-gray-700">
                                <div className="flex items-center"><Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover mr-3" /><span>{item.name} x {item.quantity}</span></div>
                                <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-3"><div className="flex items-center"><DollarSign className="w-5 h-5 mr-2" /> Total:</div><span>₵{order.totalAmount.toFixed(2)}</span></div>
                    <p className="text-gray-600 text-sm flex items-center mt-2"><Clock className="w-4 h-4 mr-2" /> Ordered at {new Date(order.orderTime.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    {order.status === 'Pending' && <button onClick={() => handleUpdateStatus(order.id, 'Preparing')} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"><UtensilsCrossed className="w-4 h-4 mr-2" /> Mark as Preparing</button>}
                    {order.status === 'Preparing' && <button onClick={() => handleUpdateStatus(order.id, 'Ready')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"><Package className="w-4 h-4 mr-2" /> Mark as Ready</button>}
                    {order.status === 'Ready' && <button onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"><Truck className="w-4 h-4 mr-2" /> Out for Delivery</button>}
                    {order.status === 'Out for Delivery' && <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"><CheckCircle className="w-4 h-4 mr-2" /> Mark as Delivered</button>}
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && <button onClick={() => handleUpdateStatus(order.id, 'Cancelled')} className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"><XCircle className="w-4 h-4 mr-2" /> Cancel Order</button>}
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center"><ChefHat className="w-6 h-6 text-orange-600 mr-2" />Order Management</h1>
                    <Link href="/dashboard/restaurant-info" className="text-orange-600 hover:text-orange-700 text-sm font-medium">Back to Dashboard</Link>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Received Orders</h2>
                <div className="space-y-6">{renderContent()}</div>
            </div>
        </div>
    );
};

export default OrderManagementPage;