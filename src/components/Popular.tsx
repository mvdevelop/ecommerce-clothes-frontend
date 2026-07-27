import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Item from './Item';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPopularProducts, selectPopularProducts, selectProductsLoading, selectProductsError } from '../store/slices/productsSlice';

interface PopularProps {
  onError?: (error: string) => void;
}

function Popular({ onError }: PopularProps = {}) {
  const dispatch = useAppDispatch();
  const popularProducts = useAppSelector(selectPopularProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchPopularProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (loading) {
    return (
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mt-24">
        <div className="text-center py-16">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-400">Loading popular products...</p>
        </div>
      </div>
    );
  }

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
            image={item.image || item.images?.[0] || ''}
            basePrice={item.basePrice}
            salePrice={item.salePrice}
            tags={item.tags}
            variants={item.variants}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Popular;