'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowLeft, ChefHat } from 'lucide-react';
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


const CartPageContent = () => { // Renamed from CartPage to CartPageContent
    const router = useRouter();
    const dispatch = useAppDispatch();
    const quantity = useAppSelector((state) => state.cart.items.length);
    const user = useAppSelector((state => state.auth.user)); // Assuming you have a user in your auth state


    const onSuccess = (reference: string) => {
        alert(`Order placed successfully for ${reference}`);
        dispatch(clearCart());
        router.push('/');
        console.log(reference);
    };

    const onClose = () => {
        console.log('closed')
    }
    const cartItems = useAppSelector(selectCartItems);
    const subtotal = useAppSelector(selectCartTotal);

    const deliveryFee = 5.00; // Example fee
    const serviceFee = 2.50; // Example fee
    const total = subtotal + deliveryFee + serviceFee;
    const config = {
        reference: (new Date()).getTime().toString(),
        email: "amoahtnt6@gmail.com",
        amount: total * 100,
        phone: "0558060860",
        quantity: quantity,
        firstname: "Alexander",
        lastname: "Amoah",
        currency: "GHS",
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
    };
    const initializePayment = usePaystackPayment(config);
    const handlePlaceOrder = async () => {
        if (!user) {
            alert("You must be logged in to place an order.");
            router.push('/login');
            return;
        }

        try {
            initializePayment({ onSuccess, onClose })
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
            <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map(item => <CartItemRow key={item.id} item={item} />)}
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-black">Order Summary</h3>
                        <div className="flex justify-between text-gray-600"><p>Subtotal</p><p>₵{subtotal.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Delivery Fee</p><p>₵{deliveryFee.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Service Fee</p><p>₵{serviceFee.toFixed(2)}</p></div>
                        <div className="border-t pt-4 flex justify-between text-gray-700 font-bold"><p>Total</p><p>₵{total.toFixed(2)}</p></div>
                        <button onClick={handlePlaceOrder} className="w-full bg-orange-600 cursor-pointer text-white py-3 rounded-lg hover:bg-orange-700 font-semibold">Place Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageContent;