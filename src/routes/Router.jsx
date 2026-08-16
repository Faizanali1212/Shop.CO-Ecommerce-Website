import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Header from '../components/homeComponents/Header';
import Footer from "../components/homeComponents/Footer.jsx";
import CategoryFilterPage from '../pages/Categoryfilterpage.jsx';
import CartPage from '../pages/CartPage.jsx';
const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/catagory' element={<CategoryFilterPage/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;

