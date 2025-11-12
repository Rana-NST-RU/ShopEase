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
    <div className="py-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg border min-h-[400px] flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">📦</div>
              <div>No image available</div>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl font-bold mb-4">${Number(product.price).toFixed(2)}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value, 10) || 1)))}
              className="border p-2 rounded w-24"
            />
            <p className="text-sm text-gray-600 mt-1">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}


