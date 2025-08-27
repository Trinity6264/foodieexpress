'use client'
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChefHat, X } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/init';

// This component receives the initial list of restaurants from the server.
export default function RestaurantList({ initialRestaurants }: { initialRestaurants: RestaurantInfoInterface[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    // Use server-provided data as initial state, then keep it live via onSnapshot
    const [restaurants, setRestaurants] = useState<RestaurantInfoInterface[]>(initialRestaurants || []);

    useEffect(() => {
        // Subscribe to live updates for vendor restaurants
        try {
            const restaurantsCol = collection(db, 'restaurants');
            const q = query(restaurantsCol, where('isVendor', '==', true));
            const unsubscribe = onSnapshot(q, snapshot => {
                const live: RestaurantInfoInterface[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as unknown as RestaurantInfoInterface[];
                setRestaurants(live);
            }, err => {
                console.warn('Failed to subscribe to restaurants:', err);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up restaurant listener:', err);
            return () => {};
        }
    }, []);

    // Get unique cuisines from the fetched restaurant data
    const cuisines = [...new Set(restaurants.map((r: RestaurantInfoInterface) => r.cuisine))];

    const filteredRestaurants = useMemo(() => {
        // Start with the full list of restaurants from live state
        const filtered = restaurants.filter((restaurant: RestaurantInfoInterface) => {
            const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                restaurant.specialty.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCuisine = selectedCuisine === '' || restaurant.cuisine === selectedCuisine;

            const matchesRating = selectedRating === '' || restaurant.rating >= parseFloat(selectedRating);

            const matchesDeliveryTime = selectedDeliveryTime === '' ||
                (selectedDeliveryTime === 'fast' && parseInt(restaurant.deliveryTime) <= 30) ||
                (selectedDeliveryTime === 'medium' && parseInt(restaurant.deliveryTime) > 30 && parseInt(restaurant.deliveryTime) <= 45) ||
                (selectedDeliveryTime === 'slow' && parseInt(restaurant.deliveryTime) > 45);

            return matchesSearch && matchesCuisine && matchesRating && matchesDeliveryTime;
        });

        // Sort restaurants
        if (sortBy === 'rating') {
            filtered.sort((a: RestaurantInfoInterface, b: RestaurantInfoInterface) => b.rating - a.rating);
        } else if (sortBy === 'delivery') {
            filtered.sort((a: RestaurantInfoInterface, b: RestaurantInfoInterface) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        } else if (sortBy === 'popular') {
            filtered.sort((a: RestaurantInfoInterface, b: RestaurantInfoInterface) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        return filtered;
    }, [searchTerm, selectedCuisine, selectedRating, selectedDeliveryTime, sortBy, restaurants]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCuisine('');
        setSelectedRating('');
        setSelectedDeliveryTime('');
        setSortBy('popular');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col gap-2.5 md:flex-row items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Restaurants</h1>
                            <p className="text-gray-600 mt-2">Discover amazing food from {restaurants.length} restaurants</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search restaurants, cuisines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Cuisine</label>
                                <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)} className="border text-gray-800 border-gray-300 rounded-lg px-3 py-2">
                                    <option value="">All Cuisines</option>
                                    {cuisines.map((cuisine: string) => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ... Other filter dropdowns ... */}

                            <button onClick={clearFilters} className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 mt-6"><X size={16} /><span className="text-sm">Clear All</span></button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6"><p className="text-gray-600">Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}</p></div>
                {filteredRestaurants.length === 0 ? (
                    <div className="text-center py-12">
                        <ChefHat className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.map((restaurant: RestaurantInfoInterface) => (
                            <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};