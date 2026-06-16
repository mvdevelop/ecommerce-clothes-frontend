import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import LoginSignup from './pages/LoginSignup';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AddressBook from './pages/AddressBook';
import Profile from './pages/Profile';
import men_banner from './assets/banner_mens.png';
import women_banner from './assets/banner_women.png';
import kids_banner from './assets/banner_kids.png';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
        />
        <Navbar />
        <Routes>
          {/* Main */}
          <Route path="/" element={<Shop />} />

          {/* Categories */}
          <Route
            path="/men"
            element={<ShopCategory banner={men_banner} category="men" />}
          />
          <Route
            path="/women"
            element={<ShopCategory banner={women_banner} category="women" />}
          />
          <Route
            path="/kids"
            element={<ShopCategory banner={kids_banner} category="kid" />}
          />

          {/* New Categories */}
          <Route
            path="/shoes"
            element={<ShopCategory banner={men_banner} category="men_shoes" />}
          />
          <Route
            path="/jewelry"
            element={<ShopCategory banner={women_banner} category="jewelry" />}
          />
          <Route
            path="/hats"
            element={<ShopCategory banner={kids_banner} category="hats" />}
          />
          <Route
            path="/watches"
            element={<ShopCategory banner={men_banner} category="watches" />}
          />

          {/* Product */}
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>

          {/* Cart & Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />

          {/* Account */}
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:orderId" element={<OrderDetail />} />
          <Route path="/my-addresses" element={<AddressBook />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
