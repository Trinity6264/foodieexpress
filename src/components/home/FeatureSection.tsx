import { ChefHat, Shield, Truck, Zap } from 'lucide-react';
import React from 'react'

const FeatureSection = () => {
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

  return (
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
    )
}

export default FeatureSection
