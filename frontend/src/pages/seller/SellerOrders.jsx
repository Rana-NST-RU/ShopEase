import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get('/api/seller/orders')
            .then(({ data }) => setOrders(data))
            .catch((error) => console.error('Failed to load orders:', error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                <p className="mt-2 text-gray-600">View orders containing your products</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders containing your products will appear here</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium rounded-lg ${order.status === 'PAID'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Customer: {order.user.name}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900">Your Products in this Order:</h4>
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {item.product.imageUrl && (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                    Payment ID: {order.paymentId || 'N/A'}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    Your Revenue: $
                                    {order.items
                                        .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
                                        .toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
