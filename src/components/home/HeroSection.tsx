'use client'
import { ArrowRight, PlayCircle, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSection = () => {
        const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
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

  return (
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
    )
}

export default HeroSection
