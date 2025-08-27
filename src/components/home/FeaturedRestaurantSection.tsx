import Link from 'next/link';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import RestaurantCard from '../RestaurantCard';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';

// Force dynamic rendering to avoid static caching of Firestore data
export const dynamic = 'force-dynamic';

// This is now an async component to allow for server-side data fetching
const FeaturedRestaurantSection = async () => {

    // Fetch featured restaurants from Firestore
    const getFeaturedRestaurants = async (): Promise<RestaurantInfoInterface[]> => {
        try {
            const restaurantsCol = collection(db, 'restaurants');
            // Create a query to get only documents where 'isVendor' is true
            const q = query(restaurantsCol, where('isVendor', '==', true), limit(4));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No featured restaurants found.");
                return [];
            }

            const restaurants = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as RestaurantInfoInterface[];

            return restaurants;
        } catch (error) {
            console.error("Error fetching featured restaurants:", error);
            // In case of an error, return an empty array to prevent the page from crashing.
            return [];
        }
    };

    const featuredRestaurants = await getFeaturedRestaurants();

    return (
        <section id="restaurants" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
                    <p className="text-xl text-gray-600">
                        Discover amazing local and international cuisine from our partner restaurants
                    </p>
                </div>

                {featuredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center text-gray-500'>
                        <p>No featured restaurants available at the moment.</p>
                    </div>
                )}


                <div className="text-center mt-12">
                    <Link href={'/restaurants'} className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg">
                        View All Restaurants
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedRestaurantSection;