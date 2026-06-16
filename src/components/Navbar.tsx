import { FaCartPlus } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, Package, MapPin, LogOut, ChevronDown } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, selectAuthToken, selectAuthUser } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { showInfo } from '../services/toastService';

const navLinks = [
  { name: 'Shop', href: '/' },
  { name: 'Men', href: '/men' },
  { name: 'Women', href: '/women' },
  { name: 'Kids', href: '/kids' },
  { name: 'Shoes', href: '/shoes' },
  { name: 'Watches', href: '/watches' },
];

function Navbar() {
  const [menu, setMenu] = useState<string>('shop');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext)!;
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    showInfo('Logout realizado com sucesso');
    window.location.replace('/');
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-black/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-300 flex items-center justify-center text-black font-bold text-sm">
            C
          </div>
          <span className="font-semibold text-white hidden sm:inline">
            Clothes.com
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMenu(link.name.toLowerCase())}
              className={`transition ${
                menu === link.name.toLowerCase()
                  ? 'text-pink-300'
                  : 'text-white hover:text-pink-300'
              }`}
            >
              {link.name}
              {menu === link.name.toLowerCase() && (
                <motion.hr
                  className="border-pink-500 mt-0.5"
                  layoutId="nav-underline"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {/* Account */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-sm text-white hover:border-pink-500 transition"
              >
                <User size={16} />
                {user?.name?.split(' ')[0] || 'Account'}
                <ChevronDown size={14} />
              </button>
              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-48 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-xl">
                    <Link to="/profile" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/my-orders" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/my-addresses" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition">
                      <MapPin size={16} /> Addresses
                    </Link>
                    <hr className="border-slate-800 my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition w-full">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-5 py-2 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-sm">
                Login
              </button>
            </Link>
          )}
          <Link to="/cart" className="relative">
            <FaCartPlus className="text-white hover:text-pink-300 transition text-xl" />
            <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {getTotalCartItems()}
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setIsMobileOpen(true)} className="md:hidden">
          <Menu size={26} className="active:scale-90 transition text-white" />
        </button>
      </motion.nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/90 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={() => {
              setMenu(link.name.toLowerCase());
              setIsMobileOpen(false);
            }}
            className={`transition ${
              menu === link.name.toLowerCase()
                ? 'text-pink-300'
                : 'text-white hover:text-pink-300'
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/cart" onClick={() => setIsMobileOpen(false)}
          className="text-white hover:text-pink-300 transition flex items-center gap-2">
          <FaCartPlus /> Cart ({getTotalCartItems()})
        </Link>
        {token ? (
          <>
            <Link to="/profile" onClick={() => setIsMobileOpen(false)}
              className="text-white hover:text-pink-300 transition">Profile</Link>
            <Link to="/my-orders" onClick={() => setIsMobileOpen(false)}
              className="text-white hover:text-pink-300 transition">My Orders</Link>
            <button onClick={() => { handleLogout(); setIsMobileOpen(false); }}
              className="text-red-400 transition">Logout</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setIsMobileOpen(false)}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
            Login
          </Link>
        )}
        <button onClick={() => setIsMobileOpen(false)}
          className="active:ring-2 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
          <X />
        </button>
      </div>
    </>
  );
}

export default Navbar;
