
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import Chatbot from '@/components/ui/Chatbot';
import { getFeaturedProducts, categories, products } from '@/lib/data';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState(getFeaturedProducts(8));
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  useEffect(() => {
    // Animate hero section
    setTimeout(() => setIsHeroVisible(true), 100);
    
    // Animate content section with delay
    setTimeout(() => setIsContentVisible(true), 300);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section 
          className={`relative h-[80vh] bg-gray-100 overflow-hidden transition-opacity duration-700 ${
            isHeroVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=3272&auto=format&fit=crop" 
              alt="Fashion hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
          
          <div className="relative h-full container flex flex-col justify-center">
            <div className="max-w-lg">
              <span className="inline-block mb-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full animate-fade-in">
                New Collection 2023
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-4 animate-slide-up">
                Discover Your Perfect Style
              </h1>
              <p className="text-lg text-white/90 mb-6 max-w-md animate-slide-up" style={{ animationDelay: '100ms' }}>
                Elevate your wardrobe with our curated collection of premium fashion pieces.
              </p>
              <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link 
                  to="/products" 
                  className="px-6 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/products?category=new-arrivals" 
                  className="px-6 py-3 bg-transparent border border-white text-white rounded-md hover:bg-white/10 transition"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section 
          className={`py-16 transition-opacity duration-700 ${
            isContentVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-medium mb-4">Shop by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our wide range of categories to find exactly what you're looking for.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative rounded-lg overflow-hidden aspect-[3/4] transition transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-xl font-medium text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="flex items-center text-sm text-white/80 group-hover:text-white transition">
                        Shop Now <ChevronRight className="ml-1 w-4 h-4 transition group-hover:translate-x-1" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/products" 
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition"
              >
                View All Categories <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-medium mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of this season's must-have pieces.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/products" 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
        
        {/* Collection Highlight */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-block mb-3 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  New Season
                </span>
                <h2 className="text-3xl md:text-4xl font-medium mb-4">
                  Autumn Collection 2023
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Embrace the changing seasons with our latest collection of versatile pieces designed to elevate your autumn wardrobe.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Premium Materials</h3>
                      <p className="text-sm text-gray-600">Crafted from ethically sourced high-quality fabrics</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Timeless Design</h3>
                      <p className="text-sm text-gray-600">Sophisticated styles that transcend seasonal trends</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Sustainable Production</h3>
                      <p className="text-sm text-gray-600">Eco-friendly manufacturing with reduced carbon footprint</p>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/products?season=autumn" 
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                >
                  Explore Collection
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=3270&auto=format&fit=crop" 
                    alt="Autumn Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-medium mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-300 mb-8">
                Be the first to know about new arrivals, exclusive offers, and fashion inspiration.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
