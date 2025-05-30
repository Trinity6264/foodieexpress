"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search,  Star, Clock, ChefHat, Truck, Shield, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Header from './Header';

const Landing = () => {
 
    const [currentSlide, setCurrentSlide] = useState(0);

 

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

    const heroSlides = [
        {
            title: "Delicious Local Cuisine",
            subtitle: "Authentic Ghanaian dishes delivered to your doorstep",
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=600&fit=crop",
            cta: "Order Local Food"
        },
        {
            title: "International Flavors",
            subtitle: "Explore cuisines from around the world",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop",
            cta: "Browse International"
        },
        {
            title: "Fast & Fresh Delivery",
            subtitle: "Hot meals delivered in 30 minutes or less",
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=600&fit=crop",
            cta: "Order Now"
        }
    ];

    const features = [
        {
            icon: <ChefHat className="w-12 h-12 text-orange-600" />,
            title: "Quality Food",
            description: "Fresh ingredients and authentic recipes from local and international chefs"
        },
        {
            icon: <Truck className="w-12 h-12 text-orange-600" />,
            title: "Fast Delivery",
            description: "Quick and reliable delivery service to your location within 30 minutes"
        },
        {
            icon: <Shield className="w-12 h-12 text-orange-600" />,
            title: "Safe & Secure",
            description: "Secure payment methods and contactless delivery options available"
        },
        {
            icon: <Zap className="w-12 h-12 text-orange-600" />,
            title: "Easy Ordering",
            description: "Simple and intuitive interface for seamless food ordering experience"
        }
    ];

    const testimonials = [
        {
            name: "Kwame Asante",
            location: "Accra",
            rating: 5,
            comment: "Amazing service! The local dishes taste just like home-cooked meals.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
            name: "Sarah Johnson",
            location: "Kumasi",
            rating: 5,
            comment: "Love the variety of international cuisines. Fast delivery every time!",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
            name: "Abdul Rahman",
            location: "Tamale",
            rating: 5,
            comment: "Best food delivery app in Ghana. Great prices and excellent quality.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        }
    ];


    const HeroSection = () => (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Slider */}
            <div className="absolute inset-0">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>

                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl sm:text-2xl mb-8 text-gray-200">
                    {heroSlides[currentSlide].subtitle}
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Enter a place..."
                            className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                            Find Food
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg flex items-center">
                        {heroSlides[currentSlide].cta}
                        <ArrowRight className="ml-2" size={20} />
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold text-lg flex items-center">
                        <PlayCircle className="mr-2" size={20} />
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-orange-600' : 'bg-white bg-opacity-50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );

    const FeaturesSection = () => (
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FoodieExpress?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We connect you with the best local and international restaurants, delivering quality food right to your doorstep
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                            <div className="mb-6 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const RestaurantsSection = () => (
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
    );

    const TestimonialsSection = () => (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <p className="text-xl text-gray-600">
                        Real reviews from satisfied customers across Ghana
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 shadow-lg">
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="text-yellow-400 fill-current w-5 h-5" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic">{testimonial.comment}</p>
                            <div className="flex items-center">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const AboutSection = () => (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">About FoodieExpress</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            FoodieExpress is Ghana&apos;s premier food delivery platform, connecting food lovers with
                            the best local and international restaurants. Our mission is to make delicious,
                            quality food accessible to everyone, anywhere, anytime.
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
                            We partner with trusted restaurants to bring you authentic Ghanaian cuisine alongside
                            international flavors, ensuring every meal is prepared with care and delivered fresh
                            to your doorstep.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                                <div className="text-gray-600">Partner Restaurants</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">50,000+</div>
                                <div className="text-gray-600">Happy Customers</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                            width={600}
                            height={400}
                            alt="About FoodieExpress"
                            className="rounded-lg shadow-xl"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-lg">
                            <div className="text-2xl font-bold mb-1">4.8★</div>
                            <div className="text-sm">Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const CTASection = () => (
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
                <p className="text-xl mb-8 text-orange-100">
                    Join thousands of satisfied customers and experience the best food delivery in Ghana
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                        Download App
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold text-lg">
                        Order Online
                    </button>
                </div>
            </div>
        </section>
    );

    

    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection />
            <FeaturesSection />
            <RestaurantsSection />
            <TestimonialsSection />
            <AboutSection />
            <CTASection />
        </div>
    );
};

export default Landing;