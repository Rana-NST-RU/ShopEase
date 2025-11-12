import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navLink = ({ isActive }) =>
    `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'text-black' : 'text-gray-600'}`;

  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
        <Link to="/" className="font-semibold text-xl">ShopEase</Link>
        <div className="flex gap-1 ml-4">
          <NavLink to="/products" className={navLink}>Products</NavLink>
          <NavLink to="/cart" className={navLink}>
            Cart
            {totalItems > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-black text-white rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!user ? (
            <>
              <NavLink to="/login" className={navLink}>Login</NavLink>
              <NavLink to="/signup" className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800">Signup</NavLink>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">{user.name}</span>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLink}>Admin</NavLink>
              )}
              <button onClick={handleLogout} className="px-3 py-2 rounded border hover:bg-gray-100">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}


