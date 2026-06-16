import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import HeroSection from '../sections/HeroSection';
import ProductSlider from '../components/ProductSlider';
import FeaturesSection from '../sections/FeaturesSection';
import Popular from '../components/Popular';
import TestimonialSection from '../sections/TestimonialSection';
import Offers from '../components/Offers';
import NewCollections from '../components/NewCollections';
import CTASection from '../sections/CTASection';

function Shop() {
  const { all_product } = useContext(ShopContext)!;

  return (
    <div className="font-poppins">
      <HeroSection />
      <div className="mt-16">
        <ProductSlider items={all_product} title="Featured Products" />
      </div>
      <FeaturesSection />
      <Popular />
      <TestimonialSection />
      <Offers />
      <NewCollections />
      <CTASection />
    </div>
  );
}

export default Shop;
