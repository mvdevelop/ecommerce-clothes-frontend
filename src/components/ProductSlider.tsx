import { Product } from '../types';
import Item from './Item';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '1280px',
  margin: '40px auto',
  padding: '0 40px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '30px',
  color: '#222',
};

interface ProductSliderProps {
  items: Product[];
  title?: string;
}

function ProductSlider({ items, title }: ProductSliderProps) {
  if (!items || items.length === 0) return null;

  return (
    <div style={containerStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        style={{ padding: '10px 0 40px 0' }}
      >
        {items.map((product, i) => (
          <SwiperSlide key={product.id || i}>
            <Item
              id={product.id}
              name={product.name}
              image={product.image}
              new_price={product.new_price}
              old_price={product.old_price}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductSlider;
