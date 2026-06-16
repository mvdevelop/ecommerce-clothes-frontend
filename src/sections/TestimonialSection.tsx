import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

const testimonials = [
  {
    name: 'Sarah Johnson',
    handle: '@sarahj',
    text: 'Absolutely love the quality! The fabric is premium and the fit is perfect. Will definitely order again.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    handle: '@mikechen',
    text: 'Fast shipping and amazing customer service. The jacket I ordered exceeded my expectations.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    handle: '@emilyr',
    text: 'Best online shopping experience! The size guide was accurate and the return process was hassle-free.',
    rating: 4,
  },
];

export default function TestimonialSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Testimonials"
        text2="What Our Customers Say"
        text3="Hear from our happy customers about their shopping experience."
      />
      <div className="flex flex-wrap items-stretch justify-center gap-6 mt-16">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            className="bg-slate-950 border border-slate-800 rounded-xl p-6 max-w-sm w-full"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: 'spring',
              stiffness: 280,
              damping: 70,
              mass: 1,
            }}
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-pink-500 text-pink-500"
                />
              ))}
              {Array.from({ length: 5 - item.rating }).map((_, i) => (
                <Star key={i} size={16} className="text-slate-600" />
              ))}
            </div>
            {/* Quote */}
            <p className="text-slate-300 text-sm leading-relaxed">
              "{item.text}"
            </p>
            {/* Author */}
            <div className="mt-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{item.name}</p>
                <p className="text-slate-500 text-xs">{item.handle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
