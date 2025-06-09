import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';
import MenuPageClient from '@/components/MenuPageClient';
import { notFound } from 'next/navigation';

type MenuPageProps = {
    params: {
        restaurantId: string;
    };
};

async function getRestaurant(id: string): Promise<RestaurantInfoInterface | null> {
    try {
        const docRef = doc(db, 'restaurants', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as RestaurantInfoInterface;
        }
        return null;
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        return null;
    }
}

async function getMenuItems(restaurantId: string): Promise<MenuItemInterface[]> {
    try {
        const menuItemsCol = collection(db, 'restaurants', restaurantId, 'menuItems');
        const querySnapshot = await getDocs(menuItemsCol);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as MenuItemInterface[];
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return [];
    }
}

export default async function MenuPage({ params }: MenuPageProps) {
    const { restaurantId } = params;

    const [restaurant, menuItems] = await Promise.all([
        getRestaurant(restaurantId),
        getMenuItems(restaurantId),
    ]);

    if (!restaurant) {
        notFound();
    }

    return (
        <MenuPageClient restaurant={restaurant} menuItems={menuItems} />
    );
}