import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchOrderById, selectCurrentOrder } from '../store/slices/orderSlice';

export default function OrderConfirmation() {
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
        <p className="text-slate-400">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-semibold mb-2">Order Confirmed!</h1>
        <p className="text-slate-400 mb-6">Your order #{order.id.slice(-8).toUpperCase()} has been placed.</p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Items</span>
            <span className="text-white">{order.items?.length || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total</span>
            <span className="text-pink-500 font-medium">${order.total?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Payment</span>
            <span className="text-white capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
          </div>
          <hr className="border-slate-800" />
          <p className="text-slate-400 text-xs">A confirmation email has been sent.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/my-orders')}
            className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white font-medium">
            View My Orders
          </button>
          <button onClick={() => navigate('/')}
            className="px-8 py-3 border border-slate-700 hover:bg-slate-900 rounded-full text-white">
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
