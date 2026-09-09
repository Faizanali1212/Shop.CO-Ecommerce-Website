import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Header from '../components/homeComponents/Header';
import Footer from "../components/homeComponents/Footer.jsx";
import CategoryFilterPage from '../pages/Categoryfilterpage.jsx';
import CartPage from '../pages/CartPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SinupPage from '../pages/SinupPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import OrderDetailPage from '../pages/OrderDetailPage.jsx';
import { CartProvider } from '../context/CartContext.jsx';
const Router = () => {
  return (
    <BrowserRouter>
      {/* Keep the header, pages, and footer connected to one cart state. */}
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SinupPage />} />
          <Route path='/catagory' element={<CategoryFilterPage/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
};

export default Router;

