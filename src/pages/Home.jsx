import React from "react";
import Header from "../components/homeComponents/Header.jsx";
import Hero from "../components/homeComponents/Hero.jsx";
import NewArrivals from "../components/homeComponents/NewArrivals.jsx";
import TopSelling from "../components/homeComponents/TopSelling.jsx";
import BrowseByStyle from "../components/homeComponents/BrowseByStyle.jsx";
import Testimonials from "../components/homeComponents/Testimonials.jsx";
import Footer from "../components/homeComponents/Footer.jsx";

function Home() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <NewArrivals />
        <TopSelling />
        <BrowseByStyle />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default Home;