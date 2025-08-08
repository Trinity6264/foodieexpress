// src/app/restaurant-setup/page.tsx
'use client';
import React, { useState } from 'react';
import { ChefHat, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { RestaurantInfoInterface, OperatingHours } from '@/interfaces/RestaurantInfoInterface';
import { setRestaurantInfo } from '@/store/features/authSlice';

const initialOperatingHours: OperatingHours[] = [
    { day: 'Monday', openTime: '09:00', closeTime: '22:00', isOpen: true },
    { day: 'Tuesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
    { day: 'Wednesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
    { day: 'Thursday', openTime: '09:00', closeTime: '22:00', isOpen: true },
    { day: 'Friday', openTime: '09:00', closeTime: '23:00', isOpen: true },
    { day: 'Saturday', openTime: '10:00', closeTime: '23:00', isOpen: true },
    { day: 'Sunday', openTime: '10:00', closeTime: '21:00', isOpen: false },
];

const RestaurantSetupPage = () => {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();


    const [restaurantInformation, setRestaurantInformation] = useState({
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
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop",
        operatingHours: initialOperatingHours,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setRestaurantInformation(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleHoursChange = (index: number, field: keyof OperatingHours, value: string | boolean) => {
        const updatedHours = [...restaurantInformation.operatingHours];
        updatedHours[index] = { ...updatedHours[index], [field]: value } as OperatingHours;
        setRestaurantInformation(prev => ({ ...prev, operatingHours: updatedHours }));
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

        try {
            const newRestaurantData: RestaurantInfoInterface = {
                ...restaurantInformation,
                id: user.uid,
                userId: user.uid,
                rating: 0,
                featured: false,
                isVendor: true,
            };

            await setDoc(doc(db, "restaurants", user.uid), newRestaurantData);

            alert("Restaurant information saved successfully!");
            dispatch(setRestaurantInfo({ ...newRestaurantData }));
            router.push('/dashboard/restaurant-info');
            return;
        } catch (error) {
            console.error("Error saving restaurant info:", error);
            alert("Failed to save restaurant information.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full space-y-8 rounded-lg bg-white p-8 shadow-xl">
                <div className="text-center">
                    <ChefHat className="mx-auto h-16 w-16 text-orange-600 mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-900">Tell us about your Restaurant</h2>
                    <p className="mt-2 text-sm text-gray-600">This is a one-time setup to get your restaurant ready.</p>
                </div>

                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {/* Restaurant Info Fields */}
                        <div className="md:col-span-2"><h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3></div>
                        <input name="name" placeholder="Restaurant Name *" required value={restaurantInformation.name} onChange={handleInfoChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        <select name="cuisine" value={restaurantInformation.cuisine} onChange={handleInfoChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black"><option>Local Ghanaian Foods</option><option>Foreign Foods</option><option>Both</option></select>
                        <input name="phone" placeholder="Contact Phone *" type="tel" required value={restaurantInformation.phone} onChange={handleInfoChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        <input name="location" placeholder="Location (City/Town) *" required value={restaurantInformation.location} onChange={handleInfoChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        <div className="md:col-span-2"><input name="address" placeholder="Full Address *" required value={restaurantInformation.address} onChange={handleInfoChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
                        <div className="md:col-span-2"><textarea name="description" placeholder="Description" rows={3} value={restaurantInformation.description} onChange={handleInfoChange} className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea></div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Operating Hours</h3>
                        {restaurantInformation.operatingHours.map((hour, index) => (
                            <div key={hour.day} className="grid grid-cols-4 gap-4 items-center">
                                <label className="font-medium text-gray-700">{hour.day}</label>
                                <input type="time" value={hour.openTime} disabled={!hour.isOpen} onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)} className="w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 disabled:bg-gray-100" />
                                <input type="time" value={hour.closeTime} disabled={!hour.isOpen} onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)} className="w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 disabled:bg-gray-100" />
                                <div className="flex items-center justify-end">
                                    <input type="checkbox" checked={hour.isOpen} onChange={(e) => handleHoursChange(index, 'isOpen', e.target.checked)} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                                    <label className="ml-2 text-sm text-gray-900">Open</label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="group relative flex w-full justify-center rounded-md bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save and Continue</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantSetupPage;