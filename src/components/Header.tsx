// src/components/Header.tsx
'use client'
import { ChefHat, Menu, X, ShoppingCart, User, ChevronDown, Clock, History, LogOut, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItemCount } from '@/store/features/cartSlice';
import { logout } from '@/store/features/authSlice';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState<boolean>(false);
    const { user } = useAppSelector((state) => state.auth);
    const cartItemCount = useAppSelector(selectCartItemCount);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    // Logout handler
    const handleLogout = () => {
        dispatch(logout());
        setIsCartDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCartDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-8 h-8 text-orange-600" />
                            <h1 className="text-2xl font-bold text-orange-600">FoodieExpress</h1>
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link href="#home" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
                        <Link href="#restaurants" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Restaurants</Link>
                        <Link href="#features" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Features</Link>
                        <Link href="#about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">About</Link>
                        <Link href="#contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</Link>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            // Authenticated user section
                            <>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium truncate max-w-32">{user.email}</span>
                                </div>

                                {/* Cart Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                                        className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
                                    >
                                        <Settings className="w-6 h-6 text-gray-600" />
                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isCartDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <Link
                                                href="/cart"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsCartDropdownOpen(false)}
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-3" />
                                                <span>Cart</span>
                                                {cartItemCount > 0 && (
                                                    <span className="ml-auto bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href="/track_order"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsCartDropdownOpen(false)}
                                            >
                                                <Clock className="w-4 h-4 mr-3" />
                                                <span>Pending Orders</span>
                                            </Link>
                                            <Link
                                                href="/order-history"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsCartDropdownOpen(false)}
                                            >
                                                <History className="w-4 h-4 mr-3" />
                                                <span>Order History</span>
                                            </Link>
                                            <div className="border-t border-gray-200 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Unauthenticated user section
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                                    Get Started
                                </Link>
                            </>
                        )}
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
                            <Link href="#home" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
                            <Link href="#restaurants" className="text-gray-700 hover:text-orange-600 font-medium">Restaurants</Link>
                            <Link href="#features" className="text-gray-700 hover:text-orange-600 font-medium">Features</Link>
                            <Link href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</Link>
                            <Link href="#contact" className="text-gray-700 hover:text-orange-600 font-medium">Contact</Link>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                {user ? (
                                    // Authenticated user mobile section
                                    <>
                                        <div className="flex items-center space-x-2 text-gray-700 px-2">
                                            <User className="w-5 h-5" />
                                            <span className="font-medium truncate">{user.email}</span>
                                        </div>
                                        <Link href="/cart" className="flex items-center justify-between text-gray-700 hover:text-orange-600 font-medium">
                                            <div className="flex items-center">
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Cart
                                            </div>
                                            {cartItemCount > 0 && (
                                                <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link href="/track_order" className="flex items-center text-gray-700 hover:text-orange-600 font-medium">
                                            <Clock className="w-5 h-5 mr-2" />
                                            Pending Orders
                                        </Link>
                                        <Link href="/order-history" className="flex items-center text-gray-700 hover:text-orange-600 font-medium">
                                            <History className="w-5 h-5 mr-2" />
                                            Order History
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-red-600 hover:text-red-700 font-medium text-left"
                                        >
                                            <LogOut className="w-5 h-5 mr-2" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    // Unauthenticated user mobile section
                                    <>
                                        <Link href="/login" className="text-gray-700 hover:text-orange-600 font-medium text-left">Sign In</Link>
                                        <Link href="/signup" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-left">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header