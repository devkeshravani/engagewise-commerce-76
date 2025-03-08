
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import CategoryNav from '../ui/CategoryNav';
import { categories } from '@/lib/data';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setSearchOpen(false);
    }
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-morph py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tight transition hover:opacity-80"
        >
          EngageWise
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <CategoryNav categories={categories} />
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSearch}
            className="p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <Link 
            to="/account" 
            className="p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </Link>
          
          <Link 
            to="/cart" 
            className="p-2 rounded-full hover:bg-black/5 transition relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
          
          <button 
            className="md:hidden p-2 rounded-full hover:bg-black/5 transition"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 px-4 py-6 glass-morph animate-fade-in">
          <div className="container">
            <SearchBar onSearch={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-morph animate-fade-in md:hidden">
          <div className="container py-6">
            <nav className="flex flex-col space-y-4">
              {categories.slice(0, 8).map((category) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="px-4 py-2 text-lg hover:bg-black/5 rounded-md transition"
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                to="/products"
                className="px-4 py-2 text-lg font-medium text-primary hover:bg-black/5 rounded-md transition"
              >
                View All Categories
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
