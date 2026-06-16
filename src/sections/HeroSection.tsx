import { ChevronRight, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const features = ['Free Shipping', 'Easy Returns', 'Secure Payment'];

  return (
    <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen">
      <div className="absolute top-30 -z-10 left-1/4 size-72 bg-pink-600 blur-[300px]"></div>

      {/* Badge */}
      <motion.a
        href="#"
        className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-32 text-pink-100 bg-pink-200/15"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <span className="bg-pink-800 text-white text-xs px-3.5 py-1 rounded-full">
          NEW
        </span>
        <p className="flex items-center gap-1">
          <span>New Arrivals Only</span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition duration-300"
          />
        </p>
      </motion.a>

      {/* Title */}
      <motion.h1
        className="text-5xl/17 md:text-6xl/21 font-medium max-w-3xl text-center mt-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 70,
          mass: 1,
        }}
      >
        Discover Your{' '}
        <span className="move-gradient px-3 rounded-xl text-nowrap">
          Style
        </span>{' '}
        with Our Latest Collection
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-base text-center text-slate-200 max-w-lg mt-6"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        Elevate your wardrobe with curated fashion pieces designed for every
        occasion. Style meets comfort.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex items-center gap-4 mt-8"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <button
          onClick={() => navigate('/men')}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-7 h-11 flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          Shop Now
        </button>
        <button
          onClick={() => navigate('/women')}
          className="flex items-center gap-2 border border-pink-900 hover:bg-pink-950/50 transition rounded-full px-6 h-11"
        >
          <span>Women's Collection</span>
        </button>
      </motion.div>

      {/* Features */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
        {features.map((feature, index) => (
          <motion.p
            className="flex items-center gap-2"
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
          >
            <Check className="size-5 text-pink-600" />
            <span className="text-slate-400">{feature}</span>
          </motion.p>
        ))}
      </div>

      {/* Hero Image Placeholder */}
      <motion.div
        className="mt-16 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.4,
          type: 'spring',
          stiffness: 200,
          damping: 70,
          mass: 1,
        }}
      >
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-pink-900/30 h-64 md:h-96 flex items-center justify-center">
          <p className="text-slate-400 text-lg">
            Featured Collection Preview
          </p>
        </div>
      </motion.div>
    </div>
  );
}
