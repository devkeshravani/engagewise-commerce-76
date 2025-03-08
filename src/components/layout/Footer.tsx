
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-6">EngageWise</h3>
            <p className="text-gray-600 mb-6">
              Bringing you curated fashion pieces with a focus on quality and sustainability.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=dresses" className="text-gray-600 hover:text-primary transition">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/products?category=outerwear" className="text-gray-600 hover:text-primary transition">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=jeans" className="text-gray-600 hover:text-primary transition">
                  Jeans
                </Link>
              </li>
              <li>
                <Link to="/products?category=sweaters" className="text-gray-600 hover:text-primary transition">
                  Sweaters
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Help</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Subscribe</h3>
            <p className="text-gray-600 mb-4">
              Sign up for exclusive offers, updates, and style inspiration.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} EngageWise. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition">
                Accessibility
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
