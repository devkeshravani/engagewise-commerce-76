
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import { products } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(products.find(p => p.id === id));
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  
  useEffect(() => {
    // Find the product based on the ID parameter
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);
      setSelectedColor(foundProduct.colors[0]);
      setSelectedSize(foundProduct.sizes[0]);
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate star rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<Star key={i} className="w-5 h-5 fill-current text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        // Half star (simulate with CSS)
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-5 h-5 fill-current text-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex">
        {stars}
        <span className="ml-2 text-sm text-gray-600">({product.reviews.length} reviews)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-primary transition">Products</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <Link 
              to={`/products?category=${product.category.toLowerCase()}`} 
              className="text-gray-500 hover:text-primary transition"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
        
        {/* Product Details */}
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={mainImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition ${
                      mainImage === image ? 'border-primary' : 'border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-medium">{product.name}</h1>
                <div className="mt-2">
                  {renderStars()}
                </div>
              </div>
              
              <div className="flex items-center">
                {product.oldPrice ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-medium text-primary">${product.price.toFixed(2)}</span>
                    <span className="text-xl text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md">
                      {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Color: <span className="font-normal">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md border transition ${
                        selectedColor === color 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Size: <span className="font-normal">{selectedSize}</span></h3>
                  <button className="text-sm text-primary hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-10 rounded-md border flex items-center justify-center transition ${
                        selectedSize === size 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-200 rounded-md w-max">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="w-12 text-center">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="flex-1 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </button>
              </div>
              
              {/* Product Tags */}
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Link 
                      key={tag}
                      to={`/products?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Details Tabs */}
        <section className="container py-12">
          <Tabs defaultValue="reviews">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews ({product.reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Product Details</h3>
                <p className="mb-4">{product.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Materials</h4>
                    <p className="text-gray-700">Premium quality materials sourced from sustainable suppliers</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Care Instructions</h4>
                    <p className="text-gray-700">Machine wash cold, gentle cycle. Do not bleach. Tumble dry low.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium">Customer Reviews</h3>
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                    Write a Review
                  </button>
                </div>
                
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <h4 className="font-medium">{review.user}</h4>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                      <div className="mt-3 flex items-center">
                        <button className="text-sm text-gray-500 flex items-center">
                          <span>Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Delivery</h4>
                    <p className="text-gray-700">Free standard shipping on orders over $50. Expedited shipping options available at checkout.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Returns & Exchanges</h4>
                    <p className="text-gray-700">We offer free returns within 30 days of purchase. Items must be unworn with tags attached.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Similar Products */}
        <section className="container py-12 border-t">
          <h2 className="text-2xl font-medium mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link 
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img 
                      src={relatedProduct.images[0]} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition">{relatedProduct.name}</h3>
                  <p className="mt-1 text-sm font-medium">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))
            }
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default ProductDetail;
