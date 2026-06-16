import { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Product } from '../types';
import { ProductVariants } from './ProductVariants';
import { showSuccess } from '../services/toastService';
import { Star } from 'lucide-react';

interface ProductDisplayProps {
  product: Product;
}

function ProductDisplay(props: ProductDisplayProps) {
  const { product } = props;
  const { addToCart } = useContext(ShopContext)!;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.size || ''
  );
  const [selectedColor, setSelectedColor] = useState(
    product.variants[0]?.color || ''
  );

  const images = product.images?.length > 0 ? product.images : [product.images?.[0] || ''];
  const displayPrice = product.salePrice ?? product.basePrice;
  const hasSale = !!product.salePrice;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product.id);
    showSuccess(`${product.name} (${selectedSize}, ${selectedColor}) adicionado!`);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Left - Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  i === selectedImage ? 'border-pink-500' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full md:w-96 lg:w-[450px] aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 order-1 md:order-2">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right - Info */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating || 0) ? 'fill-pink-500 text-pink-500' : 'text-slate-600'}
                />
              ))}
            </div>
            <span className="text-slate-500 text-sm">
              ({product.reviewsCount || 0})
            </span>
          </div>

          {/* Prices */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-3xl font-bold text-pink-500">
              ${displayPrice.toFixed(2)}
            </span>
            {hasSale && (
              <span className="text-xl text-slate-600 line-through">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-400 mt-4 leading-relaxed text-sm">
            {product.description || 'Premium quality product crafted for maximum comfort and style.'}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <ProductVariants
                variants={product.variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className="mt-8 w-full py-3.5 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-800 disabled:text-slate-500 active:scale-[0.98] transition-all rounded-full text-white font-medium"
          >
            ADD TO CART
          </button>

          {/* Category / Tags */}
          <div className="mt-6 space-y-2 text-sm text-slate-500">
            <p>
              <span className="text-slate-400">Category :</span>{' '}
              {product.subcategory || product.category}
            </p>
            {product.tags && product.tags.length > 0 && (
              <p>
                <span className="text-slate-400">Tags :</span>{' '}
                {product.tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;
