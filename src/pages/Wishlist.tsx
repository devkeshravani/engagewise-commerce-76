
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingBag, Trash } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import { Product, products } from '@/lib/data';
import { fetchWishlistItems, addToCart, removeFromWishlist } from '@/lib/services';
import { useCart } from '@/lib/CartContext';
import { toast } from '@/hooks/use-toast';

interface WishlistItemData {
  id: string;
  product_id: string;
}

const WishlistItem = ({ 
  product, 
  onRemove, 
  onMoveToCart 
}: {
  product: Product;
  onRemove: () => void;
  onMoveToCart: () => void;
}) => {
  return (
    <div className="flex items-center py-6 border-b">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <Link 
          to={`/product/${product.id}`}
          className="font-medium hover:text-primary transition"
        >
          {product.name}
        </Link>
        
        <div className="mt-1 text-sm text-gray-600">
          ${product.price.toFixed(2)}
          {product.oldPrice && (
            <span className="ml-2 text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        
        <div className="mt-2 flex items-center space-x-4">
          <button 
            onClick={onMoveToCart}
            className="text-sm text-primary hover:underline flex items-center"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Move to Cart
          </button>
          
          <button 
            className="text-sm text-gray-500 hover:text-red-500 transition flex items-center"
            onClick={onRemove}
          >
            <Trash className="w-4 h-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
      
      <div className="ml-6 text-right min-w-[80px]">
        <div className="font-medium">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<{
    id: string;
    product: Product;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateCounts } = useCart();
  
  const loadWishlistData = async () => {
    setIsLoading(true);
    try {
      const wishlistData = await fetchWishlistItems();
      
      // Map wishlist items to products
      const wishlistWithProducts = wishlistData.map((item: WishlistItemData) => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) {
          console.error(`Product not found for ID: ${item.product_id}`);
          return null;
        }
        
        return {
          id: item.id,
          product
        };
      }).filter(Boolean);
      
      setWishlistItems(wishlistWithProducts);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadWishlistData();
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  
  const handleRemoveFromWishlist = async (id: string) => {
    try {
      const product = wishlistItems.find(item => item.id === id)?.product;
      if (!product) return;
      
      const success = await removeFromWishlist(product.id);
      
      if (success) {
        // Update local state
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
        
        // Update wishlist count in header
        updateCounts();
        
        toast({
          title: "Item removed",
          description: "Product has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleMoveToCart = async (id: string) => {
    try {
      const item = wishlistItems.find(item => item.id === id);
      if (!item) return;
      
      // Add to cart using the first color and size options
      const success = await addToCart(
        item.product.id,
        1,
        item.product.colors[0],
        item.product.sizes[0]
      );
      
      if (success) {
        // Remove from wishlist
        await handleRemoveFromWishlist(id);
        
        // Update counts
        updateCounts();
        
        toast({
          title: "Added to Cart",
          description: "Item moved from wishlist to cart",
        });
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast({
        title: "Error",
        description: "Failed to move item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
          
          <h1 className="text-3xl font-medium mb-8">Your Wishlist</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading your wishlist...</p>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="font-medium">{wishlistItems.length} Items</h2>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                {wishlistItems.map((item) => (
                  <WishlistItem 
                    key={item.id}
                    product={item.product}
                    onRemove={() => handleRemoveFromWishlist(item.id)}
                    onMoveToCart={() => handleMoveToCart(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-primary">
                <Heart className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your wishlist yet.
              </p>
              <Link 
                to="/products" 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Explore Products
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Wishlist;
