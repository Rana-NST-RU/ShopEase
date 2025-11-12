import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/products" className="inline-block px-4 py-2 bg-black text-white rounded">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white">
                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-lg font-semibold mt-1">${Number(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 border p-1 rounded text-center"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-20 p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full text-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


