import { Link } from 'react-router-dom';

interface ItemProps {
  id: number;
  name: string;
  image: string;
  new_price?: number;
  old_price?: number;
  basePrice?: number;
  salePrice?: number;
  tags?: string[];
  variants?: { colorHex: string }[];
}

const Item = (props: ItemProps) => {
  const displayPrice = props.new_price ?? props.salePrice ?? props.basePrice ?? 0;
  const displayOldPrice = props.old_price ?? (props.salePrice ? props.basePrice : undefined);
  const tags = props.tags || [];

  return (
    <Link
      to={`/product/${props.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="block bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 group max-w-xs w-full"
    >
      <div className="aspect-square bg-slate-900 overflow-hidden relative">
        <img
          src={props.image}
          alt={props.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-1">
          {tags.includes('sale') && displayOldPrice && (
            <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SALE
            </span>
          )}
          {tags.includes('new') && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
        {/* Color dots */}
        {props.variants && props.variants.length > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {props.variants.slice(0, 4).map((v, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-slate-600"
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-slate-300 text-sm line-clamp-2 mb-2 group-hover:text-pink-300 transition">
          {props.name}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-pink-500 font-semibold">
            ${displayPrice.toFixed(2)}
          </span>
          {displayOldPrice && displayOldPrice > displayPrice && (
            <span className="text-slate-600 line-through text-sm">
              ${displayOldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Item;
