
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '@/lib/data';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle search input changes
  useEffect(() => {
    if (query.trim().length > 1) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
      if (onSearch) onSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setQuery('');
    setSuggestions([]);
    if (onSearch) onSearch();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for products, categories, or styles..."
            className="w-full pl-12 pr-10 py-3 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-primary/20 transition-all"
            autoComplete="off"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-20 animate-slide-up">
          <div className="p-2">
            {suggestions.map((product) => (
              <div
                key={product.id}
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition"
                onClick={() => handleSuggestionClick(product.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium line-clamp-1 text-left">{product.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 text-left">{product.category}</p>
                  </div>
                  <div className="text-sm font-medium">${product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
            <button
              className="w-full mt-2 py-2 text-sm text-primary hover:bg-gray-50 rounded-md transition"
              onClick={handleSubmit}
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
