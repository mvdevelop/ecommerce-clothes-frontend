import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser, selectAuthToken } from '../store/slices/authSlice';
import AccountSidebar from '../components/AccountSidebar';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-2xl font-semibold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                <p className="text-slate-400">{user?.email}</p>
              </div>
            </div>

            <hr className="border-slate-800 my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Package, label: 'Orders', desc: 'View order history', href: '/my-orders' },
                { icon: MapPin, label: 'Addresses', desc: 'Manage addresses', href: '/my-addresses' },
                { icon: User, label: 'Profile', desc: 'Edit your info', href: '#' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={() => item.href !== '#' && navigate(item.href)}
                    className="flex flex-col items-center gap-2 p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-pink-500/50 transition group">
                    <Icon size={28} className="text-pink-500 group-hover:scale-110 transition" />
                    <p className="text-white font-medium text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
