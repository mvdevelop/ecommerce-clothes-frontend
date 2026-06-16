import { FaCartPlus } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { showInfo } from '../services/toastService';

const navLinks = [
  { name: 'Shop', href: '/' },
  { name: 'Men', href: '/men' },
  { name: 'Women', href: '/women' },
  { name: 'Kids', href: '/kids' },
];

function Navbar() {
  const [menu, setMenu] = useState<string>('shop');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext)!;
  const dispatch = useAppDispatch();

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
          {localStorage.getItem('auth-token') ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-sm"
            >
              Logout
            </button>
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
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden"
        >
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
        <Link
          to="/cart"
          onClick={() => setIsMobileOpen(false)}
          className="text-white hover:text-pink-300 transition flex items-center gap-2"
        >
          <FaCartPlus /> Cart ({getTotalCartItems()})
        </Link>
        <Link
          to="/login"
          onClick={() => setIsMobileOpen(false)}
          className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
        >
          Login
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="active:ring-2 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex"
        >
          <X />
        </button>
      </div>
    </>
  );
}

export default Navbar;
