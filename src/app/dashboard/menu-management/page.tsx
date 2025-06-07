// src/app/dashboard/menu-management/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';
import ImageUploadInput from '@/components/ImageUploadInput'; // Import the new component

// Mock menu items for demonstration
const mockMenuItems: MenuItemInterface[] = [
    {
        id: 1,
        name: "Jollof Rice with Chicken",
        description: "Aromatic rice cooked in rich tomato sauce with tender grilled chicken",
        price: 25.00,
        category: 'Local Ghanaian Foods',
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
        popular: true,
        spicy: true
    },
    {
        id: 2,
        name: "Banku with Tilapia",
        description: "Traditional fermented corn dough served with grilled tilapia and pepper sauce",
        price: 30.00,
        category: 'Local Ghanaian Foods',
        image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&h=200&fit=crop",
        popular: false,
        spicy: true
    },
    {
        id: 3,
        name: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish with a rich meaty tomato sauce",
        price: 35.00,
        category: 'Foreign Foods',
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
        popular: true,
        spicy: false
    },
];

const MenuManagementPage = () => {
    const [menuItems, setMenuItems] = useState<MenuItemInterface[]>(mockMenuItems);
    const [editingItem, setEditingItem] = useState<MenuItemInterface | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newItem, setNewItem] = useState<Omit<MenuItemInterface, 'id'>>({
        name: '',
        description: '',
        price: 0,
        category: 'Local Ghanaian Foods',
        image: '', // This will store the temporary URL for preview
        popular: false,
        spicy: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    // State to hold the actual File objects for new and edited items
    const [selectedNewFile, setSelectedNewFile] = useState<File | null>(null);
    const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);


    // Cleanup Object URLs when component unmounts or state changes
    useEffect(() => {
        return () => {
            if (selectedNewFile && newItem.image.startsWith('blob:')) {
                URL.revokeObjectURL(newItem.image);
            }
            if (selectedEditFile && editingItem?.image && editingItem.image.startsWith('blob:')) {
                URL.revokeObjectURL(editingItem.image);
            }
        };
    }, [newItem.image, editingItem?.image, selectedNewFile, selectedEditFile]);


    const handleEditClick = (item: MenuItemInterface) => {
        setEditingItem({ ...item });
        setIsAddingNew(false);
        setSelectedEditFile(null); // Clear selected file for edit
    };

    const handleCancelEdit = () => {
        // Revoke temporary URLs if they exist before clearing state
        if (newItem.image.startsWith('blob:')) {
            URL.revokeObjectURL(newItem.image);
        }
        if (editingItem?.image && editingItem.image.startsWith('blob:')) {
            URL.revokeObjectURL(editingItem.image);
        }

        setEditingItem(null);
        setIsAddingNew(false);
        setNewItem({
            name: '',
            description: '',
            price: 0,
            category: 'Local Ghanaian Foods',
            image: '',
            popular: false,
            spicy: false,
        });
        setSelectedNewFile(null);
        setSelectedEditFile(null);
    };

    const handleSaveItem = async () => {
        if (!editingItem) return;

        setIsLoading(true);
        let updatedImageUrl = editingItem.image; // Start with current image URL

        // If a new file was selected for editing, update the image URL
        if (selectedEditFile) {
            // Revoke old preview URL if it was a temporary blob URL
            if (editingItem.image.startsWith('blob:')) {
                URL.revokeObjectURL(editingItem.image);
            }
            updatedImageUrl = URL.createObjectURL(selectedEditFile); // Create new temporary URL
        } else if (!editingItem.image) {
            alert("Please select an image for the menu item.");
            setIsLoading(false);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        // Update the editingItem state with the new image URL before saving to menuItems
        const finalEditedItem = { ...editingItem, image: updatedImageUrl };
        setEditingItem(finalEditedItem);

        setMenuItems(prevItems =>
            prevItems.map(item =>
                item.id === finalEditedItem.id ? finalEditedItem : item
            )
        );
        setSelectedEditFile(null);
        setIsLoading(false);
        alert("Menu item updated successfully!");
    };

    const handleDeleteItem = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            setMenuItems(prevItems => {
                const itemToDelete = prevItems.find(item => item.id === id);
                if (itemToDelete && itemToDelete.image.startsWith('blob:')) {
                    URL.revokeObjectURL(itemToDelete.image); // Revoke temporary URL
                }
                return prevItems.filter(item => item.id !== id);
            });

            setIsLoading(false);
            alert("Menu item deleted successfully!");
        }
    };

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.description || newItem.price <= 0 || !selectedNewFile) {
            alert("Please fill in all required fields and select an image.");
            return;
        }

        setIsLoading(true);
        // In a real app, you'd upload selectedNewFile here and get a permanent URL
        const tempImageUrl = URL.createObjectURL(selectedNewFile); // Use temporary URL for preview

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
        setMenuItems(prevItems => [...prevItems, { ...newItem, id: newId, image: tempImageUrl }]);
        setNewItem({
            name: '',
            description: '',
            price: 0,
            category: 'Local Ghanaian Foods',
            image: '',
            popular: false,
            spicy: false,
        });
        setSelectedNewFile(null);
        setIsAddingNew(false);
        setIsLoading(false);
        alert("Menu item added successfully!");
    };

    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setNewItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setEditingItem(prev => ({
            ...prev!,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ChefHat className="w-6 h-6 text-orange-600" />
                        <h1 className="text-xl font-bold text-gray-900">Manage Menu</h1>
                    </div>
                    <Link href="/dashboard/restaurant-info" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Your Menu Items</h2>
                    <button
                        onClick={() => {
                            setIsAddingNew(true);
                            setEditingItem(null);
                            setNewItem({
                                name: '',
                                description: '',
                                price: 0,
                                category: 'Local Ghanaian Foods',
                                image: '',
                                popular: false,
                                spicy: false,
                            });
                            setSelectedNewFile(null); // Reset file selection for new item
                        }}
                        className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center"
                    >
                        <PlusCircle className="mr-2 w-5 h-5" /> Add New Item
                    </button>
                </div>

                {isAddingNew && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-orange-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Menu Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleNewItemChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₵)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleNewItemChange}
                                    step="0.01"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleNewItemChange}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={newItem.category}
                                    onChange={handleNewItemChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                    <option value="Foreign Foods">Foreign Foods</option>
                                </select>
                            </div>
                            {/* Image Upload Input for new item */}
                            <div className="md:col-span-2">
                                <ImageUploadInput
                                    maxFiles={3} // Assuming only one image per menu item
                                    onImagesSelected={(files) => {
                                        if (files.length > 0) {
                                            setSelectedNewFile(files[0]);
                                            setNewItem(prev => ({ ...prev, image: URL.createObjectURL(files[0]) }));
                                        } else {
                                            setSelectedNewFile(null);
                                            setNewItem(prev => ({ ...prev, image: '' }));
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex items-center space-x-4 md:col-span-2">
                                <div className="flex items-center">
                                    <input
                                        id="popular"
                                        name="popular"
                                        type="checkbox"
                                        checked={newItem.popular}
                                        onChange={handleNewItemChange}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">Popular</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="spicy"
                                        name="spicy"
                                        type="checkbox"
                                        checked={newItem.spicy}
                                        onChange={handleNewItemChange}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="spicy" className="ml-2 block text-sm text-gray-900">Spicy</label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                disabled={isLoading}
                            >
                                <XCircle className="mr-2 w-4 h-4 inline" /> Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Adding...' : <><PlusCircle className="mr-2 w-4 h-4 inline" /> Add Item</>}
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.length === 0 && !isAddingNew ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-600">No menu items added yet. Click &quot;Add New Item&quot; to get started!</p>
                        </div>
                    ) : (
                        menuItems.map(item => (
                            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                {editingItem?.id === item.id ? (
                                    // Edit form for the item
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">Edit Item</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input type="text" name="name" value={editingItem.name} onChange={handleEditItemChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Price (₵)</label>
                                                <input type="number" name="price" value={editingItem.price} onChange={handleEditItemChange} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea name="description" value={editingItem.description} onChange={handleEditItemChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2"></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <select
                                                    name="category"
                                                    value={editingItem.category}
                                                    onChange={handleEditItemChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2"
                                                >
                                                    <option value="Local Ghanaian Foods">Local Ghanaian Foods</option>
                                                    <option value="Foreign Foods">Foreign Foods</option>
                                                </select>
                                            </div>
                                            {/* Image Upload Input for editing item */}
                                            <div>
                                                <ImageUploadInput
                                                    maxFiles={1}
                                                    currentImages={editingItem ? [editingItem.image] : []} // Pass existing image URL
                                                    onImagesSelected={(files) => {
                                                        if (files.length > 0) {
                                                            setSelectedEditFile(files[0]);
                                                            // Temporarily update image for preview
                                                            setEditingItem(prev => prev ? ({ ...prev, image: URL.createObjectURL(files[0]) }) : null);
                                                        } else {
                                                            setSelectedEditFile(null);
                                                            // If all files removed, clear the image.
                                                            setEditingItem(prev => prev ? ({ ...prev, image: '' }) : null);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <input type="checkbox" id={`popular-${item.id}`} name="popular" checked={editingItem.popular} onChange={handleEditItemChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                    <label htmlFor={`popular-${item.id}`} className="ml-2 block text-sm text-gray-900">Popular</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" id={`spicy-${item.id}`} name="spicy" checked={editingItem.spicy} onChange={handleEditItemChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                    <label htmlFor={`spicy-${item.id}`} className="ml-2 block text-sm text-gray-900">Spicy</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                onClick={handleSaveItem}
                                                className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Saving...' : <><Save className="mr-2 w-4 h-4" />Save</>}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Display item details
                                    <>
                                        <div className="relative">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={300}
                                                height={200}
                                                className="w-full h-48 object-cover"
                                                unoptimized={item.image.startsWith('blob:')} // Add unoptimized prop for blob URLs
                                            />
                                            {item.popular && (
                                                <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    Popular
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                                                {item.spicy && (
                                                    <span className="text-red-500 text-sm">🌶️</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                                            <p className="text-gray-500 text-xs mb-4">Category: {item.category}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="text-xl font-bold text-gray-900">
                                                    ₵{item.price}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 rounded-full text-red-600 hover:bg-red-50"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuManagementPage;