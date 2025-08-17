'use client';
import React, { useEffect, useState } from 'react';

const ReportPage = () => {
    const [activeTab, setActiveTab] = useState('user');
    const [orderStatus, setOrderStatus] = useState(1);
    const [vendorView, setVendorView] = useState('earnings');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Load Chart.js from CDN and initialize charts
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            const Chart = (window as any).Chart; // eslint-disable-line @typescript-eslint/no-explicit-any
            
            // Vendor Chart
            const vendorCtx = (document.getElementById('vendorChart') as HTMLCanvasElement)?.getContext('2d');
            if (vendorCtx) {
                new Chart(vendorCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'GHS',
                            data: [1200, 1900, 3000, 5000, 2300, 3200],
                            backgroundColor: 'rgba(249, 115, 22, 0.6)',
                            borderColor: 'rgba(249, 115, 22, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { display: false } }
                    }
                });
            }

            // User Spending Chart
            const userSpendingCtx = (document.getElementById('userSpendingChart') as HTMLCanvasElement)?.getContext('2d');
            if (userSpendingCtx) {
                new Chart(userSpendingCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Local Ghanaian', 'Foreign Foods', 'Beverages', 'Snacks'],
                        datasets: [{
                            data: [45, 25, 15, 15],
                            backgroundColor: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            }

            // Ratings Distribution Chart
            const ratingsCtx = (document.getElementById('ratingsDistributionChart') as HTMLCanvasElement)?.getContext('2d');
            if (ratingsCtx) {
                new Chart(ratingsCtx, {
                    type: 'bar',
                    data: {
                        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                        datasets: [{
                            label: 'Number of Ratings',
                            data: [125, 78, 32, 10, 5],
                            backgroundColor: [
                                'rgba(34, 197, 94, 0.6)',
                                'rgba(139, 92, 246, 0.6)',
                                'rgba(251, 191, 36, 0.6)',
                                'rgba(251, 146, 60, 0.6)',
                                'rgba(239, 68, 68, 0.6)'
                            ],
                            borderColor: [
                                'rgba(34, 197, 94, 1)',
                                'rgba(139, 92, 246, 1)',
                                'rgba(251, 191, 36, 1)',
                                'rgba(251, 146, 60, 1)',
                                'rgba(239, 68, 68, 1)'
                            ],
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { x: { beginAtZero: true } },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        };
        document.head.appendChild(script);
    }, [mounted]);

    const statusDetails = {
        1: { text: "Your order has been placed and is awaiting confirmation from the restaurant.", progress: "0%", iconIndex: 0 },
        2: { text: "The restaurant has confirmed your order and is now preparing your meal.", progress: "33.3%", iconIndex: 1 },
        4: { text: "Your order is on the way! The delivery rider is en route to your location.", progress: "66.6%", iconIndex: 2 },
        5: { text: "Your order has been delivered. Enjoy your meal!", progress: "100%", iconIndex: 3 }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleOrderStatusChange = (status: number) => {
        setOrderStatus(status);
    };

    const handleVendorViewChange = (view: string) => {
        setVendorView(view);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F0' }}>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FDF8F0', color: '#1E293B' }}>
            <style jsx>{`
                .chart-container {
                    position: relative;
                    width: 100%;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                    height: 300px;
                    max-height: 400px;
                }
                @media (min-width: 768px) {
                    .chart-container {
                        height: 350px;
                    }
                }
            `}</style>

            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-orange-100">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-orange-600">FoodieExpress Report</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a href="#introduction" className="text-gray-600 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Introduction</a>
                                <a href="#platform" className="text-gray-600 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">The Platform</a>
                                <a href="#findings" className="text-gray-600 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Key Findings</a>
                                <a href="#conclusion" className="text-gray-600 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Conclusion</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <section id="introduction" className="mb-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">Bridging the Gap in Ghana&apos;s Food Delivery Ecosystem</h1>
                    <p className="max-w-3xl mx-auto text-lg text-slate-600">
                        This interactive report explores the FoodieExpress platform, a student-led project from AAMUSTED designed to solve key challenges in the Ghanaian food delivery market. The platform addresses issues from inefficient order management for vendors to a lack of real-time tracking and analytics for customers.
                    </p>
                </section>

                <section id="platform" className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800">The Platform in Action</h2>
                        <p className="mt-2 text-slate-600">An integrated solution for both customers and restaurant vendors.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button 
                                    onClick={() => handleTabChange('user')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'user' 
                                            ? 'border-orange-500 text-orange-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    The User Experience
                                </button>
                                <button 
                                    onClick={() => handleTabChange('vendor')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'vendor' 
                                            ? 'border-orange-500 text-orange-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    The Vendor Dashboard
                                </button>
                            </nav>
                        </div>

                        <div className={activeTab === 'user' ? '' : 'hidden'}>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Real-Time Order Tracking</h3>
                                    <p className="text-slate-600 mb-6">A core objective was to eliminate customer uncertainty. The platform provides a transparent, step-by-step view of the order process, from confirmation to delivery, enhancing user trust and satisfaction.</p>
                                    <div className="bg-orange-50 text-orange-800 p-4 rounded-lg mb-6 text-center font-medium">
                                        {statusDetails[orderStatus as keyof typeof statusDetails]?.text}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleOrderStatusChange(1)} className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm">Reset to Placed</button>
                                        <button onClick={() => handleOrderStatusChange(2)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm">Simulate: Preparing</button>
                                        <button onClick={() => handleOrderStatusChange(4)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm">Simulate: On The Way</button>
                                        <button onClick={() => handleOrderStatusChange(5)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm">Simulate: Delivered</button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="relative">
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200">
                                            <div className="h-1 bg-orange-500 transition-all duration-500" style={{width: statusDetails[orderStatus as keyof typeof statusDetails]?.progress}}></div>
                                        </div>
                                        <div className="flex justify-between items-start relative">
                                            <div className="flex flex-col items-center text-center w-20">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${orderStatus >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>✓</div>
                                                <p className={`mt-2 text-xs ${orderStatus >= 1 ? 'font-semibold' : 'font-medium text-gray-500'}`}>Placed</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center w-20">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${orderStatus >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>🍳</div>
                                                <p className={`mt-2 text-xs ${orderStatus >= 2 ? 'font-semibold' : 'font-medium text-gray-500'}`}>Preparing</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center w-20">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${orderStatus >= 4 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>🚚</div>
                                                <p className={`mt-2 text-xs ${orderStatus >= 4 ? 'font-semibold' : 'font-medium text-gray-500'}`}>On The Way</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center w-20">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${orderStatus >= 5 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>🏠</div>
                                                <p className={`mt-2 text-xs ${orderStatus >= 5 ? 'font-semibold' : 'font-medium text-gray-500'}`}>Delivered</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={activeTab === 'vendor' ? '' : 'hidden'}>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Empowering Local Businesses</h3>
                            <p className="text-slate-600 mb-8">The vendor dashboard provides restaurants with essential tools for menu management, order processing, and financial oversight, all in one place.</p>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-semibold text-slate-700">
                                        {vendorView === 'earnings' ? 'Monthly Earnings (GHS)' : 'Total Orders per Month'}
                                    </h4>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleVendorViewChange('earnings')}
                                            className={`px-3 py-1 text-sm rounded-md ${vendorView === 'earnings' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'}`}
                                        >
                                            Earnings
                                        </button>
                                        <button 
                                            onClick={() => handleVendorViewChange('orders')}
                                            className={`px-3 py-1 text-sm rounded-md ${vendorView === 'orders' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'}`}
                                        >
                                            Orders
                                        </button>
                                    </div>
                                </div>
                                <div className="chart-container h-80">
                                    <canvas id="vendorChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="findings" className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800">Key Findings & Analytics</h2>
                        <p className="mt-2 text-slate-600">Data-driven insights from the platform&apos;s operations.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">User Spending by Cuisine</h3>
                             <p className="text-sm text-slate-500 mb-4">The platform provides users with analytics on their spending habits, helping them manage their budget. This chart shows a sample breakdown of user spending across different cuisine types.</p>
                            <div className="chart-container h-80">
                                <canvas id="userSpendingChart"></canvas>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">Platform Ratings Distribution</h3>
                            <p className="text-sm text-slate-500 mb-4">A core feature is the rating system, which creates a feedback loop for quality control. The data shows a healthy distribution, with a majority of orders receiving positive feedback.</p>
                            <div className="chart-container h-80">
                                <canvas id="ratingsDistributionChart"></canvas>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="conclusion" className="bg-orange-600 text-white p-10 rounded-2xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Conclusion & Scope</h2>
                    <p className="max-w-3xl mx-auto">
                        FoodieExpress demonstrates the viability of a locally-developed, comprehensive food delivery solution in Ghana. By focusing on the core needs of both users and vendors, it provides a significant improvement over existing fragmented systems. While the initial scope is delimited to the platform&apos;s functionality within Kumasi, the architecture is designed for scalability, offering a strong foundation for future expansion.
                    </p>
                </section>

            </main>
        </div>
    );
};

export default ReportPage;
