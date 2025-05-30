import { ChefHat, X, Mail, MapPin, Phone, Facebook, Instagram, } from 'lucide-react'

const Footer = () => {
  return (
      <footer id="contact" className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                          <ChefHat className="w-8 h-8 text-orange-600" />
                          <h3 className="text-2xl font-bold">FoodieExpress</h3>
                      </div>
                      <p className="text-gray-400 mb-6 max-w-md">
                          Ghana&apos;s leading food delivery platform connecting you with the best local and international restaurants.
                      </p>
                      <div className="flex space-x-4">
                          <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
                          <X className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
                          <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
                      </div>
                  </div>

                  <div>
                      <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                      <ul className="space-y-2 text-gray-400">
                          <li><a href="#home" className="hover:text-orange-600 transition-colors">Home</a></li>
                          <li><a href="#restaurants" className="hover:text-orange-600 transition-colors">Restaurants</a></li>
                          <li><a href="#features" className="hover:text-orange-600 transition-colors">Features</a></li>
                          <li><a href="#about" className="hover:text-orange-600 transition-colors">About</a></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                      <div className="space-y-2 text-gray-400">
                          <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>+233 54 515 1304</span>
                          </div>
                          <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              <span>info@foodieexpress.com</span>
                          </div>
                          <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>Kumasi, Ghana</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; 2024 FoodieExpress. All rights reserved. | Developed by AAMUSTED Students</p>
              </div>
          </div>
      </footer>
  )
}

export default Footer
