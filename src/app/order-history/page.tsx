'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Receipt, Clock, Package, CheckCircle,  } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
    fetchUserOrders, 
    clearUserOrders,
    selectUserOrders,
    selectUserOrdersLoading,
    selectOrdersError
} from '@/store/features/orderSlice';
import { Timestamp, doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';

const OrderHistoryPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    
    // Filter state
    const [activeFilter, setActiveFilter] = useState<'all' | 'delivered' | 'cancelled' | 'rated' | 'unrated'>('all');
    
    // Rating modal state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedOrderForRating, setSelectedOrderForRating] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);
    
    // Get state from Redux
    const allOrders = useAppSelector(selectUserOrders);
    const loading = useAppSelector(selectUserOrdersLoading);
    const error = useAppSelector(selectOrdersError);
    
    // Filter for delivered and cancelled orders (order history)
    const historyOrders = allOrders.filter(order => 
        order.trackingStatus === 5 || // All delivered orders (rated or unrated)
        order.status === 'cancelled' || // Cancelled orders
        order.trackingStatus === 0 // Also check trackingStatus for cancelled
    ).filter(order => {
        // Apply the active filter
        const isCancelled = order.status === 'cancelled' || order.trackingStatus === 0;
        const isDelivered = order.trackingStatus === 5;
        const isRated = order.isRated;
        
        switch (activeFilter) {
            case 'all':
                return true;
            case 'delivered':
                return isDelivered;
            case 'cancelled':
                return isCancelled;
            case 'rated':
                return isDelivered && isRated;
            case 'unrated':
                return isDelivered && !isRated;
            default:
                return true;
        }
    }).sort((a, b) => {
        // Sort by most recent first (using placedAt as primary sort)
        const dateA = a.placedAt?.toDate ? a.placedAt.toDate() : (a.placedAt as unknown as Date);
        const dateB = b.placedAt?.toDate ? b.placedAt.toDate() : (b.placedAt as unknown as Date);
        return dateB.getTime() - dateA.getTime();
    });

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

    // Function to submit rating
    const submitRating = async () => {
        if (!selectedOrderForRating || !user || rating === 0) return;

        setSubmittingRating(true);
        try {
            // Add rating to the ratings collection
            await addDoc(collection(db, 'ratings'), {
                orderId: selectedOrderForRating.id,
                userId: user.uid,
                vendorId: selectedOrderForRating.vendorId,
                restaurantName: selectedOrderForRating.restaurant.name,
                rating: rating,
                review: review.trim(),
                createdAt: Timestamp.now(),
                orderDate: selectedOrderForRating.placedAt,
                customerName: user.displayName || 'Anonymous'
            });

            // Update the order to mark it as rated
            const orderRef = doc(db, 'orders', selectedOrderForRating.id);
            await updateDoc(orderRef, {
                isRated: true,
                ratedAt: Timestamp.now()
            });

            // Close modal and reset form
            setShowRatingModal(false);
            setSelectedOrderForRating(null);
            setRating(0);
            setReview('');
            
            alert('Thank you for your rating!');
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setSubmittingRating(false);
        }
    };

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
                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Orders', count: allOrders.filter(order => 
                                order.trackingStatus === 5 || order.status === 'cancelled' || order.trackingStatus === 0
                            ).length },
                            { key: 'delivered', label: 'Delivered', count: allOrders.filter(order => 
                                order.trackingStatus === 5
                            ).length },
                            { key: 'cancelled', label: 'Cancelled', count: allOrders.filter(order => 
                                order.status === 'cancelled' || order.trackingStatus === 0
                            ).length },
                            { key: 'rated', label: 'Rated', count: allOrders.filter(order => 
                                order.trackingStatus === 5 && order.isRated
                            ).length },
                            { key: 'unrated', label: 'Unrated', count: allOrders.filter(order => 
                                order.trackingStatus === 5 && !order.isRated
                            ).length }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key as typeof activeFilter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === key
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {historyOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8">
                        <div className="text-center">
                            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {activeFilter === 'all' && 'No Order History'}
                                {activeFilter === 'delivered' && 'No Delivered Orders'}
                                {activeFilter === 'cancelled' && 'No Cancelled Orders'}
                                {activeFilter === 'rated' && 'No Rated Orders'}
                                {activeFilter === 'unrated' && 'No Unrated Orders'}
                            </h3>
                            <p className="text-gray-600 mb-8">
                                {activeFilter === 'all' && "You haven't completed any orders yet."}
                                {activeFilter === 'delivered' && "You don't have any delivered orders yet."}
                                {activeFilter === 'cancelled' && "You don't have any cancelled orders."}
                                {activeFilter === 'rated' && "You haven't rated any orders yet."}
                                {activeFilter === 'unrated' && "All your delivered orders have been rated!"}
                            </p>
                            
                            {/* Info about what appears here */}
                            <div className="text-gray-500 mb-6">
                                <p className="mb-4">Once you place orders, you&apos;ll see:</p>
                                <ul className="space-y-2 text-left max-w-md mx-auto">
                                    <li className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                        Completed and rated orders
                                    </li>
                                    <li className="flex items-center">
                                        <Package className="w-4 h-4 text-red-500 mr-2" />
                                        Cancelled orders
                                    </li>
                                    <li className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                        Your ratings and reviews
                                    </li>
                                    <li className="flex items-center">
                                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                        Order timestamps and details
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
                            {historyOrders.length} order{historyOrders.length !== 1 ? 's' : ''} in history
                        </div>
                        
                        {historyOrders.map((order) => {
                            const isCancelled = order.status === 'cancelled' || order.trackingStatus === 0;
                            
                            return (
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
                                            isCancelled ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {isCancelled ? (
                                                <>
                                                    <Package className="w-4 h-4 mr-1" />
                                                    Cancelled
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Delivered
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
                                    <div className="space-y-1">
                                        {order.items.slice(0, 3).map((item: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
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

                                {/* Status-specific information */}
                                <div className="pt-4 border-t border-gray-100">
                                    {isCancelled ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 text-red-400 mr-1" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Order was cancelled
                                                </span>
                                            </div>
                                            {order.cancelledAt && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(order.cancelledAt)}
                                                </span>
                                            )}
                                        </div>
                                    ) : order.isRated ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    You rated this order
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(order.ratedAt)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Order delivered - Please rate your experience
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrderForRating(order);
                                                    setShowRatingModal(true);
                                                }}
                                                className="px-3 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition-colors"
                                            >
                                                Rate Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Reorder button (only for completed orders) */}
                                {!isCancelled && (
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
                            );
                        })}
                    </div>
                )}

                {/* Rating Modal */}
                {showRatingModal && selectedOrderForRating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-black">Rate Your Experience</h3>
                            
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">{selectedOrderForRating.restaurantName}</h4>
                                <div className="text-sm text-gray-600">
                                    Order #{selectedOrderForRating.id}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    star <= rating
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Review (Optional)
                                </label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black resize-none"
                                    rows={3}
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowRatingModal(false);
                                        setSelectedOrderForRating(null);
                                        setRating(0);
                                        setReview('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRating}
                                    disabled={rating === 0 || submittingRating}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
