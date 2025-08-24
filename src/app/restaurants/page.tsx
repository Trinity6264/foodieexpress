import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import RestaurantList from '@/components/RestaurantList';

// This is now an async Server Component.
const RestaurantsPage = async () => {

    // Helper function to fetch all restaurants from Firestore.
    const fetchAllRestaurants = async (): Promise<RestaurantInfoInterface[]> => {
        try {
            const restaurantsCollection = collection(db, 'restaurants');
            const q = query(restaurantsCollection, where('isVendor', '==', true));
            const querySnapshot = await getDocs(q);
            const restaurants = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as RestaurantInfoInterface[];

            return restaurants;

        } catch (error) {
            console.error("Error fetching restaurants for page:", error);
            // Return an empty array on error to prevent crashing.
            return [];
        }
    };

    // Fetch the data on the server.
    const allRestaurants = await fetchAllRestaurants();

    // Render the client component and pass the fetched data as a prop.
    return <RestaurantList initialRestaurants={allRestaurants} />;
};

export default RestaurantsPage;