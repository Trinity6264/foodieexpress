'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Edit, Save, XCircle, Phone, MapPin, FileText, Tag, Clock, Truck, CircleDollarSign, Power } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { setRestaurantInfo, logout } from '@/store/features/authSlice';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';

// Define a type for the EditItem component's props
interface EditItemProps {
    label: string;
    name: keyof RestaurantInfoInterface; // Use keyof for better type safety
    value: string | number | boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    rows?: number;
}

const RestaurantInfoPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { user, restaurantInfo } = useAppSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<RestaurantInfoInterface | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (restaurantInfo) {
            setEditedData(restaurantInfo);
        }
    }, [user, restaurantInfo, router]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing && restaurantInfo) {
            setEditedData(restaurantInfo);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editedData) return;
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setEditedData({ ...editedData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSave = async () => {
        if (!editedData || !user) return;
        setIsSaving(true);
        try {
            const restaurantDocRef = doc(db, 'restaurants', user.uid);
            await setDoc(restaurantDocRef, editedData, { merge: true });

            dispatch(setRestaurantInfo(editedData));
            setIsEditing(false);
            alert("Restaurant information updated successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Failed to update information.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    }

    if (!restaurantInfo || !editedData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | boolean }) => (
        // ... implementation remains the same
        <div>
            <label className="text-sm font-medium text-gray-500 flex items-center">
                {icon}
                <span className="ml-2">{label}</span>
            </label>
            <p className="mt-1 text-lg text-gray-900">{String(value)}</p>
        </div>
    );

    // Use the new EditItemProps interface here
    const EditItem = ({ label, name, value, onChange, type = "text", rows = 1 }: EditItemProps) => (
        <div className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {type === 'textarea' ? (
                <textarea id={name} name={name} value={String(value)} onChange={onChange} rows={rows} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-black px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
            ) : type === 'checkbox' ? (
                <div className="mt-2">
                    <input id={name} name={name} type="checkbox" checked={Boolean(value)} onChange={onChange} className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                </div>
            ) : (
                        <input id={name} name={name} type={type} value={String(value)} onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black focus:ring-orange-500 focus:border-orange-500" />
            )}
        </div>
    );

    return (
        // ... The rest of the JSX remains the same
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <ChefHat className="w-8 h-8 mr-3 text-orange-600" />
                        Restaurant Dashboard
                    </h1>
                    <button onClick={handleLogout} className="text-sm cursor-pointer font-medium text-gray-600 hover:text-orange-600 flex items-center">
                        <Power className="w-4 h-4 mr-1" />
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-48 sm:h-64 w-full">
                        <Image src={restaurantInfo.image} alt={restaurantInfo.name} fill className="object-cover" />
                    </div>
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{restaurantInfo.name}</h2>
                                <p className="text-gray-500">{restaurantInfo.location}</p>
                            </div>
                            {isEditing ? (
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={handleSave} disabled={isSaving} className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 ${isSaving && 'cursor-none'} cursor-pointer text-sm font-semibold`}>
                                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save</>}
                                    </button>
                                    <button onClick={handleEditToggle} className="p-2 bg-gray-200  cursor-pointer rounded-lg hover:bg-gray-300">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                    <button onClick={handleEditToggle} className="flex cursor-pointer items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold flex-shrink-0">
                                    <Edit className="w-4 h-4 mr-2" />Edit Info
                                </button>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <EditItem label="Restaurant Name" name="name" value={editedData.name} onChange={handleChange} />
                                    <EditItem label="Phone" name="phone" value={editedData.phone} onChange={handleChange} />
                                    <EditItem label="Location (e.g., Accra)" name="location" value={editedData.location} onChange={handleChange} />
                                    <EditItem label="Cuisine Type" name="cuisine" value={editedData.cuisine} onChange={handleChange} />
                                    <EditItem label="Full Address" name="address" value={editedData.address} onChange={handleChange} type="textarea" rows={2} />
                                    <EditItem label="Description" name="description" value={editedData.description} onChange={handleChange} type="textarea" rows={3} />
                                    <EditItem label="Specialty Dish" name="specialty" value={editedData.specialty} onChange={handleChange} />
                                    <EditItem label="Delivery Time (e.g., 25-35 min)" name="deliveryTime" value={editedData.deliveryTime} onChange={handleChange} />
                                    <EditItem label="Delivery Fee (e.g., ₵5.00)" name="deliveryFee" value={editedData.deliveryFee} onChange={handleChange} />
                                    <EditItem label="Minimum Order (e.g., ₵20.00)" name="minOrder" value={editedData.minOrder} onChange={handleChange} />
                                    <div className="flex items-center space-x-8">
                                        <EditItem label="Open for Business" name="isOpen" value={editedData.isOpen} onChange={handleChange} type="checkbox" />
                                        <EditItem label="Featured" name="featured" value={editedData.featured} onChange={handleChange} type="checkbox" />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <DetailItem icon={<Phone size={16} />} label="Contact Phone" value={restaurantInfo.phone} />
                                    <DetailItem icon={<MapPin size={16} />} label="Address" value={restaurantInfo.address} />
                                    <DetailItem icon={<FileText size={16} />} label="Description" value={restaurantInfo.description} />
                                    <DetailItem icon={<Tag size={16} />} label="Cuisine" value={restaurantInfo.cuisine} />
                                    <DetailItem icon={<Clock size={16} />} label="Delivery Time" value={restaurantInfo.deliveryTime} />
                                    <DetailItem icon={<Truck size={16} />} label="Delivery Fee" value={restaurantInfo.deliveryFee} />
                                    <DetailItem icon={<CircleDollarSign size={16} />} label="Minimum Order" value={restaurantInfo.minOrder} />
                                    <DetailItem icon={<Power size={16} />} label="Status" value={restaurantInfo.isOpen ? "Open" : "Closed"} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation to other dashboard pages */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/menu-management" className="block bg-blue-600 text-white text-center px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
                        Manage Your Menu
                    </Link>
                    <Link href="/dashboard/order-management" className="block bg-teal-600 text-white text-center px-6 py-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg">
                        Manage Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfoPage;