
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from './session';
import { toast } from '@/hooks/use-toast';

// Reviews
export const fetchProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  
  return data || [];
};

export const addProductReview = async (
  productId: string, 
  userName: string, 
  rating: number, 
  comment: string
) => {
  const { error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_name: userName,
      rating,
      comment
    });
    
  if (error) {
    console.error('Error adding review:', error);
    toast({
      title: "Error",
      description: "Failed to submit review. Please try again.",
      variant: "destructive"
    });
    return false;
  }
  
  toast({
    title: "Review Submitted",
    description: "Thank you for your feedback!",
  });
  return true;
};

// Cart
export const fetchCartItems = async () => {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId);
    
  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
  
  return data || [];
};

export const addToCart = async (
  productId: string, 
  quantity: number = 1, 
  color: string, 
  size: string
) => {
  const sessionId = getSessionId();
  
  // Check if the item is already in the cart
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .eq('color', color)
    .eq('size', size);
    
  if (existingItems && existingItems.length > 0) {
    // Update quantity if the item is already in the cart
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItems[0].quantity + quantity })
      .eq('id', existingItems[0].id);
      
    if (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  } else {
    // Add new item to cart
    const { error } = await supabase
      .from('cart_items')
      .insert({
        session_id: sessionId,
        product_id: productId,
        quantity,
        color,
        size
      });
      
    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  toast({
    title: "Added to Cart",
    description: "Item has been added to your cart!",
  });
  return true;
};

export const getCartItemCount = async () => {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('session_id', sessionId);
    
  if (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
  
  return data.reduce((total, item) => total + (item.quantity || 0), 0);
};

// Wishlist
export const fetchWishlistItems = async () => {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('session_id', sessionId);
    
  if (error) {
    console.error('Error fetching wishlist items:', error);
    return [];
  }
  
  return data || [];
};

export const addToWishlist = async (productId: string) => {
  const sessionId = getSessionId();
  
  // Check if the item is already in the wishlist
  const { data: existingItems } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId);
    
  if (existingItems && existingItems.length > 0) {
    // Item already in wishlist
    toast({
      title: "Already in Wishlist",
      description: "This item is already in your wishlist.",
    });
    return true;
  }
  
  // Add new item to wishlist
  const { error } = await supabase
    .from('wishlist_items')
    .insert({
      session_id: sessionId,
      product_id: productId
    });
    
  if (error) {
    console.error('Error adding to wishlist:', error);
    toast({
      title: "Error",
      description: "Failed to add to wishlist. Please try again.",
      variant: "destructive"
    });
    return false;
  }
  
  toast({
    title: "Added to Wishlist",
    description: "Item has been added to your wishlist!",
  });
  return true;
};

export const getWishlistItemCount = async () => {
  const sessionId = getSessionId();
  
  const { count, error } = await supabase
    .from('wishlist_items')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);
    
  if (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
  
  return count || 0;
};

export const removeFromWishlist = async (productId: string) => {
  const sessionId = getSessionId();
  
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('session_id', sessionId)
    .eq('product_id', productId);
    
  if (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
  
  return true;
};

// Check if a product is in the wishlist
export const isInWishlist = async (productId: string) => {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId);
    
  if (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
  
  return data && data.length > 0;
};
