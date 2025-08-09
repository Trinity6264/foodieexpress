import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import RestaurantList from '@/components/RestaurantList';

// This is now an async Server Component.
const RestaurantsPage = async () => {

    // Helper function to fetch all restaurants from Firestore.
    const fetchAllRestaurants = async (): Promise<RestaurantInfoInterface[]> => {
        try {
            console.log('🔍 Fetching restaurants from Firebase...');
            console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
            
            const restaurantsCollection = collection(db, 'restaurants');
            const q = query(restaurantsCollection, where('isVendor', '==', true));

            const querySnapshot = await getDocs(q);
            console.log('📊 Query results:', querySnapshot.size, 'restaurants found');

            const restaurants = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('📋 Restaurant:', doc.id, data.name, 'isVendor:', data.isVendor);
                return {
                    id: doc.id,
                    ...data,
                } as RestaurantInfoInterface;
            });

            console.log('✅ Final restaurants array:', restaurants.length);
            return restaurants;

        } catch (error) {
            console.error("❌ Error fetching restaurants for page:", error);
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