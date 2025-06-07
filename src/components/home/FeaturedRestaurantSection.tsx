import Link from 'next/link'
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';
import RestaurantCard from '../RestaurantCard';

const FeaturedRestaurantSection = () => {
    const featuredRestaurants: Array<RestaurantInfoInterface> = [
            {
                id: "1",
                name: "Mama's Kitchen",
                cuisine: "Local Ghanaian",
                rating: 4.8,
                deliveryTime: "25-35 min",
                deliveryFee: "₵5.00",
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
                specialty: "Authentic Jollof Rice",
                location: "Accra Central",
                featured: true,
                minOrder: "₵20.00",
                userId: '',
                phone: '',
                address: '',
                description: '',
                isOpen: false
            },
            {
                id: "2",
                name: "Dragon Palace",
                cuisine: "Chinese",
                rating: 4.6,
                deliveryTime: "30-40 min",
                deliveryFee: "₵8.00",
                image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
                specialty: "Dim Sum & Noodles",
                location: "East Legon",
                featured: false,
                minOrder: "₵35.00",
                userId: '',
                phone: '',
                address: '',
                description: '',
                isOpen: false
            },
            {
                id: "3",
                name: "Pizza Corner",
                cuisine: "Italian",
                rating: 4.7,
                deliveryTime: "20-30 min",
                deliveryFee: "₵6.00",
                image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
                specialty: "Wood-fired Pizza",
                location: "Osu",
                featured: true,
                minOrder: "₵25.00",
                userId: '',
                phone: '',
                address: '',
                description: '',
                isOpen: false
            },
            {
                id: "4",
                name: "Spice Route",
                cuisine: "Indian",
                rating: 4.5,
                deliveryTime: "35-45 min",
                deliveryFee: "₵10.00",
                image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
                specialty: "Authentic Biryani",
                location: "Cantonments",
                featured: false,
                minOrder: "₵40.00",
                userId: '',
                phone: '',
                address: '',
                description: '',
                isOpen: false
            },
        ];
    
  return (
      <section id="restaurants" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
                  <p className="text-xl text-gray-600">
                      Discover amazing local and international cuisine from our partner restaurants
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredRestaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
              </div>

              <div className="text-center mt-12">
                  <Link href={'/restaurants'} className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg">
                      View All Restaurants
                  </Link>
              </div>
          </div>
      </section>
  )
}

export default FeaturedRestaurantSection
