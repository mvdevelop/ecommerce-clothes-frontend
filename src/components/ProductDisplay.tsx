import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Product } from '../types';
import { showSuccess } from '../services/toastService';
import star_icon from '../assets/star_icon.png';
import star_dull_icon from '../assets/star_dull_icon.png';

interface ProductDisplayProps {
  product: Product;
}

function ProductDisplay(props: ProductDisplayProps) {
  const { product } = props;
  const { addToCart } = useContext(ShopContext)!;

  const handleAddToCart = () => {
    addToCart(product.id);
    showSuccess(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left - Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.image}
                alt=""
                className="w-16 h-16 object-cover rounded-lg border border-slate-800 cursor-pointer hover:border-pink-500 transition"
              />
            ))}
          </div>
          <div className="w-96 h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            {product.name}
          </h1>
          {/* Stars */}
          <div className="flex items-center gap-1 mt-3">
            <img src={star_icon} alt="" className="size-5" />
            <img src={star_icon} alt="" className="size-5" />
            <img src={star_icon} alt="" className="size-5" />
            <img src={star_icon} alt="" className="size-5" />
            <img src={star_dull_icon} alt="" className="size-5" />
            <span className="text-slate-500 text-sm ml-2">(122)</span>
          </div>
          {/* Prices */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-3xl font-bold text-pink-500">
              ${product.new_price}
            </span>
            <span className="text-xl text-slate-600 line-through">
              ${product.old_price}
            </span>
          </div>
          {/* Description */}
          <p className="text-slate-400 mt-4 leading-relaxed">
            Elevate your style with our piece, featuring a modern color
            combination.
          </p>
          {/* Size Selector */}
          <div className="mt-6">
            <h3 className="text-white font-medium mb-3">Select Size</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div
                  key={size}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-white cursor-pointer hover:border-pink-500 transition font-medium"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-full py-3 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] transition-all rounded-full text-white font-medium"
          >
            ADD TO CART
          </button>
          {/* Category / Tags */}
          <div className="mt-6 space-y-2 text-sm text-slate-500">
            <p>
              <span className="text-slate-400">Category :</span> Women,
              T-Shirt, Crop Top
            </p>
            <p>
              <span className="text-slate-400">Tags :</span> Modern, Latest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;
