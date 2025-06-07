'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn,  AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/features/authSlice';

interface AuthFormProps {
    isSignUp: boolean;
}

const AuthForm = ({ isSignUp }: AuthFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isLoading, error, restaurantInfo } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUp) {
            dispatch(loginUser({ email, password }));
        } else {
            // Placeholder for signup logic
            alert('Signup not implemented yet.');
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

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
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
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <AlertCircle className="w-5 h-5 inline-block mr-2" />
                            <span className="align-middle">{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm">
                        {/* Email Input */}
                        <div className="relative mb-4">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input id="email-address" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Email address" />
                        </div>
                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="Password" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" /> Sign In
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