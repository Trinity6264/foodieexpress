'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {  Star, Clock,  ArrowLeft, ChefHat, ShoppingCart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import MenuItem from '@/components/MenuItem';

interface MenuPageClientProps {
    restaurant: RestaurantInfoInterface;
    menuItems: MenuItemInterface[];
}

export default function MenuPageClient({ restaurant, menuItems }: MenuPageClientProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const Header = () => (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <Link href={'/cart'} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </div>
    );

    const RestaurantInfo = () => (
        <div className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <Image src={restaurant.image} alt={restaurant.name} width={120} height={120} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
                        <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1" /> <span className="font-medium">{restaurant.rating}</span></div>
                            <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> <span>{restaurant.deliveryTime}</span></div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> <span>Delivery {restaurant.deliveryFee}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <RestaurantInfo />
            {/* ... other components like SearchAndFilter, Categories ... */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => <MenuItem key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="text-center py-16"><ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900">No menu items found.</h3></div>
                )}
            </div>
        </div>
    );
}