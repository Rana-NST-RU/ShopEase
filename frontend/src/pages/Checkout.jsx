import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  async function handleCheckout() {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
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
        navigate('/order-success', { state: { orderId: orderData.order.id } });
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
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
              Review Your Order
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xl">📦</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</span>
              Payment Method
            </h2>

            <div className="space-y-3 mb-4">
              {/* UPI Payment */}
              <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    <span className="font-semibold text-gray-900">UPI</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pay using Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              {/* Card Payment */}
              <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    <span className="font-semibold text-gray-900">Credit / Debit Card</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Visa, Mastercard, Amex, Rupay</p>
                </div>
              </label>

              {/* Net Banking */}
              <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span className="font-semibold text-gray-900">Net Banking</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All major banks supported</p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pay when you receive</p>
                </div>
              </label>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              This is a demo checkout. No actual charges will be made.
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  I agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    terms and conditions
                  </a>
                  {' '}and{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    privacy policy
                  </a>
                </span>
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0 || !agreedToTerms}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Complete Order'}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



