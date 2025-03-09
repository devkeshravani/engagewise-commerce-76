
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Trash, Plus, Minus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts, Product, products } from '@/lib/data';
import { fetchCartItems } from '@/lib/services';
import { useCart } from '@/lib/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/lib/session';

interface CartItemData {
  id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
}

const CartItem = ({ product, quantity, color, size, onRemove, onUpdateQuantity }: {
  product: Product;
  quantity: number;
  color: string;
  size: string;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
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
          Color: {color}, Size: {size}
        </div>
        
        <div className="mt-2 flex items-center">
          <button 
            className="p-1 text-gray-500 hover:text-red-500 transition"
            onClick={onRemove}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center border border-gray-200 rounded-md">
        <button 
          onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
          disabled={quantity <= 1}
        >
          <Minus className="w-3 h-3" />
        </button>
        <div className="w-10 text-center">{quantity}</div>
        <button 
          onClick={() => onUpdateQuantity(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      <div className="ml-6 text-right min-w-[80px]">
        <div className="font-medium">${(product.price * quantity).toFixed(2)}</div>
        <div className="text-sm text-gray-500">${product.price.toFixed(2)} each</div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<{
    product: Product;
    quantity: number;
    color: string;
    size: string;
    id: string;
  }[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateCounts } = useCart();
  
  const loadCartData = async () => {
    setIsLoading(true);
    try {
      const cartData = await fetchCartItems();
      
      // Map cart items to products
      const cartWithProducts = cartData.map((item: CartItemData) => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) {
          console.error(`Product not found for ID: ${item.product_id}`);
          return null;
        }
        
        return {
          id: item.id,
          product,
          quantity: item.quantity,
          color: item.color || product.colors[0],
          size: item.size || product.sizes[0]
        };
      }).filter(Boolean);
      
      setCartItems(cartWithProducts);
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    // Get recommended products
    setRecommendedProducts(getFeaturedProducts(4));
  };
  
  useEffect(() => {
    loadCartData();
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  
  const removeFromCart = async (id: string) => {
    const sessionId = getSessionId();
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('session_id', sessionId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      const newCart = cartItems.filter(item => item.id !== id);
      setCartItems(newCart);
      
      // Update cart count in header
      updateCounts();
      
      toast({
        title: "Item removed",
        description: "Product has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const updateQuantity = async (id: string, newQuantity: number) => {
    const sessionId = getSessionId();
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', id)
        .eq('session_id', sessionId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      const newCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(newCart);
      
      // Update cart count in header
      updateCounts();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const clearCart = async () => {
    const sessionId = getSessionId();
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setCartItems([]);
      
      // Update cart count in header
      updateCounts();
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
          
          <h1 className="text-3xl font-medium mb-8">Your Shopping Cart</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading your cart...</p>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="font-medium">{cartItems.length} Items</h2>
                  <button 
                    className="text-sm text-gray-600 hover:text-red-500 transition"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {cartItems.map((item) => (
                    <CartItem 
                      key={item.id}
                      product={item.product}
                      quantity={item.quantity}
                      color={item.color}
                      size={item.size}
                      onRemove={() => removeFromCart(item.id)}
                      onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <h2 className="font-medium mb-4">Order Summary</h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    className="w-full mt-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-6">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Free shipping on orders over $100</p>
                      <p>30-day easy returns</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    to="/products" 
                    className="flex items-center justify-center text-primary hover:underline"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-primary">
                <ShoppingBag className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link 
                to="/products" 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Start Shopping
              </Link>
            </div>
          )}
          
          {/* Recommended Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-medium mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Cart;
