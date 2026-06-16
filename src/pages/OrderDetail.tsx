import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchOrderById, selectCurrentOrder } from '../store/slices/orderSlice';
import AccountSidebar from '../components/AccountSidebar';

const statusTimeline = ['confirmed', 'shipped', 'delivered'];
const statusLabels: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectCurrentOrder);

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [orderId, dispatch]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const currentStatusIdx = statusTimeline.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-2xl font-semibold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <button onClick={() => navigate('/my-orders')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm">
            <ArrowLeft size={16} /> Back to Orders
          </button>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Order #{order.id.slice(-8).toUpperCase()}</h2>
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                isCancelled ? 'bg-red-500/10 text-red-500 border-red-800/30' : 'bg-green-500/10 text-green-500 border-green-800/30'
              }`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Order Status</h3>
              <div className="flex items-center gap-2">
                {statusTimeline.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      i <= currentStatusIdx ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs ${i <= currentStatusIdx ? 'text-white' : 'text-slate-600'}`}>
                      {statusLabels[s]}
                    </span>
                    {i < statusTimeline.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < currentStatusIdx ? 'bg-pink-600' : 'bg-slate-800'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.name}</p>
                    <p className="text-slate-500 text-xs">{item.size}, {item.color} × {item.quantity}</p>
                  </div>
                  <span className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span>${order.shipping?.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
              <hr className="border-slate-800" />
              <div className="flex justify-between text-white font-semibold"><span>Total</span><span className="text-pink-500">${order.total?.toFixed(2)}</span></div>
            </div>
            <hr className="border-slate-800 my-4" />
            <h4 className="text-sm font-medium text-slate-400 mb-2">Delivery Address</h4>
            {order.address && (
              <p className="text-slate-300 text-sm">
                {order.address.street}, {order.address.number} – {order.address.neighborhood}<br />
                {order.address.city}, {order.address.state} – {order.address.zipCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
