import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-xs font-bold uppercase tracking-wider">View Details</p>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-md">
            {product.category}
          </span>
        </div>

        <Link to={`/products/${product.id}`} className="block mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 text-lg" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4 mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <div className="text-xs">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Out of Stock
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${product.stock > 0
              ? 'bg-gray-900 text-white hover:bg-primary-600 shadow-md hover:shadow-lg active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {product.stock > 0 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add to Cart
            </>
          ) : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}


