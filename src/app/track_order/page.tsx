'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Phone, MessageCircle, CheckCircle, Package, Car, ChefHat, Star, Receipt, ThumbsUp, X } from 'lucide-react';
import RatingButton from '@/components/RatingButton';
import { Timestamp, doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
    fetchUserOrders, 
    setSelectedOrder, 
    clearUserOrders,
    removeUserOrder,
    selectActiveUserOrders,
    selectSelectedOrder,
    selectUserOrdersLoading,
    selectOrdersError
} from '@/store/features/orderSlice';

// Rating Modal Component - Moved outside to prevent re-creation on every render
interface RatingModalProps {
    showRatingModal: boolean;
    selectedOrder: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    rating: number;
    review: string;
    submittingRating: boolean;
    setShowRatingModal: (show: boolean) => void;
    setRating: (rating: number) => void;
    setReview: (review: string) => void;
    submitRating: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
    showRatingModal,
    selectedOrder,
    rating,
    review,
    submittingRating,
    setShowRatingModal,
    setRating,
    setReview,
    submitRating
}) => {
    if (!showRatingModal || !selectedOrder) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Rate Your Experience</h3>
                    <button 
                        onClick={() => setShowRatingModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">How was your experience with {selectedOrder.restaurant.name}?</p>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>
                    
                    {/* Rating Text */}
                    {rating > 0 && (
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            {rating === 1 && "Poor - We're sorry to hear that"}
                            {rating === 2 && "Fair - Room for improvement"}
                            {rating === 3 && "Good - Meets expectations"}
                            {rating === 4 && "Very Good - Above expectations"}
                            {rating === 5 && "Excellent - Outstanding service!"}
                        </p>
                    )}
                    
                    {/* Review Text */}
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about the food, service, or delivery (optional)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-black"
                        rows={3}
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{review.length}/500 characters</p>
                </div>
                
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowRatingModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={submitRating}
                        disabled={rating === 0 || submittingRating}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            rating === 0 || submittingRating
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                    >
                        {submittingRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TrackOrder = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    
    // Get state from Redux
    const orders = useAppSelector(selectActiveUserOrders);
    const selectedOrder = useAppSelector(selectSelectedOrder);
    const loading = useAppSelector(selectUserOrdersLoading);
    const error = useAppSelector(selectOrdersError);
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

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
            // The real-time listener cleanup is handled in the Redux slice
            dispatch(clearUserOrders());
        };
    }, [user, router, dispatch]);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Function to submit rating
    const submitRating = async () => {
        if (!selectedOrder || !user || rating === 0) return;

        setSubmittingRating(true);
        try {
            // Add rating to the ratings collection
            await addDoc(collection(db, 'ratings'), {
                orderId: selectedOrder.id,
                userId: user.uid,
                vendorId: selectedOrder.vendorId,
                restaurantName: selectedOrder.restaurant.name,
                rating: rating,
                review: review.trim(),
                createdAt: Timestamp.now(),
                orderDate: selectedOrder.placedAt,
                customerName: user.displayName || 'Anonymous'
            });

            // Update the order to mark it as rated
            const orderRef = doc(db, 'orders', selectedOrder.id);
            await updateDoc(orderRef, {
                isRated: true,
                ratedAt: Timestamp.now()
            });

            // Remove the order from active tracking list
            dispatch(removeUserOrder(selectedOrder.id));

            // Clear the selected order since it's no longer active
            dispatch(setSelectedOrder(null));

            // Close modal and reset form
            setShowRatingModal(false);
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

    if (!user) {
        return null; // Will redirect to login
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">Error loading orders</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => user && dispatch(fetchUserOrders(user.uid))}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Track Orders</h1>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h2>
                    <p className="text-gray-600 mb-6">You don&apos;t have any orders to track right now.</p>
                    <button 
                        onClick={() => router.push('/')} 
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    // Convert trackingStatus to status string for UI
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

    // Status progression
    const statusSteps = [
        { key: "placed", label: "Order Placed", icon: Receipt, completed: true },
        { key: "preparing", label: "Preparing", icon: ChefHat, completed: selectedOrder ? selectedOrder.trackingStatus >= 2 : false },
        { key: "ready", label: "Ready for Pickup", icon: Package, completed: selectedOrder ? selectedOrder.trackingStatus >= 3 : false },
        { key: "on_the_way", label: "On the Way", icon: Car, completed: selectedOrder ? selectedOrder.trackingStatus >= 4 : false },
        { key: "delivered", label: "Delivered", icon: CheckCircle, completed: selectedOrder ? selectedOrder.trackingStatus >= 5 : false }
    ];

    const getStatusMessage = () => {
        if (!selectedOrder) return "";
        
        switch (selectedOrder.trackingStatus) {
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

    const getEstimatedTime = () => {
        if (!selectedOrder) return "";
        
        const estimatedDelivery = selectedOrder.estimatedDelivery || new Date(Date.now() + 45 * 60 * 1000);
        const deliveryTime = estimatedDelivery instanceof Date ? estimatedDelivery : estimatedDelivery.toDate();
        const diff = deliveryTime.getTime() - currentTime.getTime();
        const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));

        if (selectedOrder.trackingStatus === 5) {
            return "Delivered";
        }

        if (minutes <= 0) {
            return "Any moment now";
        }

        return `${minutes} min${minutes > 1 ? 's' : ''}`;
    };

    const formatTime = (date: Date | Timestamp) => {
        const dateObj = date instanceof Date ? date : date.toDate();
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const Header = () => (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Track Orders</h1>
                            {selectedOrder && (
                                <p className="text-sm text-gray-600">{selectedOrder.orderNumber}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Estimated delivery</div>
                        <div className="font-semibold text-orange-600">{getEstimatedTime()}</div>
                    </div>
                </div>
                
                {/* Order Selection Tabs */}
                {orders.length > 1 && (
                    <div className="mt-4 flex space-x-2 overflow-x-auto">
                        {orders.map((order) => (
                            <button
                                key={order.id}
                                onClick={() => dispatch(setSelectedOrder(order.id))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    selectedOrder?.id === order.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {order.orderNumber}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const OrderStatus = () => {
        if (!selectedOrder) return null;
        
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium mb-3">
                        <Clock className="w-4 h-4 mr-2" />
                        {getEstimatedTime()} remaining
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {getStatusMessage()}
                    </h2>
                    <p className="text-gray-600">
                        Placed at {formatTime(selectedOrder.placedAt)} • Expected by {formatTime(selectedOrder.estimatedDelivery || selectedOrder.placedAt)}
                    </p>
                    
                    {/* Rating Button for Delivered Orders */}
                    {selectedOrder.trackingStatus === 5 && !selectedOrder.isRated && (
                        <div className="mt-4">
                            <RatingButton 
                                onClick={() => setShowRatingModal(true)}
                            />
                        </div>
                    )}
                    
                    {/* Already Rated Message */}
                    {selectedOrder.trackingStatus === 5 && selectedOrder.isRated && (
                        <div className="mt-4">
                            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Thank you for rating this order!
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Steps */}
                <div className="relative">
                    <div className="flex justify-between items-center">
                        {statusSteps.map((step, index) => {
                            console.log(`Rendering step: ${step.label} (key: ${step.key}) index: ${index}`);
                            
                            const Icon = step.icon;
                            const currentStatus = getStatusFromTracking(selectedOrder.trackingStatus);
                            const isActive = step.key === currentStatus;
                            const isCompleted = step.completed;

                            return (
                                <div key={step.key} className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isActive
                                                ? 'bg-orange-500 text-white animate-pulse'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-xs font-medium text-center max-w-16 ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Line */}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-0">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{
                                width: `${((selectedOrder.trackingStatus - 1) / (statusSteps.length - 1)) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const RestaurantInfo = () => {
        if (!selectedOrder) return null;
        
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Restaurant Details</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{selectedOrder.restaurant.name}</h4>
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{selectedOrder.restaurant.rating}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">{selectedOrder.restaurant.address}</p>
                    </div>
                </div>
            </div>
        );
    };

    const DriverInfo = () => {
        if (!selectedOrder || !selectedOrder.driver || selectedOrder.trackingStatus < 4) return null;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Driver Details</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-lg">
                                {selectedOrder.driver.name?.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">{selectedOrder.driver.name}</h4>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">{selectedOrder.driver.rating}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{selectedOrder.driver.vehicle}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Call</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <MessageCircle className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Chat</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const DeliveryInfo = () => {
        if (!selectedOrder) return null;
        
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    Delivery Address
                </h3>
                <div className="space-y-3">
                    <p className="text-gray-900">{selectedOrder.delivery.address}</p>
                    {selectedOrder.delivery.instructions && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Instructions: </span>
                            {selectedOrder.delivery.instructions}
                        </div>
                    )}
                    {/* {selectedOrder.trackingStatus === 4 && (
                        <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors">
                            <Navigation className="w-4 h-4" />
                            <span className="text-sm font-medium">Track on Map</span>
                        </button>
                    )} */}
                </div>
            </div>
        );
    };

    const OrderItems = () => {
        if (!selectedOrder) return null;
        
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                    {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-4">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="w-15 h-15 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    {selectedOrder.taxes ? (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className='text-black'>₵{selectedOrder.taxes.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">VAT (15%)</span>
                                <span className='text-black'>₵{selectedOrder.taxes.vatAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">NHIL (2.5%)</span>
                                <span className='text-black'>₵{selectedOrder.taxes.nhilAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">GETFund Levy (2.5%)</span>
                                <span className='text-black'>₵{selectedOrder.taxes.getfundAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Service Fee</span>
                                <span className='text-black'>₵{selectedOrder.taxes.serviceFee.toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className='text-black'>₵{(selectedOrder.total - selectedOrder.delivery.fee - 2.50).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className='text-black'>₵{selectedOrder.delivery.fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Service Fee</span>
                                <span className='text-black'>₵2.50</span>
                            </div>
                        </>
                    )}
                    <div className="flex text-gray-600 justify-between font-semibold">
                        <span>Total</span>
                        <span className='text-black'>₵{selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Paid via {selectedOrder.paymentMethod}
                    </div>
                </div>
            </div>
        );
    };

    // const ActionButtons = () => (
    //     <div className="bg-white rounded-lg border border-gray-200 p-6">
    //         <div className="space-y-3">
    //             <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
    //                 Order Again
    //             </button>
    //             <div className="grid grid-cols-2 gap-3">
    //                 <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
    //                     Get Help
    //                 </button>
    //                 <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
    //                     Rate Order
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );

    // Main render - only show if we have a selected order
    if (!selectedOrder) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Select an Order</h2>
                    <p className="text-gray-600">Choose an order from the tabs above to track its progress.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-2xl mx-auto px-4 py-6">
                <OrderStatus />
                <RestaurantInfo />
                <DriverInfo />
                <DeliveryInfo />
                <OrderItems />
                {/* <ActionButtons /> */}
            </div>
            
            {/* Rating Modal */}
            <RatingModal 
                showRatingModal={showRatingModal}
                selectedOrder={selectedOrder}
                rating={rating}
                review={review}
                submittingRating={submittingRating}
                setShowRatingModal={setShowRatingModal}
                setRating={setRating}
                setReview={setReview}
                submitRating={submitRating}
            />
        </div>
    );
};

export default TrackOrder;