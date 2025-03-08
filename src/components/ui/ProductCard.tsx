
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
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
    <Link 
      to={`/product/${product.id}`}
      className={`group block ${variant === 'compact' ? 'w-full' : 'w-full'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
        {/* Image loading skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 image-loading"></div>
        )}
        
        {/* Main image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
        
        {/* Tags */}
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
        
        {product.tags.includes("new arrival") && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
            New
          </span>
        )}
      </div>
      
      <div className={variant === 'compact' ? 'text-left' : 'text-center'}>
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
      </div>
    </Link>
  );
};

export default ProductCard;
