import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get orderId from state passed during navigation
    const orderId = location.state?.orderId;

    useEffect(() => {
        if (!orderId) {
            // If no order ID, redirect to products
            navigate('/products');
            return;
        }

        // Fetch the order details
        setLoading(true);
        api
            .get(`/api/orders/${orderId}`)
            .then(({ data }) => setOrder(data))
            .catch((error) => {
                console.error('Failed to fetch order:', error);
                navigate('/products');
            })
            .finally(() => setLoading(false));
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto py-12">
            {/* Success Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
                <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Order #{order.id}</h2>
                            <p className="text-sm text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${order.status === 'PAID'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                        {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                        {item.product?.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product?.name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <span className="text-2xl">📦</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{item.product?.name || `Product #${item.productId}`}</h4>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)} each</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${Number(order.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-primary-600">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate('/products')}
                    className="flex-1 btn-primary justify-center"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex-1 btn-secondary justify-center"
                >
                    Back to Home
                </button>
            </div>

            {/* What's Next Section */}
            <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>You will receive an order confirmation email shortly</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>We'll notify you when your order is shipped</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Track your order status in real-time</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
