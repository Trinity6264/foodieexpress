'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, CreditCard, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVendorEarnings, fetchTransactionHistory, selectVendorEarnings, selectTransactions, selectTransactionsStatus } from '@/store/features/transactionSlice';

const EarningsPage = () => {
    const dispatch = useAppDispatch();
    const { restaurantInfo } = useAppSelector((state) => state.auth);
    const vendorEarnings = useAppSelector(selectVendorEarnings);
    const transactions = useAppSelector(selectTransactions);
    const transactionsStatus = useAppSelector(selectTransactionsStatus);

    useEffect(() => {
        if (restaurantInfo) {
            dispatch(fetchVendorEarnings(restaurantInfo.id));
            dispatch(fetchTransactionHistory({ vendorId: restaurantInfo.id }));
        }
    }, [restaurantInfo, dispatch]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date: Date | { toDate: () => Date } | string | number | null | undefined) => {
        // Handle different date formats
        let dateObj: Date;
        
        if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
            // Firestore Timestamp
            dateObj = date.toDate();
        } else if (date instanceof Date) {
            // Already a Date object
            dateObj = date;
        } else if (typeof date === 'string' || typeof date === 'number') {
            // String or number timestamp
            dateObj = new Date(date);
        } else {
            console.warn('Unknown date format:', date);
            return 'Invalid Date';
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateObj);
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'payment':
                return <ArrowUpRight className="w-4 h-4 text-green-600" />;
            case 'refund':
                return <ArrowDownRight className="w-4 h-4 text-red-600" />;
            case 'payout':
                return <Download className="w-4 h-4 text-blue-600" />;
            default:
                return <CreditCard className="w-4 h-4 text-gray-600" />;
        }
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

    const getCurrentMonth = () => {
        return new Date().toISOString().substring(0, 7);
    };

    const getCurrentMonthEarnings = () => {
        if (!vendorEarnings?.monthlyEarnings) return 0;
        return vendorEarnings.monthlyEarnings[getCurrentMonth()] || 0;
    };

    if (!restaurantInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                        <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                        Earnings & Transactions
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
                {/* Earnings Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vendorEarnings ? formatCurrency(vendorEarnings.totalEarnings) : '$0.00'}
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
                                    {formatCurrency(getCurrentMonthEarnings())}
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
                                <p className="text-sm font-medium text-gray-600">Pending Balance</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vendorEarnings ? formatCurrency(vendorEarnings.pendingEarnings) : '$0.00'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <CreditCard className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vendorEarnings ? vendorEarnings.totalOrders.toLocaleString() : '0'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Average Order Value */}
                {vendorEarnings && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(vendorEarnings.averageOrderValue)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                                <p className="text-xl font-bold text-green-600">
                                    {formatCurrency(vendorEarnings.availableBalance)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(vendorEarnings.totalWithdrawn)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
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
                                            Type
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
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getTransactionIcon(transaction.type)}
                                                    <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                                        {transaction.type}
                                                    </span>
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
                                                {transaction.vendorEarnings && (
                                                    <div className="text-xs text-green-600">
                                                        Earnings: {formatCurrency(transaction.vendorEarnings)}
                                                    </div>
                                                )}
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

export default EarningsPage;
