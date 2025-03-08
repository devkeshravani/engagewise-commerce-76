
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  variant = 'default' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Determine if there are multiple images to show
  const hasMultipleImages = product.images.length > 1;
  
  // Calculate star rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        // Half star (simulate with CSS)
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex">
        {stars}
        <span className="ml-1 text-sm text-gray-500">({product.reviews.length})</span>
      </div>
    );
  };

  return (
    <div 
      className={`group block ${variant === 'compact' ? 'w-full' : 'w-full'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
          {/* Image loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 image-loading"></div>
          )}
          
          {/* Main image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Second image for hover effect */}
          {hasMultipleImages && (
            <img
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
          )}
          
          {/* Quick action buttons */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="flex space-x-2">
              <button className="flex-1 bg-white rounded-md py-2 text-sm shadow-md hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 mr-1" />
                Add to Cart
              </button>
              <button className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Tags */}
          <div className="absolute top-0 left-0 p-2 flex flex-col gap-2">
            {product.oldPrice && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
            
            {product.tags.includes("new arrival") && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className={variant === 'compact' ? 'text-left' : 'text-center'}>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition">
            {product.name}
          </h3>
          
          <div className="mt-1 flex items-center justify-center">
            {product.oldPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-primary font-medium">${product.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm line-through">${product.oldPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-medium">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className={`mt-2 ${variant === 'compact' ? '' : 'flex justify-center'}`}>
            {renderStars()}
          </div>
          
          <div className="mt-1 text-sm text-gray-500 line-clamp-1">
            {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'} · {product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
