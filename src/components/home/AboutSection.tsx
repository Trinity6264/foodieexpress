import Image from "next/image";


const AboutSection = () => {
  return (
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
  )
}

export default AboutSection
