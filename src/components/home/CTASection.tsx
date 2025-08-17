
const CTASection = () => {
  return (
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
    )
}

export default CTASection
