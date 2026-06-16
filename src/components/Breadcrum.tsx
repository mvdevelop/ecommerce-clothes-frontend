import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface BreadcrumProps {
  product: Product;
}

function Breadcrum(props: BreadcrumProps) {
  const { product } = props;

  return (
    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider pt-24 pb-4 px-6 md:px-16 lg:px-24 xl:px-32">
      <span>HOME</span>
      <ChevronRight size={14} />
      <span>SHOP</span>
      <ChevronRight size={14} />
      <span className="text-pink-400">{product.category}</span>
      <ChevronRight size={14} />
      <span className="text-slate-400 truncate max-w-[200px]">
        {product.name}
      </span>
    </div>
  );
}

export default Breadcrum;
