// src/app/onboarding/restaurant-setup/page.tsx
'use client';
import React, { useState } from 'react';
import { ChefHat, Save } from 'lucide-react';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RestaurantSetupPage = () => {
    const router = useRouter();
    const [restaurantInfo, setRestaurantInfo] = useState({
        name: "",
        cuisine: "Local Ghanaian Foods", // Default to Local Ghanaian Foods
        specialty: "",
        location: "",
        description: "",
        deliveryTime: "25-35 min",
        deliveryFee: "₵5.00",
        minOrder: "₵20.00",
        contactEmail: "",
        contactPhone: "",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop" // Placeholder image
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRestaurantInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!restaurantInfo.name || !restaurantInfo.location || !restaurantInfo.contactEmail) {
            alert("Please fill in all required fields: Restaurant Name, Location, and Contact Email.");
            setIsLoading(false);
            return;
        }

        // Simulate API call to save initial restaurant data
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, you'd send restaurantInfo to your backend
        // and store it associated with the newly registered user.
        console.log("Saving initial restaurant info:", restaurantInfo);

        alert("Restaurant information saved successfully!");
        router.push('/dashboard/restaurant-info'); // Redirect to dashboard after setup
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 rounded-lg bg-white p-8 shadow-xl">
                <div className="text-center">
                    <ChefHat className="mx-auto h-16 w-16 text-orange-600 mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-900">Tell us about your Restaurant</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        This is a one-time setup to get your restaurant ready on FoodieExpress.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {/* Restaurant Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Restaurant Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={restaurantInfo.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>

                        {/* Cuisine Type */}
                        <div>
                            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                                Cuisine Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="cuisine"
                                name="cuisine"
                                required
                                value={restaurantInfo.cuisine}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            >
                                <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                <option value="Foreign Foods">Foreign Foods</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>

                        {/* Specialty Dish */}
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                Specialty Dish
                            </label>
                            <input
                                id="specialty"
                                name="specialty"
                                type="text"
                                value={restaurantInfo.specialty}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={restaurantInfo.location}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={restaurantInfo.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            ></textarea>
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                                Contact Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                required
                                value={restaurantInfo.contactEmail}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                                Contact Phone
                            </label>
                            <input
                                id="contactPhone"
                                name="contactPhone"
                                type="tel"
                                value={restaurantInfo.contactPhone}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white mr-3"></div>
                                    Saving...
                                </div>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Save Restaurant Information
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantSetupPage;