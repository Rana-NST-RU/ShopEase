import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const { data: orderData } = await api.post('/api/orders', { items });

      // Simulate payment
      const { data: paymentData } = await api.post('/api/payment/demo', {
        orderId: orderData.order.id,
        amount: totalPrice,
      });

      if (paymentData.success) {
        // After successful payment, confirm the order (this will decrement stock)
        try {
          await api.post(`/api/orders/${orderData.order.id}/confirm`);
        } catch (confirmError) {
          // If confirmation fails, still clear cart but show message
          console.error('Order confirmation failed:', confirmError);
        }
        clearCart();
        navigate('/products', { state: { message: 'Order placed successfully!' } });
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between p-3 border rounded">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="border-t pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Payment Information</h3>
        <p className="text-sm text-gray-600">
          This is a demo checkout. No real payment will be processed.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Complete Order'}
      </button>
    </div>
  );
}



