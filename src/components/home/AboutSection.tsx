import Image from 'next/image';

const AboutSection = () => {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Image Section */}
                    <div className="rounded-lg overflow-hidden shadow-2xl">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/boo-app-55d48.appspot.com/o/landing%2FGemini_Generated_Image_vfjb7vfjb7vfjb7v.jpg?alt=media&token=8f898057-f673-4b15-9269-b13b38475d19"
                            alt="Friends enjoying a meal at a FoodieExpress partner restaurant"
                            width={600}
                            height={500}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Text Content Section */}
                    <div className="text-gray-800">
                        <h2 className="text-4xl font-bold mb-6">
                            Bringing Ghana&apos;s Best Flavors to You
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            FoodieExpress was born from a passion for food and technology. We are a team of dedicated students from AAMUSTED who believe that everyone should have access to the rich and diverse culinary landscape of Ghana, right from the comfort of their home or office.
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
                            Our mission is to empower local restaurants, from the smallest street food vendor to the finest dining establishments, by providing them with the tools to reach a wider audience. For our customers, we are committed to providing a seamless, fast, and reliable delivery service that brings delicious food right to your doorstep.
                        </p>
                        <a href="#restaurants" className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg">
                            Find a Restaurant
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection;