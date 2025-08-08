import { Clock, MapPin, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RestaurantInfoInterface } from "@/interfaces/RestaurantInfoInterface"
import StarRating from "./StarRating"
import useRestaurantRatings from "@/hooks/useRestaurantRatings"

interface RestaurantCardProps {
    restaurant: RestaurantInfoInterface;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
    const { stats, loading } = useRestaurantRatings(restaurant.id);

    return (
        // The link now includes the restaurant's unique ID
        <Link href={`/menu/${restaurant.id}`} key={restaurant.id}>
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
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {restaurant.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {restaurant.location}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-1"></div>
                                    <span className="text-gray-400 text-sm">Loading...</span>
                                </div>
                            ) : (
                                <StarRating
                                    rating={stats?.averageRating || 0}
                                    totalRatings={stats?.totalRatings || 0}
                                    size="sm"
                                    showRatingText={true}
                                />
                            )}
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
    )
}

export default RestaurantCard;
