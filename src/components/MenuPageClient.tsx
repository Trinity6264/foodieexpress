'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChefHat, ShoppingCart, } from 'lucide-react';
import Link from 'next/link';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import MenuItem from '@/components/MenuItem';
import { selectCartItemCount } from '@/store/features/cartSlice';
import { useAppSelector } from '@/store/hooks';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/init';



interface MenuPageClientProps {
    restaurant: RestaurantInfoInterface;
    menuItems: MenuItemInterface[];
}

export default function MenuPageClient({ restaurant, menuItems }: MenuPageClientProps) {
    const router = useRouter();
    // const [selectedCategory, setSelectedCategory] = useState('all');
    // Get cart count from Redux store
    const cartItemCount = useAppSelector(selectCartItemCount);

    // Use server-provided menuItems as initial state and subscribe for live updates
    const [menuItemsLive, setMenuItemsLive] = useState<MenuItemInterface[]>(menuItems || []);

    useEffect(() => {
        if (!restaurant?.id) return;

        try {
            const menuCol = collection(db, 'restaurants', restaurant.id, 'menuItems');
            const q = query(menuCol);
            const unsubscribe = onSnapshot(q, snapshot => {
                const live = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as MenuItemInterface[];
                setMenuItemsLive(live);
            }, err => {
                console.warn('Failed to subscribe to menu items for restaurant', restaurant.id, err);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error('Error subscribing to menu items:', err);
            return () => {};
        }
    }, [restaurant?.id]);


    // ... (filtering logic remains the same)
    const filteredItems = menuItemsLive;

    // ... (Header and RestaurantInfo components remain the same, but update cart count in Header)
    const Header = () => (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <Link href={'/cart'} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItemCount}</span>}
                    </Link>
                </div>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* ... other components */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Pass the restaurant ID to each menu item */}
                        {filteredItems.map(item => <MenuItem key={item.id} item={item} restaurantId={restaurant.id} />)}
                    </div>
                ) : (
                    <div className="text-center py-16"><ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900">No menu items found.</h3></div>
                )}
            </div>
        </div>
    );
}