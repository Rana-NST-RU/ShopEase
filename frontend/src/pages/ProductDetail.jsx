import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      alert('Added to cart!');
    }
  }

  if (loading) {
    return (
      <div className="py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-10 text-center">Product not found</div>;
  }

  return (
    <div className="pb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 bg-gray-50 flex items-center justify-center min-h-[500px] border-b md:border-b-0 md:border-r border-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-block text-primary-600 font-bold tracking-wider text-sm mb-4 uppercase bg-primary-50 w-fit px-3 py-1 rounded-full">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 border-t border-b border-gray-100 py-8">
              {product.description || "No description available for this product."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium mb-2 text-gray-500 uppercase tracking-wide">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 hover:bg-white text-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value, 10) || 1)))}
                    className="w-full text-center bg-transparent outline-none font-semibold text-gray-900"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-3 hover:bg-white text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-7">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-xl
                    ${product.stock > 0
                      ? 'bg-gray-900 text-white hover:bg-primary-600 hover:shadow-primary-500/30'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

        {/* Overall Rating Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-gray-900 mb-2">4.5</div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={star <= 4.5 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= 4.5 ? "text-yellow-400" : "text-gray-300"}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on 127 reviews</p>
            </div>

            <div className="flex-1 w-full">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 7 : rating === 2 ? 2 : 1;
                return (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600 w-12">{rating} star</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {/* Review 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Alex Johnson</h4>
                    <p className="text-sm text-gray-500">Verified Purchase</p>
                  </div>
                  <span className="text-sm text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Excellent product!</h5>
                <p className="text-gray-600 leading-relaxed">
                  Amazing quality and fast delivery! The product exceeded my expectations. Highly recommend to anyone looking for a reliable option. The build quality is top-notch and it works flawlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                S
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Miller</h4>
                    <p className="text-sm text-gray-500">Verified Purchase</p>
                  </div>
                  <span className="text-sm text-gray-400">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Great value for money</h5>
                <p className="text-gray-600 leading-relaxed">
                  Good product overall. The only minor issue was the packaging could be better, but the item itself is fantastic. Would definitely buy again!
                </p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                M
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Verified Purchase</p>
                  </div>
                  <span className="text-sm text-gray-400">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Perfect choice!</h5>
                <p className="text-gray-600 leading-relaxed">
                  I've been using this for a month now and it's been perfect. The quality is outstanding and customer service was very helpful. Five stars all the way!
                </p>
              </div>
            </div>
          </div>

          {/* Review 4 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                E
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Emma Davis</h4>
                    <p className="text-sm text-gray-500">Verified Purchase</p>
                  </div>
                  <span className="text-sm text-gray-400">3 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Highly satisfied!</h5>
                <p className="text-gray-600 leading-relaxed">
                  Best purchase I've made this year! Everything about it is perfect - from the design to the functionality. ShopEase delivery was super quick too. Absolutely love it!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}


