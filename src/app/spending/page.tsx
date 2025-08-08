'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Calendar, ShoppingBag, ArrowUpRight, CreditCard, Home } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserSpending, fetchTransactionHistory, selectUserSpending, selectTransactions, selectTransactionsStatus } from '@/store/features/transactionSlice';

const UserSpendingPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const userSpending = useAppSelector(selectUserSpending);
    const transactions = useAppSelector(selectTransactions);
    const transactionsStatus = useAppSelector(selectTransactionsStatus);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserSpending(user.uid));
            dispatch(fetchTransactionHistory({ userId: user.uid }));
        }
    }, [user, dispatch]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date: Date | any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        try {
            if (!date) return 'N/A';
            
            // Handle Firestore Timestamp
            if (date.toDate && typeof date.toDate === 'function') {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date.toDate());
            }
            
            // Handle regular Date object
            if (date instanceof Date) {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            }
            
            // Handle string date
            if (typeof date === 'string') {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(date));
            }
            
            return 'Invalid Date';
        } catch (error) {
            console.error('Error formatting date:', error, date);
            return 'Invalid Date';
        }
    };

    const getCurrentMonth = () => {
        return new Date().toISOString().substring(0, 7);
    };

    const getCurrentMonthSpending = () => {
        if (!userSpending?.monthlySpending) return 0;
        return userSpending.monthlySpending[getCurrentMonth()] || 0;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-600 mb-4">Please login to view your spending analytics.</p>
                    <Link 
                        href="/login" 
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        Login
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
                        <DollarSign className="w-6 h-6 text-orange-600 mr-2" />
                        My Spending Analytics
                    </h1>
                    <Link 
                        href="/" 
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
                    >
                        <Home className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Spending Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {userSpending ? formatCurrency(userSpending.totalSpent) : '$0.00'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(getCurrentMonthSpending())}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {userSpending ? userSpending.totalOrders.toLocaleString() : '0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {userSpending ? formatCurrency(userSpending.averageOrderValue) : '$0.00'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite Vendor */}
                {userSpending?.favoriteVendor && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Most Ordered From</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-bold text-gray-900">Vendor ID: {userSpending.favoriteVendor}</p>
                                <p className="text-gray-600">
                                    Last order: {userSpending.lastOrderDate ? 
                                        formatDate(userSpending.lastOrderDate.toDate()) : 'Never'
                                    }
                                </p>
                            </div>
                            <div className="text-orange-600">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Monthly Spending Breakdown */}
                {userSpending?.monthlySpending && Object.keys(userSpending.monthlySpending).length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(userSpending.monthlySpending)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .slice(0, 6)
                                .map(([month, amount]) => (
                                    <div key={month} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600">
                                            {new Date(month + '-01').toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                        {/* Debug info - remove in production */}
                        <div className="text-xs text-gray-500 mt-1">
                            Status: {transactionsStatus} | Count: {transactions.length} | User ID: {user?.uid}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {transactionsStatus === 'loading' ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading transactions...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p>No transactions yet</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Restaurant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.slice(0, 10).map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Vendor ID: {transaction.vendorId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{transaction.description}</div>
                                                {transaction.paymentReference && (
                                                    <div className="text-xs text-gray-500">
                                                        Ref: {transaction.paymentReference}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(transaction.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSpendingPage;
