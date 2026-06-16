import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const featuresData = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description:
      'Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description:
      'Not satisfied? Return any item within 30 days for a full refund. No questions asked.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description:
      'Your payment information is processed securely with industry-standard encryption.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description:
      'Our dedicated support team is available around the clock to assist you.',
  },
];

export default function FeaturesSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Features"
        text2="Why Shop With Us?"
        text3="We provide the best shopping experience with premium services."
      />
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-16 px-6">
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className={`${
              index === 1
                ? 'p-px rounded-[13px] bg-gradient-to-br from-pink-600 to-slate-800'
                : ''
            }`}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: 'spring',
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <div className="p-6 rounded-xl space-y-4 border border-slate-800 bg-slate-950 max-w-72 w-full">
              <feature.icon className="size-10 text-pink-500" />
              <h3 className="text-base font-medium text-white">
                {feature.title}
              </h3>
              <p className="text-slate-400 line-clamp-2 pb-4">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
