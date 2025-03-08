
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Category } from '@/lib/data';

interface CategoryNavProps {
  categories: Category[];
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {categories.slice(0, 6).map((category) => (
        <div
          key={category.id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={`/products?category=${category.id}`}
            className="flex items-center py-2 text-sm font-medium transition hover:text-primary"
          >
            {category.name}
            <ChevronDown className="ml-1 w-4 h-4" />
          </Link>
          
          {activeCategory === category.id && (
            <div 
              className="absolute left-0 min-w-[250px] p-4 bg-white shadow-lg rounded-lg mt-2 z-10 animate-fade-in"
            >
              <div className="grid gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    to={`/products?category=${category.id}&subcategory=${subcategory}`}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition"
                  >
                    {subcategory}
                  </Link>
                ))}
                <div className="border-t mt-2 pt-2">
                  <Link
                    to={`/products?category=${category.id}`}
                    className="block px-3 py-2 rounded-md text-sm text-primary hover:bg-gray-50 transition"
                  >
                    View All {category.name}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <Link 
        to="/products" 
        className="py-2 text-sm font-medium transition hover:text-primary"
      >
        All Categories
      </Link>
    </nav>
  );
};

export default CategoryNav;
