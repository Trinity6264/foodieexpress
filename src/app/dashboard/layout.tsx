'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, restaurantInfo, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Wait until the initial loading is complete
        if (isLoading) {
            return;
        }

        // If there is no user, redirect to the login page.
        if (!user) {
            router.push('/login');
        }
        // If the user is logged in but has not set up their restaurant,
        // redirect them to the setup page.
        else if (!restaurantInfo) {
            router.push('/restaurant-setup');
        }
    }, [user, restaurantInfo, isLoading, router]);

    // While loading auth state or if the user is not properly authenticated,
    // show a loading spinner. This prevents the dashboard content from
    // flashing before the redirect logic can run.
    if (isLoading || !user || !restaurantInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-700">Loading Dashboard...</p>
            </div>
        );
    }

    // If the user is authenticated and has a restaurant profile,
    // render the requested dashboard page.
    return <>{children}</>;
}