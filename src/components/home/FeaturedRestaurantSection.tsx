import { Clock, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';

const FeaturedRestaurantSection = () => {
    const featuredRestaurants = [
        {
            id: 1,
            name: "Mama's Kitchen",
            cuisine: "Local Ghanaian",
            rating: 4.8,
            deliveryTime: "25-35 min",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
            specialty: "Authentic Jollof Rice"
        },
        {
            id: 2,
            name: "Dragon Palace",
            cuisine: "Chinese",
            rating: 4.6,
            deliveryTime: "30-40 min",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
            specialty: "Dim Sum & Noodles"
        },
        {
            id: 3,
            name: "Pizza Corner",
            cuisine: "Italian",
            rating: 4.7,
            deliveryTime: "20-30 min",
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
            specialty: "Wood-fired Pizza"
        },
        {
            id: 4,
            name: "Spice Route",
            cuisine: "Indian",
            rating: 4.5,
            deliveryTime: "35-45 min",
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
            specialty: "Authentic Biryani"
        }
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
                      <Link href={'/menu'} key={restaurant.id} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group">
                          <div className="relative overflow-hidden">
                              <Image
                                  src={restaurant.image}
                                  alt={restaurant.name}
                                  width={400}
                                  height={300}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  {restaurant.cuisine}
                              </div>
                          </div>
                          <div className="p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                              <p className="text-gray-600 mb-4">{restaurant.specialty}</p>
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                      <Star className="text-yellow-400 fill-current w-5 h-5" />
                                      <span className="ml-1 text-sm font-medium text-gray-900">{restaurant.rating}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                      <Clock className="w-4 h-4 mr-1" />
                                      <span className="text-sm">{restaurant.deliveryTime}</span>
                                  </div>
                              </div>
                          </div>
                      </Link>
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
