'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, signUpUser } from '@/store/features/authSlice';

interface AuthFormProps {
    isSignUp: boolean;
}

const AuthForm = ({ isSignUp }: AuthFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isLoading, error: serverError, restaurantInfo } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (isSignUp) {
            if (password !== confirmPassword) {
                setFormError("Passwords do not match!");
                return;
            }
            dispatch(signUpUser({ email, password }));
        } else {
            dispatch(loginUser({ email, password }));
        }
    };

    useEffect(() => {
        if (user && !isLoading) {
            if (restaurantInfo) {
                router.push('/dashboard/restaurant-info');
            } else {
                router.push('/restaurant-setup');
            }
        }
    }, [user, restaurantInfo, isLoading, router]);

    const displayError = formError || serverError;

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isSignUp ? 'Already have an account?' : 'Or'}{' '}
                        <Link href={isSignUp ? '/login' : '/signup'} className="font-medium text-orange-600 hover:text-orange-500">
                            {isSignUp ? 'Sign in' : 'create an account'}
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {displayError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <AlertCircle className="w-5 h-5 inline-block mr-2" />
                            <span className="align-middle">{displayError}</span>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-orange-500"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'} // Dynamically set type
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                                placeholder="Password (min. 6 characters)"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {isSignUp && (
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full text-black pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <button type="submit" className="group mt-6 relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-3 text-sm font-medium text-white cursor-pointer hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="mr-2 h-5 w-5" /> : <LogIn className="mr-2 h-5 w-5" />}
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
