import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown } from 'lucide-react';
import Item from '../components/Item';

interface ShopCategoryProps {
  banner: string;
  category: string;
}

function ShopCategory(props: ShopCategoryProps) {
  const { all_product } = useContext(ShopContext)!;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-28">
      {/* Banner */}
      <div className="w-full h-48 md:h-72 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 flex items-center justify-center">
        <img
          src={props.banner}
          alt={props.category}
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-slate-400 text-sm">
          <span className="text-white">Showing 1-12</span> out of 36 products
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-pink-500 transition">
          Sort by
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Product Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.images?.[0] || ''}
                basePrice={item.basePrice}
                salePrice={item.salePrice}
                tags={item.tags}
                variants={item.variants}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12 pb-12">
        <button className="px-8 py-3 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white font-medium">
          Explore More
        </button>
      </div>
    </div>
  );
}

export default ShopCategory;
