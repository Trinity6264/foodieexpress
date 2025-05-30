'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { Search, Star, Clock, Plus, Filter, ArrowLeft, ChefHat, ShoppingCart, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';

const Menu = () => {
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cartCount, setCartCount] = useState(0);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const restaurant = {
        name: "Mama's Kitchen",
        cuisine: "Local Ghanaian",
        rating: 4.8,
        reviews: 234,
        deliveryTime: "25-35 min",
        deliveryFee: "₵5.00",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop"
    };

    const categories = [
        { id: 'all', name: 'All Items', count: 24 },
        { id: 'local', name: 'Local Dishes', count: 12 },
        { id: 'rice', name: 'Rice & Grains', count: 6 },
        { id: 'soups', name: 'Soups & Stews', count: 8 },
        { id: 'sides', name: 'Sides', count: 5 },
        { id: 'drinks', name: 'Beverages', count: 7 }
    ];

    const menuItems = [
        {
            id: 1,
            name: "Jollof Rice with Chicken",
            description: "Aromatic rice cooked in rich tomato sauce with tender grilled chicken",
            price: 25.00,
            category: 'rice',
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
            popular: true,
            spicy: true
        },
        {
            id: 2,
            name: "Banku with Tilapia",
            description: "Traditional fermented corn dough served with grilled tilapia and pepper sauce",
            price: 30.00,
            category: 'local',
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&h=200&fit=crop",
            popular: false,
            spicy: true
        },
        {
            id: 3,
            name: "Fufu with Light Soup",
            description: "Pounded cassava and plantain served with aromatic light soup and goat meat",
            price: 28.00,
            category: 'soups',
            image: "https://images.unsplash.com/photo-1565299507177-b0ac66763ef1?w=300&h=200&fit=crop",
            popular: true,
            spicy: false
        },
        {
            id: 4,
            name: "Kelewele",
            description: "Spiced fried plantain cubes with ginger and chili",
            price: 12.00,
            category: 'sides',
            image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300&h=200&fit=crop",
            popular: true,
            spicy: true
        },
        {
            id: 5,
            name: "Palm Nut Soup",
            description: "Rich palm nut soup with assorted meat and fish",
            price: 35.00,
            category: 'soups',
            image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300&h=200&fit=crop",
            popular: false,
            spicy: false
        },
        {
            id: 6,
            name: "Sobolo",
            description: "Refreshing hibiscus drink with ginger and pineapple",
            price: 8.00,
            category: 'drinks',
            image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300&h=200&fit=crop",
            popular: true,
            spicy: false
        }
    ];

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = () => {
        setCartCount(prev => prev + 1);
    };

    const toggleFavorite = (itemId: number) => {
        setFavorites(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const Header = () => (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-6 h-6 text-orange-600" />
                            <h1 className="text-xl font-bold text-gray-900">Menu</h1>
                        </div>
                    </div>
                    <Link href={'/cart'}  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );

    const RestaurantInfo = () => (
        <div className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
                        <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-medium">{restaurant.rating}</span>
                                <span className="ml-1">({restaurant.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{restaurant.deliveryTime}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Delivery {restaurant.deliveryFee}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const SearchAndFilter = () => (
        <div className="bg-gray-50 py-4">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Filter</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const Categories = () => (
        <div className="bg-white py-4 border-b">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex space-x-1 overflow-x-auto">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.name} ({category.count})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                />
                {item.popular && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                    </div>
                )}
                <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                    <Heart
                        className={`w-4 h-4 ${favorites.includes(item.id)
                                ? 'text-red-500 fill-current'
                                : 'text-gray-400'
                            }`}
                    />
                </button>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    {item.spicy && (
                        <span className="text-red-500 text-sm">🌶️</span>
                    )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                        ₵{item.price.toFixed(2)}
                    </div>
                    <button
                        onClick={() => addToCart()}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <RestaurantInfo />
            <SearchAndFilter />
            <Categories />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-600">Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;