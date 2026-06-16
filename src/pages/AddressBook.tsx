import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAddresses, createAddress, updateAddress, deleteAddress, selectAddresses } from '../store/slices/addressSlice';
import { selectAuthToken } from '../store/slices/authSlice';
import { showSuccess, showError } from '../services/toastService';
import AccountSidebar from '../components/AccountSidebar';

export default function AddressBook() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const token = useAppSelector(selectAuthToken);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: '', recipient: '', phone: '', street: '', number: '',
    complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchAddresses());
  }, [dispatch, token, navigate]);

  const resetForm = () => {
    setForm({ label: '', recipient: '', phone: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: typeof addresses[0]) => {
    setForm({ ...addr, complement: addr.complement || '' });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.street || !form.number || !form.city) {
      showError('Street, number and city are required');
      return;
    }
    const data = { ...form, isDefault: addresses.length === 0, id: '' };
    if (editingId) {
      await dispatch(updateAddress({ id: editingId, data }));
      showSuccess('Address updated');
    } else {
      await dispatch(createAddress(data));
      showSuccess('Address added');
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteAddress(id));
    showSuccess('Address removed');
  };

  const handleSetDefault = async (id: string) => {
    await dispatch(updateAddress({ id, data: { isDefault: true } as Partial<typeof addresses[0]> }));
    showSuccess('Default address updated');
  };

  const inputClass = 'px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm';

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-2xl font-semibold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">My Addresses</h2>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white text-sm">
              <Plus size={16} /> {showForm ? 'Cancel' : 'Add'}
            </button>
          </div>

          {showForm && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {['label', 'recipient', 'phone'].map((f) => (
                  <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    className={inputClass} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['street', 'number', 'neighborhood'].map((f) => (
                  <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    className={inputClass} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['city', 'state'].map((f) => (
                  <input key={f} name={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    className={inputClass} />
                ))}
              </div>
              <input name="zipCode" placeholder="Zip Code" value={form.zipCode}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className={inputClass} />
              <button onClick={handleSave}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 rounded-full text-white text-sm font-medium">
                {editingId ? 'Update' : 'Save'} Address
              </button>
            </div>
          )}

          {addresses.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <MapPin size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No addresses saved yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-pink-500 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{addr.label || 'Address'}</p>
                          {addr.isDefault && <Star size={14} className="fill-pink-500 text-pink-500" />}
                        </div>
                        <p className="text-slate-400 text-sm">{addr.street}, {addr.number}</p>
                        <p className="text-slate-400 text-sm">{addr.neighborhood} – {addr.city}/{addr.state}</p>
                        <p className="text-slate-500 text-xs">{addr.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)} title="Set as default"
                          className="p-2 text-slate-500 hover:text-pink-500 transition">
                          <Star size={16} />
                        </button>
                      )}
                      <button onClick={() => handleEdit(addr)}
                        className="p-2 text-slate-500 hover:text-white transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(addr.id)}
                        className="p-2 text-slate-500 hover:text-red-500 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
