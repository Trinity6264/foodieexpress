'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowLeft, ChefHat,  } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectCartItems,
    selectCartTotal,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    CartItem as CartItemType,
} from '@/store/features/cartSlice';
import Link from 'next/link';
import { usePaystackPayment } from 'react-paystack';
import { collection, addDoc, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { OrderItem, RestaurantInfo, DeliveryInfo, TaxBreakdown } from '@/interfaces/OrderInterface';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';

// Define PayStack payment reference interface
interface PaystackReference {
    reference: string;
    status?: string;
    trans?: string;
    transaction?: string;
    orderId?: string;
    channel?: string; // Payment method: card, bank, ussd, qr, mobile_money, bank_transfer
    gateway_response?: string;
    paid_at?: string;
    created_at?: string;
}

const CartPageContent = () => { // Renamed from CartPage to CartPageContent
    const router = useRouter();
    const dispatch = useAppDispatch();
    const quantity = useAppSelector((state) => state.cart.items.length);
    const user = useAppSelector((state => state.auth.user));
    const currentRestaurantId = useAppSelector((state) => state.cart.currentRestaurantId);
    
    // State for delivery location
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [locationError, setLocationError] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PayStack Payment');
    

    // Function to save order to Firestore
    const saveOrderToFirestore = async (): Promise<string | null> => {
        if (!user) return null;

        try {
            const orderItems: OrderItem[] = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            }));

            // Generate unique order number
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            
            // Calculate estimated delivery time (45 minutes from now as default)
            const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000);

            // Fetch restaurant information
            let restaurantInfo: RestaurantInfo = {
                name: "Restaurant Name", // Default fallback
                rating: 4.5,
                phone: "+233 50 000 0000",
                address: "Restaurant Address"
            };

            if (currentRestaurantId) {
                try {
                    const restaurantDocRef = doc(db, 'restaurants', currentRestaurantId);
                    const restaurantDoc = await getDoc(restaurantDocRef);
                    
                    if (restaurantDoc.exists()) {
                        const restaurantData = restaurantDoc.data() as RestaurantInfoInterface;
                        restaurantInfo = {
                            name: restaurantData.name,
                            rating: restaurantData.rating,
                            phone: restaurantData.phone,
                            address: restaurantData.address
                        };
                    }
                } catch (error) {
                    console.error('Error fetching restaurant info:', error);
                }
            }

            const deliveryInfo: DeliveryInfo = {
                address: deliveryLocation.trim(),
                instructions: deliveryInstructions.trim(),
                fee: 0,
            };

            const taxBreakdown: TaxBreakdown = {
                subtotal: subtotal,
                vatRate: vatRate,
                vatAmount: vatAmount,
                nhilRate: nhilRate,
                nhilAmount: nhilAmount,
                getfundRate: getfundRate,
                getfundAmount: getfundAmount,
                totalTaxes: totalTaxes,
                serviceFee: serviceFee
            };

            const orderData = {
                orderNumber: orderNumber,
                userId: user.uid,
                vendorId: currentRestaurantId,
                trackingStatus: 1 as const, // 1: Order Placed (initial status)
                placedAt: Timestamp.now(),
                estimatedDelivery: Timestamp.fromDate(estimatedDelivery),
                restaurant: restaurantInfo,
                delivery: deliveryInfo,
                items: orderItems,
                taxes: taxBreakdown,
                total: total,
                paymentMethod: paymentMethod, // Use dynamic payment method
                paymentStatus: 'Pending' as const
            };

            const ordersCollection = collection(db, 'orders');
            const docRef = await addDoc(ordersCollection, orderData);
            
            console.log('Order saved with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Failed to create order. Please try again.');
            return null;
        }
    };

    // Function to update order status after payment
    const updateOrderStatus = async (orderId: string, paymentReference: string, status: 'Paid' | 'Failed', paymentChannel?: string) => {
        try {
            const updateData: {
                paymentStatus: 'Paid' | 'Failed';
                paymentReference: string;
                updatedAt: Timestamp;
                paymentMethod?: string;
            } = {
                paymentStatus: status,
                paymentReference: paymentReference,
                updatedAt: Timestamp.now()
            };

            // If payment was successful and we have channel info, update payment method
            if (status === 'Paid' && paymentChannel) {
                const paymentMethodMap: Record<string, string> = {
                    'card': 'Credit/Debit Card',
                    'bank': 'Bank Transfer',
                    'ussd': 'USSD',
                    'qr': 'QR Code',
                    'mobile_money': 'Mobile Money',
                    'bank_transfer': 'Bank Transfer'
                };
                updateData.paymentMethod = paymentMethodMap[paymentChannel] || `PayStack - ${paymentChannel}`;
            }

            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, updateData);
            
            console.log(`Order ${orderId} payment status updated to ${status}`);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const onSuccess = async (reference: PaystackReference) => {
        const paymentReference = reference.reference || reference;
        
        // Update order status to paid with payment method info
        if (reference.orderId) {
            await updateOrderStatus(reference.orderId, paymentReference.toString(), 'Paid', reference.channel);
        }
        
        // Update local payment method state for UI
        if (reference.channel) {
            const paymentMethodMap: Record<string, string> = {
                'card': 'Credit/Debit Card',
                'bank': 'Bank Transfer',
                'ussd': 'USSD',
                'qr': 'QR Code',
                'mobile_money': 'Mobile Money',
                'bank_transfer': 'Bank Transfer'
            };
            setPaymentMethod(paymentMethodMap[reference.channel] || `PayStack - ${reference.channel}`);
        }
        
        alert(`Payment successful! Reference: ${paymentReference}`);
        dispatch(clearCart());
        router.push('/track_order');
        console.log('Payment successful:', reference);
    };

    const onClose = () => {
        console.log('Payment modal closed');
    }
    const cartItems = useAppSelector(selectCartItems);
    const subtotal = useAppSelector(selectCartTotal);

    const vatRate = 0.15; // 15% VAT in Ghana
    const nhilRate = 0.025; // 2.5% NHIL (National Health Insurance Levy)
    const getfundRate = 0.025; // 2.5% GETFund Levy
    
    const vatAmount = subtotal * vatRate;
    const nhilAmount = subtotal * nhilRate;
    const getfundAmount = subtotal * getfundRate;
    const totalTaxes = vatAmount + nhilAmount + getfundAmount;
    
    const serviceFee = 2.50; // Example fee
    const total = subtotal + totalTaxes + serviceFee;
    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || '',
        amount: total * 100,
        phone: user?.phoneNumber || "0558060860",
        quantity: quantity,
        firstname: user?.displayName || "Guest",
        lastname: "User",
        currency: "GHS",
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
    };
    const initializePayment = usePaystackPayment(config);
    
    const handlePlaceOrder = async () => {
        // Clear previous location error
        setLocationError('');

        if (!user) {
            alert("You must be logged in to place an order.");
            router.push('/login');
            return;
        }

        if (!currentRestaurantId) {
            alert("Unable to identify the restaurant. Please try adding items to cart again.");
            return;
        }

        // Validate delivery location
        if (!deliveryLocation.trim()) {
            setLocationError('Please enter your delivery location');
            return;
        }

        try {
            // First, save the order to Firestore
            const orderId = await saveOrderToFirestore();
            
            if (!orderId) {
                alert('Failed to create order. Please try again.');
                return;
            }

            // Initialize payment with order ID attached
            initializePayment({ 
                onSuccess: (reference: PaystackReference) => onSuccess({ ...reference, orderId }), 
                onClose 
            });
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Failed to initialize payment. Please try again later.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 text-center py-16">
                <ChefHat className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
                <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-semibold">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    const CartItemRow = ({ item }: { item: CartItemType }) => (
        <div className="bg-white rounded-lg border p-4 flex gap-4 items-center">
            <Image src={item.image} alt={item.name} width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">₵{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => dispatch(decrementQuantity(item.id))} className="p-1 border text-gray-700 rounded-full"><Minus size={16} /></button>
                <span className="font-semibold w-8 text-center text-black">{item.quantity}</span>
                <button onClick={() => dispatch(incrementQuantity(item.id))} className="p-1 border text-gray-700 rounded-full"><Plus size={16} /></button>
            </div>
            <div className="font-bold w-20 text-right text-gray-700">₵{(item.price * item.quantity).toFixed(2)}</div>
            <button onClick={() => dispatch(removeItem(item.id))} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20} /></button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map(item => <CartItemRow key={item.id} item={item} />)}
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-black">Order Summary</h3>
                        
                        {/* Delivery Location Input */}
                        <div className="space-y-2">
                            <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">
                                Delivery Location *
                            </label>
                            <input
                                type="text"
                                id="deliveryLocation"
                                value={deliveryLocation}
                                onChange={(e) => {
                                    setDeliveryLocation(e.target.value);
                                    if (locationError) setLocationError(''); // Clear error when user types
                                }}
                                placeholder="Enter your delivery address..."
                                className={`w-full px-3 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                    locationError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {locationError && (
                                <p className="text-red-500 text-sm">{locationError}</p>
                            )}
                        </div>

                        {/* Delivery Instructions Input */}
                        <div className="space-y-2">
                            <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700">
                                Delivery Instructions
                            </label>
                            <textarea
                                id="deliveryInstructions"
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                                placeholder="e.g., Leave at the door, Call when you arrive, Ring the bell..."
                                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                            <p className="text-xs text-gray-500">Optional: Provide specific instructions for the delivery driver</p>
                        </div>
                        
                        <div className="flex justify-between text-gray-600"><p>Subtotal</p><p>₵{subtotal.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>VAT (15%)</p><p>₵{vatAmount.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>NHIL (2.5%)</p><p>₵{nhilAmount.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>GETFund Levy (2.5%)</p><p>₵{getfundAmount.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Service Fee</p><p>₵{serviceFee.toFixed(2)}</p></div>
                        <div className="border-t pt-4 flex justify-between text-gray-700 font-bold"><p>Total</p><p>₵{total.toFixed(2)}</p></div>
                        <button 
                            onClick={handlePlaceOrder} 
                            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                deliveryLocation.trim() 
                                    ? 'bg-orange-600 text-white hover:bg-orange-700 cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!deliveryLocation.trim()}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageContent;