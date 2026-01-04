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
    <div className="pb-20">
      {message && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-lg border-l-4 border-l-green-500 animate-fade-in flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="font-medium">{message}</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white shadow-2xl mb-16 isolate">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-500 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500 blur-3xl opacity-20"></div>

        <div className="relative px-8 py-20 md:py-32 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight animate-slide-up">
            Shop smart. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">Live better.</span>
          </h1>
          <p className="text-lg md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover a world of premium products at unbeatable prices. Experience shopping reimagined.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-primary-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-1 active:scale-95"
            >
              Browse Products
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary-700/50 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-primary-700/70 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover group">
          <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 text-primary-600">
            🛍️
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">Easy Shopping</h3>
          <p className="text-gray-600 leading-relaxed">
            Browse through our curated selection with advanced filtering. Finding your perfect item has never been easier.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover group">
          <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 text-teal-600">
            🚀
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">Lightning Fast</h3>
          <p className="text-gray-600 leading-relaxed">
            Experience our optimized checkout process. From click to ship, we prioritize speed without compromising security.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover group">
          <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 text-rose-600">
            🛡️
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">Secure Payments</h3>
          <p className="text-gray-600 leading-relaxed">
            Your security is our top priority. We use banking-grade encryption to ensure your data stays safe.
          </p>
        </div>
      </div>
    </div>
  );
}


