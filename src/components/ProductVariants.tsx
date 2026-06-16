import { useEffect, useState } from 'react';
import { ProductVariant } from '../types';
import { Check } from 'lucide-react';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function ProductVariants({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: ProductVariantsProps) {
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Map(variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()];

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const stock = selectedVariant?.stock ?? 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="space-y-5">
      {/* Size Selector */}
      <div>
        <h3 className="text-white font-medium mb-3">
          Size <span className="text-slate-500 text-sm font-normal">— {selectedSize}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const hasStock = variants.some(
              (v) => v.size === size && v.color === selectedColor && v.stock > 0
            );
            const isSelected = size === selectedSize;
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                disabled={!hasStock}
                className={`min-w-[44px] h-11 px-4 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-500/10 text-pink-500'
                    : hasStock
                    ? 'border-slate-700 bg-slate-900 text-white hover:border-pink-500/50'
                    : 'border-slate-800 bg-slate-900/50 text-slate-600 line-through cursor-not-allowed'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <h3 className="text-white font-medium mb-3">
          Color <span className="text-slate-500 text-sm font-normal">— {selectedColor}</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const isSelected = color.name === selectedColor;
            const hasStock = variants.some(
              (v) => v.color === color.name && v.size === selectedSize && v.stock > 0
            );
            return (
              <button
                key={color.name}
                onClick={() => onColorChange(color.name)}
                disabled={!hasStock}
                className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                  isSelected ? 'border-pink-500 scale-110' : 'border-slate-600 hover:scale-105'
                } ${!hasStock ? 'opacity-30 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <Check
                    size={14}
                    className={`absolute inset-0 m-auto ${
                      color.name === 'Branco' || color.name === 'Bege'
                        ? 'text-black'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock */}
      <p className={`text-sm ${isOutOfStock ? 'text-red-400' : 'text-slate-400'}`}>
        {isOutOfStock ? 'Out of stock' : `${stock} in stock`}
      </p>
    </div>
  );
}
