'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, Clock, MapPin, ArrowLeft, CreditCard, Wallet, Smartphone, ChefHat, Star, Tag } from 'lucide-react';

const Cart = () => {
    const router = useRouter()

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Jollof Rice with Chicken",
            restaurant: "Mama's Kitchen",
            restaurantRating: 4.8,
            price: 25.00,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
            addons: ["Extra Chicken", "Plantain"],
            specialInstructions: "Extra spicy please"
        },
        {
            id: 2,
            name: "Chicken Fried Rice",
            restaurant: "Dragon Palace",
            restaurantRating: 4.6,
            price: 18.50,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop",
            addons: ["Sweet & Sour Sauce"],
            specialInstructions: ""
        },
        {
            id: 3,
            name: "Margherita Pizza",
            restaurant: "Pizza Corner",
            restaurantRating: 4.7,
            price: 32.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300&h=200&fit=crop",
            addons: ["Extra Cheese", "Olives"],
            specialInstructions: "Thin crust"
        }
    ]);

    const [promoCode, setPromoCode] = useState("");
    type Promo = { code: string; discount: number; type: "percentage" | "fixed" } | null;
    const [appliedPromo, setAppliedPromo] = useState<Promo>(null);
    const [deliveryAddress, setDeliveryAddress] = useState("123 University Avenue, Kumasi");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity === 0) {
            removeItem(id);
            return;
        }
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const applyPromoCode = () => {
        if (promoCode.toLowerCase() === "welcome10") {
            setAppliedPromo({ code: "WELCOME10", discount: 10, type: "percentage" });
        } else if (promoCode.toLowerCase() === "delivery5") {
            setAppliedPromo({ code: "DELIVERY5", discount: 5, type: "fixed" });
        } else {
            alert("Invalid promo code");
        }
        setPromoCode("");
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const serviceFee = 2.50;
    const discount = appliedPromo ?
        (appliedPromo.type === "percentage" ? (subtotal * appliedPromo.discount / 100) : appliedPromo.discount) : 0;
    const total = subtotal + deliveryFee + serviceFee - discount;

    const Header = () => (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-6 h-6 text-orange-600" />
                            <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </div>
                </div>
            </div>
        </div>
    );

    type CartItemType = {
        id: number;
        name: string;
        restaurant: string;
        restaurantRating: number;
        price: number;
        quantity: number;
        image: string;
        addons: string[];
        specialInstructions: string;
    };

    const CartItem = ({ item }: { item: CartItemType }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <span>{item.restaurant}</span>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1">{item.restaurantRating}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {item.addons.length > 0 && (
                        <div className="mb-3">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Add-ons: </span>
                                {item.addons.join(", ")}
                            </div>
                        </div>
                    )}

                    {item.specialInstructions && (
                        <div className="mb-3">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Special instructions: </span>
                                {item.specialInstructions}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="font-semibold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-orange-300 bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-colors"
                            >
                                <Plus className="w-4 h-4 text-orange-600" />
                            </button>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                                ₵{(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                                ₵{item.price.toFixed(2)} each
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PromoCodeSection = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-orange-600" />
                Promo Code
            </h3>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                    Apply
                </button>
            </div>
            {appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                        <span className="font-medium">{appliedPromo.code}</span> applied!
                        You saved ₵{discount.toFixed(2)}
                    </div>
                </div>
            )}
            <div className="mt-3 text-sm text-gray-500">
                Try: WELCOME10 for 10% off or DELIVERY5 for ₵5 off delivery
            </div>
        </div>
    );

    const DeliveryDetails = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                Delivery Details
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                    </label>
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Instructions (Optional)
                    </label>
                    <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        placeholder="e.g., Leave at the door, Call when you arrive..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: 25-35 minutes</span>
                </div>
            </div>
        </div>
    );

    const PaymentMethods = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === "card" ? "border-orange-600 bg-orange-600" : "border-gray-300"}`}>
                        {paymentMethod === "card" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">Card Payment</span>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="payment"
                        value="momo"
                        checked={paymentMethod === "momo"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === "momo" ? "border-orange-600 bg-orange-600" : "border-gray-300"}`}>
                        {paymentMethod === "momo" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <Smartphone className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">Mobile Money</span>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === "cash" ? "border-orange-600 bg-orange-600" : "border-gray-300"}`}>
                        {paymentMethod === "cash" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <Wallet className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">Cash on Delivery</span>
                </label>
            </div>
        </div>
    );

    const OrderSummary = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₵{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">₵{serviceFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        {appliedPromo && <span>Discount ({appliedPromo.code})</span>}
                        <span>-₵{discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₵{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg">
                Place Order - ₵{total.toFixed(2)}
            </button>

            <div className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
            </div>
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="mb-8">
                        <ChefHat className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600">Add some delicious items to get started!</p>
                    </div>
                    <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                        Browse Restaurants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Cart Items and Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <PromoCodeSection />
                        <DeliveryDetails />
                        <PaymentMethods />
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;