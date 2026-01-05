import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [user]);

  async function loadCart() {
    if (user) {
      // Load from backend for logged-in users
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Transform backend cart format to frontend format
          const cartItems = data.items.map((item) => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item.id,
          }));
          setCart(cartItems);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem('cart');
      setCart(saved ? JSON.parse(saved) : []);
    }
    setLoading(false);
  }

  // Save to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Sync guest cart with backend on login
  useEffect(() => {
    async function syncGuestCart() {
      if (user) {
        const guestCart = localStorage.getItem('cart');
        if (guestCart) {
          const guestItems = JSON.parse(guestCart);
          if (guestItems.length > 0) {
            try {
              const token = localStorage.getItem('token');
              const items = guestItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              }));
              const response = await fetch(`${API_URL}/api/cart/sync`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items }),
              });
              if (response.ok) {
                localStorage.removeItem('cart'); // Clear guest cart
                loadCart(); // Reload merged cart
              }
            } catch (error) {
              console.error('Failed to sync cart:', error);
            }
          }
        }
      }
    }
    syncGuestCart();
  }, [user]);

  async function addToCart(product, quantity = 1) {
    console.log('Adding to cart:', { product, quantity, user });

    if (user) {
      // Add to backend
      try {
        const token = localStorage.getItem('token');
        console.log('Sending cart request to:', `${API_URL}/api/cart`);

        const response = await fetch(`${API_URL}/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity }),
        });

        console.log('Cart response status:', response.status);

        if (response.ok) {
          await loadCart(); // Reload cart from backend
          console.log('Item added to cart successfully');
          return true;
        } else {
          const errorData = await response.json();
          console.error('Failed to add to cart:', errorData);
          alert(`Failed to add to cart: ${errorData.error || 'Unknown error'}`);
          return false;
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        alert('Failed to add to cart. Please try again.');
        return false;
      }
    } else {
      // Add to localStorage
      console.log('Adding to guest cart (localStorage)');
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
      return true;
    }
  }

  async function removeFromCart(productId) {
    if (user) {
      // Remove from backend
      const item = cart.find((i) => i.id === productId);
      if (item && item.cartItemId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/cart/${item.cartItemId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            loadCart(); // Reload cart from backend
          }
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      }
    } else {
      // Remove from localStorage
      setCart((prev) => prev.filter((item) => item.id !== productId));
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      // Update in backend
      const item = cart.find((i) => i.id === productId);
      if (item && item.cartItemId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/cart/${item.cartItemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
          });
          if (response.ok) {
            loadCart(); // Reload cart from backend
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      }
    } else {
      // Update in localStorage
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }

  async function clearCart() {
    if (user) {
      // Clear from backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/cart`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setCart([]);
        }
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      // Clear from localStorage
      setCart([]);
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
