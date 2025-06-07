// src/app/restaurant-setup/page.tsx
'use client';
import React, { useState } from 'react';
import { ChefHat, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';

const RestaurantSetupPage = () => {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    // Initialize state with the new interface fields
    const [restaurantInfo, setRestaurantInfo] = useState({
        name: "",
        cuisine: "Local Ghanaian Foods",
        specialty: "",
        location: "",
        description: "",
        deliveryTime: "25-35 min",
        deliveryFee: "₵5.00",
        minOrder: "₵20.00",
        phone: "",
        address: "",
        isOpen: true,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop"
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setRestaurantInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!user) {
            alert("You must be logged in to set up a restaurant.");
            setIsLoading(false);
            router.push('/login');
            return;
        }

        if (!restaurantInfo.name || !restaurantInfo.location || !restaurantInfo.address || !restaurantInfo.phone) {
            alert("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            const newRestaurantData: RestaurantInfoInterface = {
                ...restaurantInfo,
                id: user.uid, // The document ID is the user's UID
                userId: user.uid,
                rating: 0, // Default rating for new restaurants
                featured: false, // Not featured by default
            };

            // Use the user's UID as the document ID in the 'restaurants' collection
            await setDoc(doc(db, "restaurants", user.uid), newRestaurantData);

            alert("Restaurant information saved successfully!");
            // You can also update the redux state here if needed, or rely on a fresh fetch next time.
            router.push('/dashboard/restaurant-info');

        } catch (error) {
            console.error("Error saving restaurant info:", error);
            alert("Failed to save restaurant information. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                            <input id="name" name="name" type="text" required value={restaurantInfo.name} onChange={handleChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        {/* Cuisine Type */}
                        <div>
                            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                            <select id="cuisine" name="cuisine" value={restaurantInfo.cuisine} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                <option value="Foreign Foods">Foreign Foods</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Contact Phone <span className="text-red-500">*</span>
                            </label>
                            <input id="phone" name="phone" type="tel" required value={restaurantInfo.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        {/* Location (e.g., City/Town) */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location (City/Town) <span className="text-red-500">*</span>
                            </label>
                            <input id="location" name="location" type="text" required value={restaurantInfo.location} onChange={handleChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        {/* Full Address */}
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Full Address <span className="text-red-500">*</span>
                            </label>
                            <input id="address" name="address" type="text" required value={restaurantInfo.address} onChange={handleChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" rows={3} value={restaurantInfo.description} onChange={handleChange} className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"></textarea>
                        </div>

                        {/* Is Open */}
                        <div>
                            <label htmlFor="isOpen" className="block text-sm font-medium text-gray-700">Operating Status</label>
                            <div className="mt-2 flex items-center">
                                <input id="isOpen" name="isOpen" type="checkbox" checked={restaurantInfo.isOpen} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-900">Open for business</label>
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save and Continue</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantSetupPage;