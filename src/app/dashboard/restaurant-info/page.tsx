// src/app/dashboard/restaurant-info/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { ChefHat, Star, MapPin, Clock, Truck, Edit, Save, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - in a real application, this would come from an API
const mockRestaurantData = {
    id: 1,
    name: "Mama's Kitchen",
    cuisine: "Local Ghanaian Foods", // Updated to reflect new dropdown options
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "₵5.00",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop",
    specialty: "Authentic Jollof Rice",
    location: "Accra Central",
    minOrder: "₵20.00",
    description: "Serving the finest traditional Ghanaian dishes with a touch of homemade goodness. Our jollof rice is a local favorite!",
    contactEmail: "info@mamaskitchen.com",
    contactPhone: "+233 24 123 4567"
};

const RestaurantInfoPage = () => {
    const [restaurant, setRestaurant] = useState(mockRestaurantData);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRestaurant, setEditedRestaurant] = useState(mockRestaurantData);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setEditedRestaurant(restaurant);
    }, [restaurant]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // If canceling, revert changes
        if (isEditing) {
            setEditedRestaurant(restaurant);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRestaurant(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call to save data
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRestaurant(editedRestaurant); // Update main state with saved data
        setIsEditing(false);
        setIsLoading(false);
        alert("Restaurant information saved successfully!");
    };

    const generateMapUrl = (location: string) => {
        // Encode the location for use in a URL
        const encodedLocation = encodeURIComponent(location);
        return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ChefHat className="w-6 h-6 text-orange-600" />
                        <h1 className="text-xl font-bold text-gray-900">Restaurant Dashboard</h1>
                    </div>
                    <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="relative h-48 w-full">
                        <Image
                            src={restaurant.image}
                            alt={restaurant.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <h2 className="text-3xl font-bold text-white drop-shadow-lg">{restaurant.name}</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-900">Restaurant Details</h3>
                            {isEditing ? (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : <><Save className="mr-2 w-4 h-4" />Save Changes</>}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                                    >
                                        <XCircle className="mr-2 w-4 h-4" />Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEditToggle}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <Edit className="mr-2 w-4 h-4" />Edit Info
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedRestaurant.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                ) : (
                                    <p className="mt-1 text-lg text-gray-900">{restaurant.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                                {isEditing ? (
                                    <select
                                        name="cuisine"
                                        value={editedRestaurant.cuisine}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    >
                                        <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                        <option value="Foreign Foods">Foreign Foods</option>
                                    </select>
                                ) : (
                                    <p className="mt-1 text-lg text-gray-900">{restaurant.cuisine}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Specialty Dish</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="specialty"
                                        value={editedRestaurant.specialty}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                ) : (
                                    <p className="mt-1 text-lg text-gray-900">{restaurant.specialty}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={editedRestaurant.location}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                ) : (
                                    <a
                                        href={generateMapUrl(restaurant.location)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-lg text-gray-900 flex items-center hover:text-orange-600 transition-colors"
                                    >
                                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                        {restaurant.location}
                                    </a>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={editedRestaurant.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    ></textarea>
                                ) : (
                                    <p className="mt-1 text-lg text-gray-900">{restaurant.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-8 pt-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Operational Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="flex items-center text-gray-700">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                                    <span>Rating: {restaurant.rating} / 5.0</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estimated Delivery Time</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="deliveryTime"
                                            value={editedRestaurant.deliveryTime}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center mt-1 text-lg text-gray-900">
                                            <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                            <span>{restaurant.deliveryTime}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Delivery Fee</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="deliveryFee"
                                            value={editedRestaurant.deliveryFee}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center mt-1 text-lg text-gray-900">
                                            <Truck className="w-5 h-5 text-gray-500 mr-2" />
                                            <span>{restaurant.deliveryFee}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minimum Order</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="minOrder"
                                            value={editedRestaurant.minOrder}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg text-gray-900">{restaurant.minOrder}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-8 pt-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={editedRestaurant.contactEmail}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg text-gray-900">{restaurant.contactEmail}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={editedRestaurant.contactPhone}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg text-gray-900">{restaurant.contactPhone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Navigation Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/menu-management" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg text-center">
                        Manage Your Menu
                    </Link>
                    <Link href="/dashboard/order-management" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg text-center">
                        Manage Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfoPage;