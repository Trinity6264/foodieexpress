import Image from 'next/image';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Kofi Mensah',
            title: 'Student, KNUST',
            quote: 'FoodieExpress has been a lifesaver during my late-night study sessions. The delivery is always fast, and the food is hot and delicious. I love the variety of restaurants available!',
            image: 'https://firebasestorage.googleapis.com/v0/b/boo-app-55d48.appspot.com/o/landing%2FGemini_Generated_Image_b2qemkb2qemkb2qe.jpg?alt=media&token=85ce16d2-6e7a-4a85-82ce-feb8b90ffb41',
        },
        {
            name: 'Ama Serwaa',
            title: 'Marketing Executive',
            quote: 'I use FoodieExpress for our team lunches, and it has been fantastic. The ordering process is so simple, and the customer service is top-notch. Highly recommended for corporate orders!',
            image: 'https://firebasestorage.googleapis.com/v0/b/boo-app-55d48.appspot.com/o/landing%2FGemini_Generated_Image_lll4wtlll4wtlll4.jpg?alt=media&token=2a74433a-4e4f-465b-a4ff-dd36de39ac4f',
        },
        {
            name: 'David Adjei',
            title: 'Software Developer',
            quote: "As a developer, I appreciate a well-designed app. FoodieExpress is intuitive, fast, and reliable. It's my go-to for ordering food after a long day of coding. Keep up the great work!",
            image: 'https://firebasestorage.googleapis.com/v0/b/boo-app-55d48.appspot.com/o/landing%2FGemini_Generated_Image_b2qemjb2qemjb2qe.jpg?alt=media&token=f1aad3a4-23cc-4e60-845a-000f4a6d31e7',
        },
    ];


    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <p className="text-xl text-gray-600">
                        Real stories from real food lovers
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.name} className="bg-white rounded-lg shadow-lg p-8">
                            <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Image
                                        className="h-12 w-12 rounded-full"
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                    />
                                </div>
                                <div className="ml-4">
                                    <div className="text-base font-medium text-gray-900">{testimonial.name}</div>
                                    <div className="text-base text-gray-500">{testimonial.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection;