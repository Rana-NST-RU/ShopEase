import { Link } from 'react-router-dom';

export default function About() {
    const stats = [
        { label: 'Active Sellers', value: '500+' },
        { label: 'Products Listed', value: '10,000+' },
        { label: 'Happy Customers', value: '50,000+' },
        { label: 'Countries Served', value: '25+' },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Verified Buyer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
            rating: 5,
            text: 'ShopEase has become my go-to marketplace for everything! The variety of products and the quality of sellers is outstanding. I love how easy it is to find exactly what I need.',
        },
        {
            name: 'Michael Chen',
            role: 'Seller - TechGear Store',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            rating: 5,
            text: 'As a seller, ShopEase has given me the perfect platform to reach customers worldwide. The seller dashboard is intuitive and the support team is always helpful.',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Verified Buyer',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            rating: 5,
            text: 'Fast shipping, great prices, and excellent customer service. I\'ve made over 20 purchases and every experience has been fantastic. Highly recommend!',
        },
        {
            name: 'David Thompson',
            role: 'Seller - Fashion Hub',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
            rating: 5,
            text: 'ShopEase has transformed my small business. The multi-vendor platform makes it easy to manage my inventory and connect with customers who love my products.',
        },
        {
            name: 'Lisa Anderson',
            role: 'Verified Buyer',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
            rating: 5,
            text: 'The product quality and seller reliability on ShopEase is unmatched. I appreciate the detailed product descriptions and honest reviews from other customers.',
        },
        {
            name: 'James Wilson',
            role: 'Verified Buyer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
            rating: 5,
            text: 'Been shopping on ShopEase for over a year now. The checkout process is smooth, and I love the variety of payment options. Great marketplace!',
        },
    ];

    const features = [
        {
            icon: '🛡️',
            title: 'Secure Shopping',
            description: 'Your transactions are protected with industry-leading security measures.',
        },
        {
            icon: '🚚',
            title: 'Fast Delivery',
            description: 'Get your orders delivered quickly with our reliable shipping partners.',
        },
        {
            icon: '💯',
            title: 'Quality Guaranteed',
            description: 'All sellers are verified and products meet our quality standards.',
        },
        {
            icon: '💬',
            title: '24/7 Support',
            description: 'Our customer support team is always here to help you.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">About ShopEase</h1>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                            Your trusted multi-vendor marketplace connecting quality sellers with smart shoppers worldwide.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Founded in 2024, ShopEase was born from a simple idea: create a marketplace where quality sellers
                                    and discerning shoppers can connect seamlessly. We believe in empowering entrepreneurs and providing
                                    customers with an unparalleled shopping experience.
                                </p>
                                <p>
                                    Today, ShopEase has grown into a thriving community of sellers and buyers from around the world.
                                    Our platform hosts thousands of products across multiple categories, from cutting-edge electronics
                                    to stylish fashion, home essentials, and fitness gear.
                                </p>
                                <p>
                                    We're committed to maintaining the highest standards of quality, security, and customer satisfaction.
                                    Every seller on our platform is carefully vetted, and every transaction is protected by our secure
                                    payment system.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                                alt="Team collaboration"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShopEase?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're more than just a marketplace. We're your trusted partner in online shopping.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Don't just take our word for it. Here's what our customers and sellers have to say.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
                    <p className="text-primary-100 mb-8 text-lg">
                        Join thousands of happy customers and discover amazing products today.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/products"
                            className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Browse Products
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-3 bg-primary-800 text-white font-semibold rounded-xl hover:bg-primary-900 transition-colors border-2 border-white/20"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
