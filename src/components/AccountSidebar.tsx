import { Link, useLocation } from 'react-router-dom';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { showInfo } from '../services/toastService';

const links = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'My Orders', href: '/my-orders', icon: Package },
  { name: 'Addresses', href: '/my-addresses', icon: MapPin },
];

export default function AccountSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    showInfo('Logout realizado');
    window.location.replace('/');
  };

  return (
    <div className="w-full md:w-56 flex-shrink-0">
      <nav className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-pink-600/10 text-pink-500 border border-pink-800/50'
                  : 'text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
        <hr className="border-slate-800 my-2" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-900 transition w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </div>
  );
}
