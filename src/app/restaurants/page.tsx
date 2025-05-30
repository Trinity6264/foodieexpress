'use client'
import { useState, useMemo } from 'react';
import { Search, Star, Clock, Filter, MapPin, ChefHat, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const RestaurantsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    const allRestaurants = [
        {
            id: 1,
            name: "Mama's Kitchen",
            cuisine: "Local Ghanaian",
            rating: 4.8,
            deliveryTime: "25-35 min",
            deliveryFee: "₵5.00",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
            specialty: "Authentic Jollof Rice",
            location: "Accra Central",
            featured: true,
            minOrder: "₵20.00"
        },
        {
            id: 2,
            name: "Dragon Palace",
            cuisine: "Chinese",
            rating: 4.6,
            deliveryTime: "30-40 min",
            deliveryFee: "₵8.00",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
            specialty: "Dim Sum & Noodles",
            location: "East Legon",
            featured: false,
            minOrder: "₵35.00"
        },
        {
            id: 3,
            name: "Pizza Corner",
            cuisine: "Italian",
            rating: 4.7,
            deliveryTime: "20-30 min",
            deliveryFee: "₵6.00",
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
            specialty: "Wood-fired Pizza",
            location: "Osu",
            featured: true,
            minOrder: "₵25.00"
        },
        {
            id: 4,
            name: "Spice Route",
            cuisine: "Indian",
            rating: 4.5,
            deliveryTime: "35-45 min",
            deliveryFee: "₵10.00",
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
            specialty: "Authentic Biryani",
            location: "Cantonments",
            featured: false,
            minOrder: "₵40.00"
        },
        {
            id: 5,
            name: "Burger Junction",
            cuisine: "American",
            rating: 4.4,
            deliveryTime: "15-25 min",
            deliveryFee: "₵4.00",
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
            specialty: "Gourmet Burgers",
            location: "Airport Residential",
            featured: false,
            minOrder: "₵15.00"
        },
        {
            id: 6,
            name: "Sushi Zen",
            cuisine: "Japanese",
            rating: 4.9,
            deliveryTime: "40-50 min",
            deliveryFee: "₵12.00",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
            specialty: "Fresh Sushi & Sashimi",
            location: "Cantonments",
            featured: true,
            minOrder: "₵50.00"
        },
        {
            id: 7,
            name: "Taco Fiesta",
            cuisine: "Mexican",
            rating: 4.3,
            deliveryTime: "25-35 min",
            deliveryFee: "₵7.00",
            image: "https://images.unsplash.com/photo-1565299585323-38174c6ba9f2?w=400&h=300&fit=crop",
            specialty: "Authentic Tacos",
            location: "Labone",
            featured: false,
            minOrder: "₵30.00"
        },
        {
            id: 8,
            name: "Auntie Mercy's Spot",
            cuisine: "Local Ghanaian",
            rating: 4.6,
            deliveryTime: "20-30 min",
            deliveryFee: "₵3.00",
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
            specialty: "Banku & Tilapia",
            location: "Tema",
            featured: false,
            minOrder: "₵18.00"
        },
        {
            id: 9,
            name: "The Grill House",
            cuisine: "BBQ",
            rating: 4.7,
            deliveryTime: "30-40 min",
            deliveryFee: "₵9.00",
            image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
            specialty: "Grilled Meats & Seafood",
            location: "Ridge",
            featured: true,
            minOrder: "₵35.00"
        },
        {
            id: 10,
            name: "Pasta Villa",
            cuisine: "Italian",
            rating: 4.2,
            deliveryTime: "25-35 min",
            deliveryFee: "₵6.00",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
            specialty: "Fresh Pasta & Risotto",
            location: "Airport Residential",
            featured: false,
            minOrder: "₵28.00"
        },
        {
            id: 11,
            name: "Kofi's Chop Bar",
            cuisine: "Local Ghanaian",
            rating: 4.5,
            deliveryTime: "15-25 min",
            deliveryFee: "₵2.00",
            image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
            specialty: "Waakye & Kelewele",
            location: "Circle",
            featured: false,
            minOrder: "₵12.00"
        },
        {
            id: 12,
            name: "Mediterranean Delight",
            cuisine: "Mediterranean",
            rating: 4.8,
            deliveryTime: "35-45 min",
            deliveryFee: "₵11.00",
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
            specialty: "Hummus & Grilled Meats",
            location: "East Legon",
            featured: true,
            minOrder: "₵45.00"
        }
    ];

    const cuisines = [...new Set(allRestaurants.map(r => r.cuisine))];

    const filteredRestaurants = useMemo(() => {
        const filtered = allRestaurants.filter(restaurant => {
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
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'delivery') {
            filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        return filtered;
    }, [searchTerm, selectedCuisine, selectedRating, selectedDeliveryTime, sortBy]);

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
                            <p className="text-gray-600 mt-2">Discover amazing food from {allRestaurants.length} restaurants</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search restaurants, cuisines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
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
                                <select
                                    value={selectedCuisine}
                                    onChange={(e) => setSelectedCuisine(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">All Cuisines</option>
                                    {cuisines.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                                <select
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="4.5">4.5+ Stars</option>
                                    <option value="4.0">4.0+ Stars</option>
                                    <option value="3.5">3.5+ Stars</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Time</label>
                                <select
                                    value={selectedDeliveryTime}
                                    onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Any Time</option>
                                    <option value="fast">Under 30 min</option>
                                    <option value="medium">30-45 min</option>
                                    <option value="slow">45+ min</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="delivery">Fastest Delivery</option>
                                </select>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 mt-6"
                            >
                                <X size={16} />
                                <span className="text-sm">Clear All</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {filteredRestaurants.length === 0 ? (
                    <div className="text-center py-12">
                        <ChefHat className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.map((restaurant) => (
                            <Link href={`/menu`} key={restaurant.id}>
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                    <div className="relative overflow-hidden">
                                        <Image
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            width={400}
                                            height={250}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            {restaurant.cuisine}
                                        </div>
                                        {restaurant.featured && (
                                            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Featured
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                            {restaurant.deliveryFee} delivery
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            {restaurant.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">{restaurant.specialty}</p>

                                        <div className="flex items-center text-xs text-gray-500 mb-3">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {restaurant.location}
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Star className="text-yellow-400 fill-current w-4 h-4" />
                                                <span className="ml-1 text-sm font-medium text-gray-900">{restaurant.rating}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{restaurant.deliveryTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Min. order: {restaurant.minOrder}</span>
                                            <div className="flex items-center">
                                                <Truck className="w-3 h-3 mr-1" />
                                                <span>{restaurant.deliveryFee}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantsPage;