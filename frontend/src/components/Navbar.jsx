import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navLink = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}`;

  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 hover:opacity-80 transition-opacity">
          ShopEase
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/50 p-1 rounded-2xl border border-white/20 shadow-sm backdrop-blur-md">
          <NavLink to="/products" className={navLink}>Products</NavLink>
          <NavLink to="/cart" className={navLink} style={{ position: 'relative' }}>
            <span className="flex items-center gap-1">
              Cart
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <NavLink to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-4 transition-colors">Login</NavLink>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                <span className="text-xs text-primary-600 font-medium">{user.role}</span>
              </div>

              {user.role === 'ADMIN' && (
                <Link to="/admin" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Admin Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </Link>
              )}

              {user.role === 'SELLER' && (
                <Link to="/seller" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Seller Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}


