'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import { setAuthState } from '@/store/features/authSlice';
import { auth, db } from '@/firebase/init';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';

type SerializableUser = Omit<User, 'providerData'>;

const AuthInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // This observer listens for sign-in or sign-out events
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, let's get their profile data
                const restaurantDocRef = doc(db, 'restaurants', user.uid);
                const restaurantDocSnap = await getDoc(restaurantDocRef);

                const serializableUser: SerializableUser = JSON.parse(JSON.stringify(user));
                const restaurantData = restaurantDocSnap.exists()
                    ? (restaurantDocSnap.data() as RestaurantInfoInterface)
                    : null;

                dispatch(setAuthState({ user: serializableUser, restaurantInfo: restaurantData }));

            } else {
                // User is signed out
                dispatch(setAuthState({ user: null, restaurantInfo: null }));
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [dispatch]);

    return null; // This component does not render anything
};

export default AuthInitializer;