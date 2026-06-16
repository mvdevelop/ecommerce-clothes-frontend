import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, FileText, ChevronRight, MapPin, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartItems, selectSubtotal, selectShipping, setShipping, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { fetchAddresses, createAddress, selectAddresses } from '../store/slices/addressSlice';
import { selectAuthToken } from '../store/slices/authSlice';
import { showError, showSuccess } from '../services/toastService';

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { id: 'pix', label: 'Pix', icon: Smartphone },
  { id: 'boleto', label: 'Boleto', icon: FileText },
];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectSubtotal);
  const shipping = useAppSelector(selectShipping);
  const addresses = useAppSelector(selectAddresses);
  const token = useAppSelector(selectAuthToken);

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '', recipient: '', phone: '', street: '', number: '',
    complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchAddresses());
    window.scrollTo(0, 0);
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (selectedAddressId) {
      // Simulate shipping calculation
      dispatch(setShipping(19.90));
    }
  }, [selectedAddressId, dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-slate-400 mb-6">Add some products before checkout.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCreateAddress = async () => {
    if (!newAddress.street || !newAddress.number || !newAddress.city) {
      showError('Fill in required address fields');
      return;
    }
    const addressData = {
      ...newAddress,
      id: '',
      isDefault: addresses.length === 0,
      recipient: newAddress.recipient || newAddress.street,
      phone: newAddress.phone || '(00) 00000-0000',
    };
    await dispatch(createAddress(addressData));
    setShowAddressForm(false);
    setNewAddress({ label: '', recipient: '', phone: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' });
    showSuccess('Address added!');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { showError('Select a delivery address'); return; }
    const discount = 0;
    const total = subtotal + shipping - discount;

    const result = await dispatch(createOrder({
      items: cartItems.map((i) => ({
        productId: i.productId, name: i.name, image: i.image,
        size: i.size, color: i.color, price: i.price, quantity: i.quantity,
      })),
      subtotal, shipping, discount, total: Math.max(0, total),
      addressId: selectedAddressId, paymentMethod,
    }));

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      showSuccess('Order placed successfully!');
      navigate(`/order/${result.payload.id}`);
    } else {
      showError('Failed to place order');
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left - Form */}
        <div className="flex-1 max-w-2xl">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-8 text-sm">
            {['Address', 'Payment', 'Review'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= i + 1 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>{i + 1}</div>
                <span className={step >= i + 1 ? 'text-white' : 'text-slate-500'}>{s}</span>
                {i < 2 && <ChevronRight size={16} className="text-slate-600" />}
              </div>
            ))}
          </div>

          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-lg font-medium mb-4">Delivery Address</h2>
              {addresses.map((addr) => (
                <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border mb-3 cursor-pointer transition ${
                  selectedAddressId === addr.id ? 'border-pink-500 bg-pink-500/5' : 'border-slate-800 hover:border-slate-600'
                }`}>
                  <input type="radio" name="address" checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)} className="accent-pink-500 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{addr.label || 'Address'}</p>
                    <p className="text-slate-400 text-sm">{addr.street}, {addr.number} - {addr.neighborhood}</p>
                    <p className="text-slate-400 text-sm">{addr.city}, {addr.state} - {addr.zipCode}</p>
                  </div>
                </label>
              ))}

              <button onClick={() => setShowAddressForm(!showAddressForm)}
                className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition mt-2 text-sm">
                <Plus size={16} /> {showAddressForm ? 'Cancel' : 'Add new address'}
              </button>

              {showAddressForm && (
                <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {['label', 'recipient', 'phone', 'zipCode'].map((f) => (
                      <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={newAddress[f as keyof typeof newAddress]}
                        onChange={(e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value })}
                        className="col-span-1 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm" />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['street', 'number', 'neighborhood'].map((f) => (
                      <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={newAddress[f as keyof typeof newAddress]}
                        onChange={(e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value })}
                        className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['city', 'state'].map((f) => (
                      <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={newAddress[f as keyof typeof newAddress]}
                        onChange={(e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value })}
                        className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm" />
                    ))}
                  </div>
                  <button onClick={handleCreateAddress}
                    className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 rounded-full text-white text-sm font-medium">
                    Save Address
                  </button>
                </div>
              )}

              <button onClick={() => setStep(2)} disabled={!selectedAddressId}
                className="mt-6 px-8 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-full text-white font-medium">
                Continue to Payment
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === pm.id ? 'border-pink-500 bg-pink-500/5' : 'border-slate-800 hover:border-slate-600'
                    }`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)} className="accent-pink-500" />
                      <Icon size={22} className="text-slate-300" />
                      <span className="text-white">{pm.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)}
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-900 rounded-full text-white">
                  Back
                </button>
                <button onClick={() => setStep(3)}
                  className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white font-medium">
                  Review Order
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-lg font-medium mb-4">Review Your Order</h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <p className="text-sm text-slate-400">Delivery to:</p>
                {selectedAddress && (
                  <p className="text-white text-sm">{selectedAddress.street}, {selectedAddress.number} – {selectedAddress.city}/{selectedAddress.state}</p>
                )}
                <hr className="border-slate-800" />
                <p className="text-sm text-slate-400">Payment: {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</p>
                <hr className="border-slate-800" />
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.name} ({item.size}, {item.color}) x{item.quantity}</span>
                    <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <button onClick={handlePlaceOrder}
                className="mt-6 w-full py-3.5 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] rounded-full text-white font-medium">
                Place Order — ${Math.max(0, subtotal + shipping).toFixed(2)}
              </button>
            </motion.div>
          )}
        </div>

        {/* Right - Summary */}
        <div className="w-full lg:w-80 bg-slate-950 border border-slate-800 rounded-xl p-6 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <hr className="border-slate-800" />
            <div className="flex justify-between text-white font-semibold text-base">
              <span>Total</span>
              <span className="text-pink-500">${Math.max(0, subtotal + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
