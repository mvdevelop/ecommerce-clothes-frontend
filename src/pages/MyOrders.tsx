import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchOrders, selectOrders, selectOrdersLoading } from '../store/slices/orderSlice';
import { selectAuthToken } from '../store/slices/authSlice';
import AccountSidebar from '../components/AccountSidebar';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-800/30',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-800/30',
  shipped: 'bg-purple-500/10 text-purple-500 border-purple-800/30',
  delivered: 'bg-green-500/10 text-green-500 border-green-800/30',
  cancelled: 'bg-red-500/10 text-red-500 border-red-800/30',
};

export default function MyOrders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchOrders());
  }, [dispatch, token, navigate]);

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-2xl font-semibold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-6">My Orders</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 mb-4">No orders yet</p>
              <button onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 rounded-full text-white text-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} to={`/my-orders/${order.id}`}
                  className="block bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${statusColors[order.status] || ''}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{order.items?.length || 0} items</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pink-500 font-semibold">${order.total?.toFixed(2)}</span>
                      <ArrowRight size={16} className="text-slate-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
