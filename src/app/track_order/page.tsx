'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Phone, MessageCircle, CheckCircle, Package, Car, ChefHat, Star, Receipt, Navigation } from 'lucide-react';

const TrackOrder = () => {
    const router = useRouter();

    // Mock order data - in real app, this would come from API based on order ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderData, setOrderData] = useState({
        orderNumber: "ORD-1735659123456-AB7C",
        status: "preparing", // preparing, ready, on_the_way, delivered
        placedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
        restaurant: {
            name: "Mama's Kitchen",
            rating: 4.8,
            phone: "+233 50 123 4567",
            address: "Ring Road Central, Kumasi"
        },
        delivery: {
            address: "123 University Avenue, Kumasi",
            instructions: "Leave at the door, Call when you arrive",
            fee: 5.00
        },
        driver: {
            name: "Kwame Asante",
            phone: "+233 54 987 6543",
            rating: 4.9,
            vehicle: "Honda CRV - GR 2341-23"
        },
        items: [
            {
                id: 1,
                name: "Jollof Rice with Chicken",
                quantity: 2,
                price: 25.00,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop"
            },
            {
                id: 2,
                name: "Chicken Fried Rice",
                quantity: 1,
                price: 18.50,
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop"
            }
        ],
        total: 73.50,
        paymentMethod: "Mobile Money"
    });

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Status progression
    const statusSteps = [
        { key: "placed", label: "Order Placed", icon: Receipt, completed: true },
        { key: "preparing", label: "Preparing", icon: ChefHat, completed: orderData.status !== "placed" },
        { key: "ready", label: "Ready for Pickup", icon: Package, completed: ["ready", "on_the_way", "delivered"].includes(orderData.status) },
        { key: "on_the_way", label: "On the Way", icon: Car, completed: ["on_the_way", "delivered"].includes(orderData.status) },
        { key: "delivered", label: "Delivered", icon: CheckCircle, completed: orderData.status === "delivered" }
    ];

    const getStatusMessage = () => {
        switch (orderData.status) {
            case "preparing":
                return "Your delicious meal is being prepared with care";
            case "ready":
                return "Your order is ready! Driver will pick it up soon";
            case "on_the_way":
                return "Your order is on its way to you";
            case "delivered":
                return "Order delivered! Hope you enjoyed your meal";
            default:
                return "Order confirmed and being processed";
        }
    };

    const getEstimatedTime = () => {
        const diff = orderData.estimatedDelivery.getTime() - currentTime.getTime();
        const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));

        if (orderData.status === "delivered") {
            return "Delivered";
        }

        if (minutes <= 0) {
            return "Any moment now";
        }

        return `${minutes} min${minutes > 1 ? 's' : ''}`;
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
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
                            <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
                            <p className="text-sm text-gray-600">{orderData.orderNumber}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Estimated delivery</div>
                        <div className="font-semibold text-orange-600">{getEstimatedTime()}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const OrderStatus = () => (
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
                    Placed at {formatTime(orderData.placedAt)} • Expected by {formatTime(orderData.estimatedDelivery)}
                </p>
            </div>

            {/* Progress Steps */}
            <div className="relative">
                <div className="flex justify-between items-center">
                    {statusSteps.map((step, index) => {
                        console.log(`Rendering step: ${step.label} (key: ${step.key}) index: ${index}`);
                        
                        const Icon = step.icon;
                        const isActive = step.key === orderData.status;
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
                            width: `${(statusSteps.findIndex(s => s.key === orderData.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const RestaurantInfo = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Restaurant Details</h3>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{orderData.restaurant.name}</h4>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{orderData.restaurant.rating}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{orderData.restaurant.address}</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Call</span>
                </button>
            </div>
        </div>
    );

    const DriverInfo = () => {
        if (!["on_the_way", "delivered"].includes(orderData.status)) return null;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Driver Details</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-lg">
                                {orderData.driver.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">{orderData.driver.name}</h4>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">{orderData.driver.rating}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{orderData.driver.vehicle}</p>
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

    const DeliveryInfo = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                Delivery Address
            </h3>
            <div className="space-y-3">
                <p className="text-gray-900">{orderData.delivery.address}</p>
                {orderData.delivery.instructions && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Instructions: </span>
                        {orderData.delivery.instructions}
                    </div>
                )}
                {orderData.status === "on_the_way" && (
                    <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors">
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">Track on Map</span>
                    </button>
                )}
            </div>
        </div>
    );

    const OrderItems = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
                {orderData.items.map(item => (
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
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className='text-black'>₵{(orderData.total - orderData.delivery.fee - 2.50).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className='text-black'>₵{orderData.delivery.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className='text-black'>₵2.50</span>
                </div>
                <div className="flex text-gray-600 justify-between font-semibold">
                    <span>Total</span>
                    <span className='text-black'>₵{orderData.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Paid via {orderData.paymentMethod}
                </div>
            </div>
        </div>
    );

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
        </div>
    );
};

export default TrackOrder;