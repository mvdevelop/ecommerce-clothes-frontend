import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import exclusive_image from '../assets/exclusive_image.png';

function Offers() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-32 px-6"
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 70,
        mass: 1,
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Exclusive
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-pink-300 text-transparent bg-clip-text">
              Offers For You
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            Only On Best Sellers Products
          </p>
          <button
            onClick={() => navigate('/men')}
            className="mt-6 px-8 py-3 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white font-medium"
          >
            Check Now
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={exclusive_image}
            alt="Exclusive offer"
            className="max-h-64 w-auto object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Offers;
