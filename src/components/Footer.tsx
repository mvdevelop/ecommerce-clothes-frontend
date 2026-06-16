import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Link as LinkIcon, MessageCircle, Play } from 'lucide-react';

const footerData = [
  {
    title: 'Product',
    links: [
      { name: 'Men', href: '/men' },
      { name: 'Women', href: '/women' },
      { name: 'Kids', href: '/kids' },
      { name: 'New Arrivals', href: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Size Guide', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Returns', href: '#' },
    ],
  },
];

function Footer() {
  return (
    <footer className="flex flex-wrap justify-center md:justify-between overflow-hidden gap-10 md:gap-20 mt-40 py-6 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500">
      <motion.div
        className="flex flex-wrap items-start gap-10 md:gap-24"
        initial={{ x: -150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 70,
          mass: 1,
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-300 flex items-center justify-center text-black font-bold text-sm">
            C
          </div>
        </Link>
        {footerData.map((section, index) => (
          <div key={index}>
            <p className="text-slate-100 font-semibold">{section.title}</p>
            <ul className="mt-2 space-y-2">
              {section.links.map((linkItem, i) => (
                <li key={i}>
                  <Link
                    to={linkItem.href}
                    className="hover:text-pink-600 transition"
                  >
                    {linkItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
      <motion.div
        className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end"
        initial={{ x: 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 70,
          mass: 1,
        }}
      >
        <p className="max-w-60">
          Elevate your style with our exclusive collections. Fashion that speaks
          for itself.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
          >
            <Globe className="size-5 hover:text-pink-500" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon className="size-5 hover:text-pink-500" />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            <MessageCircle className="size-5 hover:text-pink-500" />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
          >
            <Play className="size-6 hover:text-pink-500" />
          </a>
        </div>
        <p className="mt-3 text-center">
          &copy; {new Date().getFullYear()} Clothes.com. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}

export default Footer;
