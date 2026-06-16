import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Item from './Item';
import { Product } from '../types';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularinwomen')
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
  }, []);

  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-24">
      <motion.h2
        className="text-3xl font-semibold text-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 280, damping: 70, mass: 1 }}
      >
        Popular in Women
      </motion.h2>
      <motion.div
        className="flex flex-wrap justify-center gap-6 mt-10"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.15,
          type: 'spring',
          stiffness: 240,
          damping: 70,
          mass: 1,
        }}
      >
        {popularProducts.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Popular;
