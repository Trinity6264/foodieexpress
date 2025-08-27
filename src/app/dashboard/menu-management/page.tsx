'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, PlusCircle, Edit, Trash2, Save, AlertTriangle, UtensilsCrossed } from 'lucide-react';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';
import ImageUploadInput from '@/components/ImageUploadInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, clearMenu } from '@/store/features/menuSlice';

// A blank item structure for the 'Add New' form
const blankFormState: Omit<MenuItemInterface, 'id'> = {
    name: '',
    description: '',
    price: 0,
    category: 'Local Ghanaian Foods',
    image: '',
    popular: false,
    spicy: false,
};

const MenuManagementPage = () => {
    const dispatch = useAppDispatch();
    const { restaurantInfo } = useAppSelector((state) => state.auth);
    const { items: menuItems, status, error } = useAppSelector((state) => state.menu);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItemInterface | null>(null);
    const [formData, setFormData] = useState<Omit<MenuItemInterface, 'id'>>(blankFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch menu items when the component loads if they haven't been fetched yet
        if (restaurantInfo && status === 'idle') {
            dispatch(fetchMenuItems(restaurantInfo.id));
        }

        // If restaurantInfo becomes null (e.g., user logs out), clear menu state
        if (!restaurantInfo) {
            dispatch(clearMenu());
        }

        return () => {
            // Clear the menu when leaving the page to avoid showing another merchant's menu
            dispatch(clearMenu());
        };
    }, [restaurantInfo, status, dispatch]);

    const handleShowAddForm = () => {
        setEditingItem(null);
        setFormData(blankFormState);
        setSelectedFile(null);
        setIsFormVisible(true);
    };

    const handleEditClick = (item: MenuItemInterface) => {
        setEditingItem(item);
        setFormData(item);
        setSelectedFile(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurantInfo) return;

        setIsSubmitting(true);

        if (editingItem) {
            // Logic to update an existing item
            await dispatch(updateMenuItem({
                restaurantId: restaurantInfo.id,
                item: { ...formData, id: editingItem.id },
                newImageFile: selectedFile
            }));
        } else {
            // Logic to add a new item
            if (!selectedFile) {
                alert("Please select an image for the new item.");
                setIsSubmitting(false);
                return;
            }
            await dispatch(addMenuItem({
                restaurantId: restaurantInfo.id,
                itemData: formData,
                imageFile: selectedFile
            }));
        }

        setIsSubmitting(false);
        setIsFormVisible(false);
    };

    const handleDelete = async (item: MenuItemInterface) => {
        if (!restaurantInfo || !window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

        await dispatch(deleteMenuItem({ restaurantId: restaurantInfo.id, itemId: item.id, imageUrl: item.image }));
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
        }

        if (status === 'failed') {
            return (
                <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium">Error</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (status === 'succeeded' && menuItems.length === 0) {
            return (
                <div className="text-center py-16">
                    <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Your menu is empty</h3>
                    <p className="text-gray-500 mt-2">Click &quot;Add New Item&quot; to get started!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                        <div className="relative">
                            <Image src={item.image} alt={item.name} width={300} height={200} className="w-full h-48 object-cover" />
                            {item.popular && <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                                {item.spicy && <span title="Spicy">🌶️</span>}
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-10">{item.description}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xl font-bold text-gray-900">₵{item.price.toFixed(2)}</div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEditClick(item)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(item)} className="p-2 rounded-full text-red-500 hover:bg-red-100"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center"><ChefHat className="w-6 h-6 text-orange-600 mr-2" />Manage Menu</h1>
                    <Link href="/dashboard/restaurant-info" className="text-sm font-semibold text-orange-600 hover:underline">Back to Dashboard</Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Your Menu Items</h2>
                    {!isFormVisible && <button onClick={handleShowAddForm} className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 font-semibold flex items-center shadow-sm"><PlusCircle className="mr-2 w-5 h-5" /> Add New Item</button>}
                </div>

                {isFormVisible && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required className="p-2 border text-black rounded-md" />
                            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price (₵)" required className="p-2 border text-black rounded-md" />
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-2 text-black border rounded-md md:col-span-2" rows={3} />
                            <select name="category" value={formData.category} onChange={handleChange} className="p-2 border text-black rounded-md">
                                <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                <option value="Foreign Foods">Foreign Foods</option>
                            </select>
                            <div className="md:col-span-2">
                                <ImageUploadInput maxFiles={3} onImagesSelected={(files) => setSelectedFile(files.length > 0 ? files[0] : null)} currentImages={editingItem ? [editingItem.image] : []} />
                            </div>
                            <div className="flex items-center  space-x-4">
                                <label className="flex text-black items-center"><input name="popular" type="checkbox" checked={formData.popular} onChange={handleChange} className="h-4 w-4 rounded mr-2" />Popular</label>
                                <label className="flex text-black items-center"><input name="spicy" type="checkbox" checked={formData.spicy} onChange={handleChange} className="h-4 w-4 rounded mr-2" />Spicy</label>
                            </div>
                            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold disabled:opacity-50 flex items-center">
                                    {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2 inline" />{editingItem ? 'Save Changes' : 'Add Item'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
};

export default MenuManagementPage;