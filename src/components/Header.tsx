'use client'
import { ChefHat, Menu, X } from "lucide-react"
import { useState } from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-8 h-8 text-orange-600" />
                            <h1 className="text-2xl font-bold text-orange-600">FoodieExpress</h1>
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <a href="#home" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</a>
                        <a href="#restaurants" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Restaurants</a>
                        <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Features</a>
                        <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">About</a>
                        <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</a>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                            Sign In
                        </button>
                        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                            Get Started
                        </button>
                    </div>

                    <button
                        className="md:hidden p-2 text-gray-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-4">
                            <a href="#home" className="text-gray-700 hover:text-orange-600 font-medium">Home</a>
                            <a href="#restaurants" className="text-gray-700 hover:text-orange-600 font-medium">Restaurants</a>
                            <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium">Features</a>
                            <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium">Contact</a>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                <button className="text-gray-700 hover:text-orange-600 font-medium text-left">Sign In</button>
                                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
