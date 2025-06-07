// src/app/dashboard/order-management/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChefHat, Package, Clock, MapPin, DollarSign, User, CheckCircle, Truck, XCircle, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    customerName: string;
    customerLocation: string;
    totalAmount: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    orderTime: string;
    deliveryTimeEstimate: string;
    items: OrderItem[];
}

const mockOrders: Order[] = [
    {
        id: "ORD-001",
        customerName: "Kwame Asante",
        customerLocation: "Accra Central",
        totalAmount: 75.00,
        status: "Pending",
        orderTime: "2025-06-07T10:00:00Z",
        deliveryTimeEstimate: "30-40 min",
        items: [
            { id: 1, name: "Jollof Rice with Chicken", quantity: 2, price: 25.00, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop" },
            { id: 2, name: "Kelewele", quantity: 1, price: 12.00, image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=100&h=100&fit=crop" },
        ],
    },
    {
        id: "ORD-002",
        customerName: "Sarah Johnson",
        customerLocation: "East Legon",
        totalAmount: 35.00,
        status: "Preparing",
        orderTime: "2025-06-07T09:45:00Z",
        deliveryTimeEstimate: "20-30 min",
        items: [
            { id: 3, name: "Spaghetti Bolognese", quantity: 1, price: 35.00, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=100&h=100&fit=crop" },
        ],
    },
    {
        id: "ORD-003",
        customerName: "Abdul Rahman",
        customerLocation: "Osu",
        totalAmount: 90.50,
        status: "Out for Delivery",
        orderTime: "2025-06-07T09:15:00Z",
        deliveryTimeEstimate: "10-15 min",
        items: [
            { id: 4, name: "Chicken Fried Rice", quantity: 2, price: 18.50, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop" },
            { id: 5, name: "Banku with Tilapia", quantity: 1, price: 30.00, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100&h=100&fit=crop" },
            { id: 6, name: "Coca Cola", quantity: 2, price: 2.00, image: "https://images.unsplash.com/photo-1621430030018-87b6a4b1f4c7?w=100&h=100&fit=crop" },
        ],
    },
    {
        id: "ORD-004",
        customerName: "Grace Mensah",
        customerLocation: "Tema",
        totalAmount: 55.00,
        status: "Delivered",
        orderTime: "2025-06-07T08:30:00Z",
        deliveryTimeEstimate: "Delivered",
        items: [
            { id: 7, name: "Banku with Tilapia", quantity: 1, price: 30.00, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100&h=100&fit=crop" },
            { id: 8, name: "Groundnut Soup", quantity: 1, price: 25.00, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763ef1?w=100&h=100&fit=crop" },
        ],
    },
    {
        id: "ORD-005",
        customerName: "Emmanuel Boafo",
        customerLocation: "Kumasi",
        totalAmount: 40.00,
        status: "Cancelled",
        orderTime: "2025-06-07T07:00:00Z",
        deliveryTimeEstimate: "Cancelled",
        items: [
            { id: 9, name: "Waakye", quantity: 2, price: 20.00, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=100&h=100&fit=crop" },
        ],
    },
];

const OrderManagementPage = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Ready': return 'bg-purple-100 text-purple-800';
            case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        alert(`Order ${orderId} status updated to: ${newStatus}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ChefHat className="w-6 h-6 text-orange-600" />
                        <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
                    </div>
                    <Link href="/dashboard/restaurant-info" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Received Orders</h2>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow-md">
                            <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No new orders</h3>
                            <p className="text-gray-600">You currently have no active orders to manage.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-gray-600 text-sm flex items-center mt-1">
                                            <User className="w-4 h-4 mr-2" /> {order.customerName}
                                        </p>
                                        <p className="text-gray-600 text-sm flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" /> {order.customerLocation}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h4 className="font-medium text-gray-800 mb-3">Items Ordered:</h4>
                                    <ul className="space-y-2 mb-4">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex items-center justify-between text-sm text-gray-700">
                                                <div className="flex items-center">
                                                    <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover mr-2" />
                                                    <span>{item.name} x {item.quantity}</span>
                                                </div>
                                                <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-3">
                                        <div className="flex items-center">
                                            <DollarSign className="w-5 h-5 mr-2" /> Total:
                                        </div>
                                        <span>₵{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm flex items-center mt-2">
                                        <Clock className="w-4 h-4 mr-2" /> Ordered at {new Date(order.orderTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - Estimated delivery: {order.deliveryTimeEstimate}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                                            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                        >
                                            <UtensilsCrossed className="w-4 h-4 mr-2" /> Mark Preparing
                                        </button>
                                    )}
                                    {order.status === 'Preparing' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Ready')}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <Package className="w-4 h-4 mr-2" /> Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'Ready' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        >
                                            <Truck className="w-4 h-4 mr-2" /> Out for Delivery
                                        </button>
                                    )}
                                    {order.status === 'Out for Delivery' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Delivered
                                        </button>
                                    )}
                                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                            className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagementPage;