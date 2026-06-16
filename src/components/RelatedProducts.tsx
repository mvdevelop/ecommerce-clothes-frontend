import { motion } from 'framer-motion';
import data_product from '../assets/data';
import Item from './Item';

function RelatedProducts() {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
      <motion.h2
        className="text-2xl font-semibold text-center mb-10"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 280, damping: 70, mass: 1 }}
      >
        Related Products
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-6">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
