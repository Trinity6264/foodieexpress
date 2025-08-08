'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { Rating, VendorRatingStats } from '@/interfaces/RatingInterface';

export const useRestaurantRatings = (vendorId: string) => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [stats, setStats] = useState<VendorRatingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRatings = async () => {
            if (!vendorId) return;

            try {
                setLoading(true);
                setError(null);

                const ratingsQuery = query(
                    collection(db, 'ratings'),
                    where('vendorId', '==', vendorId)
                );

                const snapshot = await getDocs(ratingsQuery);
                const ratingsData: Rating[] = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    ratingsData.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt,
                        orderDate: data.orderDate
                    } as Rating);
                });

                setRatings(ratingsData);

                // Calculate statistics
                if (ratingsData.length > 0) {
                    const totalRatings = ratingsData.length;
                    const averageRating = ratingsData.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;
                    
                    const ratingDistribution = {
                        1: ratingsData.filter(r => r.rating === 1).length,
                        2: ratingsData.filter(r => r.rating === 2).length,
                        3: ratingsData.filter(r => r.rating === 3).length,
                        4: ratingsData.filter(r => r.rating === 4).length,
                        5: ratingsData.filter(r => r.rating === 5).length,
                    };

                    setStats({
                        vendorId,
                        restaurantName: ratingsData[0]?.restaurantName || '',
                        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                        totalRatings,
                        ratingDistribution
                    });
                } else {
                    setStats({
                        vendorId,
                        restaurantName: '',
                        averageRating: 0,
                        totalRatings: 0,
                        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                    });
                }
            } catch (err) {
                console.error('Error fetching ratings:', err);
                setError('Failed to load ratings');
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [vendorId]);

    return { ratings, stats, loading, error };
};

export default useRestaurantRatings;
