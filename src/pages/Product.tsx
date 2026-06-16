import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrum';
import ProductDisplay from '../components/ProductDisplay';
import DescriptionBox from '../components/DescriptionBox';
import RelatedProducts from '../components/RelatedProducts';

function Product() {
  const { all_product } = useContext(ShopContext)!;
  const { productId } = useParams<{ productId: string }>();
  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 pt-20">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
}

export default Product;
