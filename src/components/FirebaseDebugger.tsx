'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';

interface RestaurantDebugInfo {
    id: string;
    name: string;
    isVendor: boolean;
    hasRequiredFields: boolean;
}

interface DebugInfo {
    firebaseConfig: {
        projectId: string | undefined;
        environment: string | undefined;
    };
    totalRestaurants: number;
    vendorRestaurants: number;
    allRestaurants: RestaurantDebugInfo[];
    timestamp: string;
    error?: string;
}

const FirebaseDebugger = () => {
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFirebaseConnection = async () => {
            try {
                console.log('=== FIREBASE DEBUG INFO ===');
                console.log('Firebase Config:', {
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
                });

                // Test 1: Check total documents in restaurants collection
                const restaurantsCollection = collection(db, 'restaurants');
                const allDocs = await getDocs(restaurantsCollection);
                console.log('Total restaurants in collection:', allDocs.size);

                // Test 2: Check vendor restaurants
                const vendorQuery = query(restaurantsCollection, where('isVendor', '==', true));
                const vendorDocs = await getDocs(vendorQuery);
                console.log('Vendor restaurants:', vendorDocs.size);

                // Test 3: List all documents with their data
                const allRestaurants: RestaurantDebugInfo[] = [];
                allDocs.forEach((doc) => {
                    const data = doc.data();
                    allRestaurants.push({
                        id: doc.id,
                        name: data.name || 'No name',
                        isVendor: Boolean(data.isVendor),
                        hasRequiredFields: !!(data.name && data.cuisine && data.location)
                    });
                });

                const debugData: DebugInfo = {
                    firebaseConfig: {
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                        environment: process.env.NODE_ENV,
                    },
                    totalRestaurants: allDocs.size,
                    vendorRestaurants: vendorDocs.size,
                    allRestaurants,
                    timestamp: new Date().toISOString()
                };

                console.log('Debug Data:', debugData);
                setDebugInfo(debugData);

            } catch (error) {
                console.error('Firebase Debug Error:', error);
                setDebugInfo({ 
                    firebaseConfig: {
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                        environment: process.env.NODE_ENV,
                    },
                    totalRestaurants: 0,
                    vendorRestaurants: 0,
                    allRestaurants: [],
                    timestamp: new Date().toISOString(),
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            } finally {
                setLoading(false);
            }
        };

        checkFirebaseConnection();
    }, []);

    if (loading) {
        return (
            <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-md">
                <h3 className="font-bold text-blue-800">Firebase Debug</h3>
                <p className="text-blue-600">Checking connection...</p>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 max-w-md shadow-lg z-50">
            <h3 className="font-bold text-gray-800 mb-2">🔍 Firebase Debug Info</h3>
            <div className="text-xs space-y-1">
                <p><strong>Project:</strong> {debugInfo?.firebaseConfig?.projectId}</p>
                <p><strong>Environment:</strong> {debugInfo?.firebaseConfig?.environment}</p>
                <p><strong>Total Restaurants:</strong> {debugInfo?.totalRestaurants || 0}</p>
                <p><strong>Vendor Restaurants:</strong> {debugInfo?.vendorRestaurants || 0}</p>
                
                {debugInfo?.error && (
                    <p className="text-red-600"><strong>Error:</strong> {debugInfo.error}</p>
                )}
                
                {debugInfo?.allRestaurants && debugInfo.allRestaurants.length > 0 && (
                    <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600">Show All Restaurants</summary>
                        <div className="mt-1 text-xs">
                            {debugInfo.allRestaurants.map((restaurant: RestaurantDebugInfo, index: number) => (
                                <div key={index} className="border-b border-gray-200 py-1">
                                    <p><strong>{restaurant.name}</strong></p>
                                    <p>ID: {restaurant.id}</p>
                                    <p>isVendor: {String(restaurant.isVendor)}</p>
                                    <p>Valid: {String(restaurant.hasRequiredFields)}</p>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        </div>
    );
};

export default FirebaseDebugger;
