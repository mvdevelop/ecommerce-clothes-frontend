import { motion } from 'framer-motion';

function NewsLetter() {
  return (
    <motion.div
      className="max-w-xl mx-auto mt-24 text-center px-4"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 70,
        mass: 1,
      }}
    >
      <h2 className="text-3xl font-semibold">
        Get Exclusive Offers On Your Email
      </h2>
      <p className="text-slate-400 mt-2">
        Subscribe to our newsletter and stay updated
      </p>
      <div className="mt-6 flex items-center gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Your Email id"
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-sm"
        />
        <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white text-sm font-medium whitespace-nowrap">
          Subscribe
        </button>
      </div>
    </motion.div>
  );
}

export default NewsLetter;
