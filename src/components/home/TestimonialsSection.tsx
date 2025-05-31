import { Star } from 'lucide-react';
import Image from 'next/image';

const TestimonialsSection = () => {
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
    
  return (
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
  )
}

export default TestimonialsSection
