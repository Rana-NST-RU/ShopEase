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
    <div className="group border rounded-lg overflow-hidden bg-white hover:shadow-md transition">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-2xl">📦</div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium group-hover:text-black line-clamp-1 flex-1">{product.name}</h3>
            <span className="text-sm font-semibold">${Number(product.price).toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{product.category}</div>
          {product.stock > 0 ? (
            <div className="text-xs text-green-600 mt-1">In Stock</div>
          ) : (
            <div className="text-xs text-red-600 mt-1">Out of Stock</div>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}


