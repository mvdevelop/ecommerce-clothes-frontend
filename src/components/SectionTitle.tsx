import { motion } from 'framer-motion';

interface SectionTitleProps {
  text1: string;
  text2: string;
  text3: string;
}

export default function SectionTitle({ text1, text2, text3 }: SectionTitleProps) {
  return (
    <>
      <motion.p
        className="text-center font-medium text-pink-600 mt-24 px-6 py-2 rounded-full bg-pink-950/70 border border-pink-800 w-max mx-auto text-sm"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        {text1}
      </motion.p>
      <motion.h3
        className="text-3xl font-semibold text-center mx-auto mt-4"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 70,
          mass: 1,
        }}
      >
        {text2}
      </motion.h3>
      <motion.p
        className="text-slate-300 text-center mt-2 max-w-xl mx-auto"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 70,
          mass: 1,
        }}
      >
        {text3}
      </motion.p>
    </>
  );
}
