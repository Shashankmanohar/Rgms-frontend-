import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import HeroProduct from './components/HeroProduct';
import DealsSection, { TrustBar } from './components/DealsSection';
import VideoTestimonials from './components/VideoTestimonials';
import { NewArrivals, BrandSection, BestSellers, UsageTypes } from './components/ProductSections';
import { CustomerLove, NewsletterCards, Footer } from './components/BottomSections';
import TrustedBy from './components/TrustedBy';

import CategoryPage from './components/CategoryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import { ProductProvider } from './context/ProductContext';
import SEO from './components/SEO';

const Home = () => (
  <div className="min-h-screen bg-white overflow-x-hidden">
    <SEO 
      title="RGMS Smarthome & Security | Smart AI CCTV Cameras & GPS Trackers"
      description="Shop RGMS smart security cameras, 4G solar surveillance, vehicle GPS trackers with remote engine lock, and 4K smart projectors. Free shipping across India & 6 months warranty."
      canonical="/"
    />
    <Header />
    <main>
      <HeroBanner />
      <HeroProduct />
      <DealsSection />
      <TrustBar />
      <VideoTestimonials />
      <TrustedBy />
      <NewArrivals />
      <BrandSection />
      <BestSellers />
      <UsageTypes />
      <CustomerLove />
      <NewsletterCards />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/products" element={<CategoryPage />} />
              <Route path="/shop-all" element={<CategoryPage />} />
              <Route path="/all-products" element={<CategoryPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </ProductProvider>
    </HelmetProvider>
  );
}

export default App;
