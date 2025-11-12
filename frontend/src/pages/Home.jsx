import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage(''), 5000);
    }
  }, [location]);

  return (
    <div className="py-10">
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {message}
        </div>
      )}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopEase</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover great products at great prices. Shop with ease!
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 text-lg"
        >
          Browse Products
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">🛍️</div>
          <h3 className="font-semibold mb-2">Easy Shopping</h3>
          <p className="text-sm text-gray-600">
            Browse through our wide selection of products with advanced filtering and search.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-semibold mb-2">Fast Checkout</h3>
          <p className="text-sm text-gray-600">
            Quick and secure checkout process. Get your orders delivered fast.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">💳</div>
          <h3 className="font-semibold mb-2">Secure Payments</h3>
          <p className="text-sm text-gray-600">
            Safe and reliable payment processing for all your purchases.
          </p>
        </div>
      </div>
    </div>
  );
}


