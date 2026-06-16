import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2 } from 'lucide-react';
import { showInfo } from '../services/toastService';

function CartItems() {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext)!;

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    showInfo(`${name} removido do carrinho`);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 pt-28">
      <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 text-slate-400 text-sm uppercase tracking-wider pb-4 border-b border-slate-800">
        <p>Product</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p></p>
      </div>

      {/* Cart Items */}
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div
              key={e.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 items-center py-5 border-b border-slate-800/50"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={(e.images?.[0] || '')}
                  alt={e.name}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-900"
                />
                <p className="text-white text-sm line-clamp-2">{e.name}</p>
              </div>
              {/* Price */}
              <p className="text-pink-500 font-medium">${(e.salePrice ?? e.basePrice)}</p>
              {/* Quantity */}
              <button className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium">
                {cartItems[e.id]}
              </button>
              {/* Total */}
              <p className="text-white font-medium">
                ${((e.salePrice ?? e.basePrice) * cartItems[e.id]).toFixed(2)}
              </p>
              {/* Remove */}
              <button onClick={() => handleRemove(e.id, e.name)}>
                <Trash2 className="text-slate-600 hover:text-red-500 transition size-5" />
              </button>
            </div>
          );
        }
        return null;
      })}

      {/* Checkout Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 mt-12">
        {/* Promo Code */}
        <div className="flex-1 max-w-md">
          <p className="text-slate-400 text-sm">
            If you have a promo code, enter it here.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Promo Code"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-sm"
            />
            <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 transition rounded-full text-white text-sm font-medium">
              Submit
            </button>
          </div>
        </div>

        {/* Cart Totals */}
        <div className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Totals</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-400">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr className="border-slate-800" />
            <div className="flex justify-between text-slate-400">
              <p>Shipping Fee</p>
              <p className="text-green-500">Free</p>
            </div>
            <hr className="border-slate-800" />
            <div className="flex justify-between text-white font-semibold text-lg">
              <h3>Total</h3>
              <h3 className="text-pink-500">
                ${getTotalCartAmount().toFixed(2)}
              </h3>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] transition-all rounded-full text-white font-medium">
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
