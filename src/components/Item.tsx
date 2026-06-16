import { Link } from 'react-router-dom';

interface ItemProps {
  id: number;
  name: string;
  image: string;
  new_price: number;
  old_price: number;
}

const Item = (props: ItemProps) => {
  return (
    <Link
      to={`/product/${props.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="block bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 group max-w-xs w-full"
    >
      <div className="aspect-square bg-slate-900 overflow-hidden">
        <img
          src={props.image}
          alt={props.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-slate-300 text-sm line-clamp-2 mb-2 group-hover:text-pink-300 transition">
          {props.name}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-pink-500 font-semibold">
            ${props.new_price}
          </span>
          <span className="text-slate-600 line-through text-sm">
            ${props.old_price}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Item;
