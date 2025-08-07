import React from 'react';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderHistoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                    <div className="text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order History</h1>
                        <p className="text-gray-600 mb-8">
                            Track all your past orders and their status
                        </p>
                        
                        {/* Placeholder for order history content */}
                        <div className="text-gray-500">
                            <p className="mb-4">This page will display:</p>
                            <ul className="space-y-2 text-left max-w-md mx-auto">
                                <li className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                    Completed orders
                                </li>
                                <li className="flex items-center">
                                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                    Cancelled orders
                                </li>
                                <li className="flex items-center">
                                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                                    Order timestamps and details
                                </li>
                                <li className="flex items-center">
                                    <Package className="w-4 h-4 text-blue-500 mr-2" />
                                    Reorder functionality
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
