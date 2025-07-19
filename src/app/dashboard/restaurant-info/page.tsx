'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Edit, Save, XCircle, Phone, MapPin, FileText, Tag, Clock, Truck, CircleDollarSign, Power, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { setRestaurantInfo, logout } from '@/store/features/authSlice';
import { RestaurantInfoInterface, OperatingHours } from '@/interfaces/RestaurantInfoInterface';

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | boolean }) => (
    <div>
        <label className="text-sm font-medium text-gray-500 flex items-center">{icon}<span className="ml-2">{label}</span></label>
        <p className="mt-1 text-lg text-gray-900">{String(value)}</p>
    </div>
);

// Define a strict type for EditItem's props to remove 'any'
interface EditItemProps {
    label: string;
    name: keyof RestaurantInfoInterface;
    value: string | number | boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    rows?: number;
}


// Use the new EditItemProps interface
const EditItem = ({ label, name, value, onChange, type = "text", rows = 1 }: EditItemProps) => (
    <div className={type === 'textarea' ? 'md:col-span-2' : ''}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'textarea' ? (
            <textarea id={name} name={name} value={String(value)} onChange={onChange} rows={rows} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-black px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
        ) : (
            <input id={name} name={name} type={type} value={String(value)} onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black focus:ring-orange-500 focus:border-orange-500" />
        )}
    </div>
);


const RestaurantInfoPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, restaurantInfo } = useAppSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<RestaurantInfoInterface | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (restaurantInfo) {
            const dataWithHours = {
                ...restaurantInfo,
                operatingHours: Array.isArray(restaurantInfo.operatingHours) ? restaurantInfo.operatingHours : [],
            };
            setEditedData(dataWithHours);
        }
    }, [restaurantInfo]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing && restaurantInfo) setEditedData(restaurantInfo);
    };

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editedData) return;
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setEditedData({ ...editedData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleHoursChange = (index: number, field: keyof OperatingHours, value: string | boolean) => {
        if (!editedData) return;
        const updatedHours = [...editedData.operatingHours];
        const dayToUpdate = { ...updatedHours[index], [field]: value };
        updatedHours[index] = dayToUpdate;
        setEditedData({ ...editedData, operatingHours: updatedHours });
    };

    const handleSave = async () => {
        if (!editedData || !user) return;
        setIsSaving(true);
        try {
            const restaurantDocRef = doc(db, 'restaurants', user.uid);
            await setDoc(restaurantDocRef, editedData, { merge: true });
            dispatch(setRestaurantInfo(editedData));
            setIsEditing(false);
            alert("Update successful!");
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

    // Add a guard clause to ensure restaurantInfo and editedData are not null.
    // This satisfies TypeScript and prevents rendering errors.
    if (!restaurantInfo || !editedData) {
        return null; // The layout component will show a loader
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center"><ChefHat className="w-8 h-8 mr-3 text-orange-600" />Restaurant Dashboard</h1>
                    <button onClick={handleLogout} className="text-sm cursor-pointer font-medium text-gray-600 hover:text-orange-600 flex items-center"><Power className="w-4 h-4 mr-1" />Logout</button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-48 sm:h-64 w-full">
                        <Image src={restaurantInfo.image} alt={restaurantInfo.name} fill className="object-cover" />
                    </div>
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? editedData.name : restaurantInfo.name}</h2>
                                <p className="text-gray-500">{isEditing ? editedData.location : restaurantInfo.location}</p>
                            </div>
                            {isEditing ? (
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer text-sm font-semibold">
                                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                                    </button>
                                    <button onClick={handleEditToggle} className="p-2 bg-gray-200 cursor-pointer rounded-lg hover:bg-gray-300"><XCircle className="w-5 h-5" /></button>
                                </div>
                            ) : (
                                <button onClick={handleEditToggle} className="flex cursor-pointer items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold flex-shrink-0">
                                    <Edit className="w-4 h-4 mr-2" />Edit Info
                                </button>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            {isEditing ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <EditItem label="Restaurant Name" name="name" value={editedData.name} onChange={handleInfoChange} />
                                        <EditItem label="Phone" name="phone" value={editedData.phone} onChange={handleInfoChange} />
                                        <EditItem label="Location (e.g., Accra)" name="location" value={editedData.location} onChange={handleInfoChange} />
                                        <div>
                                            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                                            <select id="cuisine" name="cuisine" value={editedData.cuisine} onChange={handleInfoChange} className="mt-1 block w-full border text-black border-gray-300 rounded-md py-2 px-3">
                                                <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                                <option value="Foreign Foods">Foreign Foods</option>
                                                <option value="Both">Both</option>
                                            </select>
                                        </div>
                                        <EditItem label="Full Address" name="address" value={editedData.address} onChange={handleInfoChange} type="textarea" />
                                        <EditItem label="Description" name="description" value={editedData.description} onChange={handleInfoChange} type="textarea" rows={3} />
                                        <EditItem label="Specialty Dish" name="specialty" value={editedData.specialty} onChange={handleInfoChange} />
                                        <EditItem label="Delivery Time (e.g., 25-35 min)" name="deliveryTime" value={editedData.deliveryTime} onChange={handleInfoChange} />
                                        <EditItem label="Delivery Fee (e.g., ₵5.00)" name="deliveryFee" value={editedData.deliveryFee} onChange={handleInfoChange} />
                                        <EditItem label="Minimum Order (e.g., ₵20.00)" name="minOrder" value={editedData.minOrder} onChange={handleInfoChange} />
                                        <div className="flex items-center space-x-2 pt-6">
                                            <input id="isOpen" name="isOpen" type="checkbox" checked={editedData.isOpen} onChange={handleInfoChange} className="h-4 w-4 rounded" />
                                            <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">Open for Business (Overall)</label>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Operating Hours</h3>
                                        <div className="space-y-4">
                                            {editedData.operatingHours?.map((hour, index) => (
                                                <div key={hour.day} className="grid grid-cols-4 gap-4 items-center">
                                                    <label className="font-medium text-gray-700">{hour.day}</label>
                                                    <input type="time" value={hour.openTime} disabled={!hour.isOpen} onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)} className="w-full border text-black border-gray-300 rounded-md py-2 px-3 disabled:bg-gray-100" />
                                                    <input type="time" value={hour.closeTime} disabled={!hour.isOpen} onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)} className="w-full border text-black border-gray-300 rounded-md py-2 px-3 disabled:bg-gray-100" />
                                                    <div className="flex items-center justify-end"><input type="checkbox" checked={hour.isOpen} onChange={(e) => handleHoursChange(index, 'isOpen', e.target.checked)} className="h-4 w-4 rounded" /><label className="ml-2 text-sm text-gray-700">Open</label></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <DetailItem icon={<Phone size={16} />} label="Contact Phone" value={restaurantInfo.phone} />
                                        <DetailItem icon={<MapPin size={16} />} label="Address" value={restaurantInfo.address} />
                                        <div className="md:col-span-2"><DetailItem icon={<FileText size={16} />} label="Description" value={restaurantInfo.description} /></div>
                                        <DetailItem icon={<Tag size={16} />} label="Cuisine" value={restaurantInfo.cuisine} />
                                        <DetailItem icon={<Clock size={16} />} label="Delivery Time" value={restaurantInfo.deliveryTime} />
                                        <DetailItem icon={<Truck size={16} />} label="Delivery Fee" value={restaurantInfo.deliveryFee} />
                                        <DetailItem icon={<CircleDollarSign size={16} />} label="Minimum Order" value={restaurantInfo.minOrder} />
                                        <DetailItem icon={<Power size={16} />} label="Status" value={restaurantInfo.isOpen ? "Open" : "Closed"} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><CalendarDays size={18} className="mr-2" />Weekly Hours</h3>
                                        <div className="space-y-2">
                                            {restaurantInfo.operatingHours?.map(day => (
                                                <div key={day.day} className={`flex justify-between p-2 rounded-md ${day.isOpen ? 'bg-green-50' : 'bg-red-50'}`}>
                                                    <span className={`font-medium ${day.isOpen ? 'text-green-800' : 'text-red-800'}`}>{day.day}</span>
                                                    <span className={day.isOpen ? 'text-green-800' : 'text-red-800'}>{day.isOpen ? `${day.openTime} - ${day.closeTime}` : 'Closed'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/menu-management" className="block bg-blue-600 text-white text-center px-6 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg">Manage Menu</Link>
                    <Link href="/dashboard/order-management" className="block bg-teal-600 text-white text-center px-6 py-4 rounded-lg hover:bg-teal-700 font-semibold text-lg">Manage Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfoPage;