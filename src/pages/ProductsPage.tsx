
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import ProductCard from '@/components/ui/ProductCard';
import { products, categories, Product } from '@/lib/data';

const ProductsPage = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    subcategory: '',
    priceRange: '',
    colors: [] as string[],
    sizes: [] as string[],
    tags: [] as string[],
    sortBy: 'featured',
  });
  const [allColors, setAllColors] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
    tags: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Parse URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const newFilters = { ...activeFilters };
    
    if (searchParams.has('category')) {
      newFilters.category = searchParams.get('category') || '';
    }
    
    if (searchParams.has('subcategory')) {
      newFilters.subcategory = searchParams.get('subcategory') || '';
    }
    
    if (searchParams.has('tag')) {
      const tag = searchParams.get('tag') || '';
      newFilters.tags = tag ? [tag] : [];
    }
    
    if (searchParams.has('search')) {
      // Handle search query
      const searchQuery = searchParams.get('search') || '';
      document.title = `Results for "${searchQuery}" - EngageWise`;
    }
    
    setActiveFilters(newFilters);
    
    // Reset mobile filters when URL changes
    setMobileFiltersOpen(false);
    
    // Scroll to top when URL changes
    window.scrollTo(0, 0);
  }, [location.search]);
  
  // Extract all available colors, sizes, and tags for filters
  useEffect(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const tags = new Set<string>();
    
    products.forEach(product => {
      product.colors.forEach(color => colors.add(color));
      product.sizes.forEach(size => sizes.add(size));
      product.tags.forEach(tag => tags.add(tag));
    });
    
    setAllColors(Array.from(colors).sort());
    setAllSizes(Array.from(sizes).sort((a, b) => {
      const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5 };
      return (sizeOrder[a as keyof typeof sizeOrder] || 999) - (sizeOrder[b as keyof typeof sizeOrder] || 999);
    }));
    setAllTags(Array.from(tags).sort());
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    // Apply search query if present
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (activeFilters.category) {
      const categoryName = categories.find(c => c.id === activeFilters.category)?.name || activeFilters.category;
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === categoryName.toLowerCase() || 
        product.category.toLowerCase() === activeFilters.category.toLowerCase()
      );
    }
    
    // Apply subcategory filter
    if (activeFilters.subcategory) {
      filtered = filtered.filter(product => 
        product.subcategory.toLowerCase() === activeFilters.subcategory.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split('-').map(p => parseInt(p));
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }
    
    // Apply color filters
    if (activeFilters.colors.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.colors.some(color => 
          product.colors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        )
      );
    }
    
    // Apply size filters
    if (activeFilters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.sizes.some(size => 
          product.sizes.includes(size)
        )
      );
    }
    
    // Apply tag filters
    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.tags.some(tag => 
          product.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Sort by newest (using IDs as proxy since we don't have dates)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Featured items first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
    
    setFilteredProducts(filtered);
    
    // Set page title based on filters
    let title = 'All Products';
    
    if (searchQuery) {
      title = `Search: "${searchQuery}"`;
    } else if (activeFilters.subcategory) {
      title = activeFilters.subcategory;
    } else if (activeFilters.category) {
      const categoryObj = categories.find(c => c.id === activeFilters.category);
      title = categoryObj ? categoryObj.name : activeFilters.category;
    }
    
    document.title = `${title} - EngageWise`;
  }, [activeFilters, location.search]);
  
  const toggleFilter = (section: keyof typeof filtersExpanded) => {
    setFiltersExpanded({
      ...filtersExpanded,
      [section]: !filtersExpanded[section]
    });
  };
  
  const handleSortChange = (value: string) => {
    setActiveFilters({
      ...activeFilters,
      sortBy: value
    });
  };
  
  const updatePriceRange = (range: string) => {
    setActiveFilters({
      ...activeFilters,
      priceRange: activeFilters.priceRange === range ? '' : range
    });
  };
  
  const toggleColorFilter = (color: string) => {
    if (activeFilters.colors.includes(color)) {
      setActiveFilters({
        ...activeFilters,
        colors: activeFilters.colors.filter(c => c !== color)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        colors: [...activeFilters.colors, color]
      });
    }
  };
  
  const toggleSizeFilter = (size: string) => {
    if (activeFilters.sizes.includes(size)) {
      setActiveFilters({
        ...activeFilters,
        sizes: activeFilters.sizes.filter(s => s !== size)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        sizes: [...activeFilters.sizes, size]
      });
    }
  };
  
  const toggleTagFilter = (tag: string) => {
    if (activeFilters.tags.includes(tag)) {
      setActiveFilters({
        ...activeFilters,
        tags: activeFilters.tags.filter(t => t !== tag)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        tags: [...activeFilters.tags, tag]
      });
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      subcategory: '',
      priceRange: '',
      colors: [],
      sizes: [],
      tags: [],
      sortBy: 'featured'
    });
    
    // Navigate to /products without query params
    window.history.pushState({}, '', '/products');
  };
  
  // Get the current category object
  const currentCategory = categories.find(c => c.id === activeFilters.category);
  
  // Helper function for the page title
  const getPageTitle = () => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      return `Search Results: "${searchQuery}"`;
    }
    
    if (activeFilters.subcategory) {
      if (currentCategory) {
        return `${activeFilters.subcategory} ${currentCategory.name}`;
      }
      return activeFilters.subcategory;
    }
    
    if (activeFilters.category) {
      return currentCategory ? currentCategory.name : activeFilters.category;
    }
    
    return 'All Products';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium">{getPageTitle()}</h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select
                  value={activeFilters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Rating</option>
                </select>
                
                <button
                  className="ml-3 p-2 border border-gray-300 rounded-md flex items-center md:hidden"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                  <Filter className="w-4 h-4" />
                  <span className="ml-1 text-sm">Filters</span>
                </button>
              </div>
            </div>
            
            {/* Active filters */}
            {(activeFilters.priceRange || 
              activeFilters.colors.length > 0 || 
              activeFilters.sizes.length > 0 || 
              activeFilters.tags.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                
                {activeFilters.priceRange && (
                  <button
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center hover:bg-gray-200 transition"
                    onClick={() => updatePriceRange(activeFilters.priceRange)}
                  >
                    {activeFilters.priceRange.includes('-') 
                      ? `$${activeFilters.priceRange.replace('-', ' - $')}` 
                      : `$${activeFilters.priceRange}+`}
                    <X className="ml-1 w-3 h-3" />
                  </button>
                )}
                
                {activeFilters.colors.map(color => (
                  <button
                    key={color}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center hover:bg-gray-200 transition"
                    onClick={() => toggleColorFilter(color)}
                  >
                    Color: {color}
                    <X className="ml-1 w-3 h-3" />
                  </button>
                ))}
                
                {activeFilters.sizes.map(size => (
                  <button
                    key={size}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center hover:bg-gray-200 transition"
                    onClick={() => toggleSizeFilter(size)}
                  >
                    Size: {size}
                    <X className="ml-1 w-3 h-3" />
                  </button>
                ))}
                
                {activeFilters.tags.map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center hover:bg-gray-200 transition"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    <X className="ml-1 w-3 h-3" />
                  </button>
                ))}
                
                <button 
                  className="px-3 py-1 text-primary text-sm hover:underline"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <aside className={`w-full md:w-64 md:block ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
              <div className="sticky top-28 space-y-6">
                <div className="flex justify-between items-center md:hidden mb-2">
                  <h2 className="font-medium">Filters</h2>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Categories */}
                <div>
                  <button
                    className="flex justify-between items-center w-full font-medium mb-2"
                    onClick={() => toggleFilter('categories')}
                  >
                    <span>Categories</span>
                    {filtersExpanded.categories ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {filtersExpanded.categories && (
                    <div className="space-y-2 mt-2">
                      <div className="pl-2 space-y-1">
                        {categories.map((category) => (
                          <div key={category.id}>
                            <Link
                              to={`/products?category=${category.id}`}
                              className={`block py-1 text-sm hover:text-primary transition ${
                                activeFilters.category === category.id ? 'text-primary font-medium' : ''
                              }`}
                            >
                              {category.name}
                            </Link>
                            
                            {activeFilters.category === category.id && (
                              <div className="ml-3 mt-1 space-y-1">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub}
                                    to={`/products?category=${category.id}&subcategory=${sub}`}
                                    className={`block py-1 text-sm hover:text-primary transition ${
                                      activeFilters.subcategory === sub ? 'text-primary font-medium' : ''
                                    }`}
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Price Range */}
                <div>
                  <button
                    className="flex justify-between items-center w-full font-medium mb-2"
                    onClick={() => toggleFilter('price')}
                  >
                    <span>Price Range</span>
                    {filtersExpanded.price ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {filtersExpanded.price && (
                    <div className="space-y-2 mt-2 pl-2">
                      {['0-25', '25-50', '50-100', '100-200', '200'].map((range) => (
                        <button
                          key={range}
                          className={`block py-1 text-sm hover:text-primary transition ${
                            activeFilters.priceRange === range ? 'text-primary font-medium' : ''
                          }`}
                          onClick={() => updatePriceRange(range)}
                        >
                          {range.includes('-') 
                            ? `$${range.replace('-', ' - $')}` 
                            : `$${range}+`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Colors */}
                <div>
                  <button
                    className="flex justify-between items-center w-full font-medium mb-2"
                    onClick={() => toggleFilter('colors')}
                  >
                    <span>Colors</span>
                    {filtersExpanded.colors ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {filtersExpanded.colors && (
                    <div className="space-y-2 mt-2 pl-2">
                      <div className="flex flex-wrap gap-2">
                        {allColors.map((color) => (
                          <button
                            key={color}
                            className={`px-3 py-1 text-sm border rounded-full transition ${
                              activeFilters.colors.includes(color) 
                                ? 'border-primary bg-primary text-white' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleColorFilter(color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sizes */}
                <div>
                  <button
                    className="flex justify-between items-center w-full font-medium mb-2"
                    onClick={() => toggleFilter('sizes')}
                  >
                    <span>Sizes</span>
                    {filtersExpanded.sizes ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {filtersExpanded.sizes && (
                    <div className="space-y-2 mt-2 pl-2">
                      <div className="flex flex-wrap gap-2">
                        {allSizes.map((size) => (
                          <button
                            key={size}
                            className={`w-10 h-10 text-sm border rounded-md flex items-center justify-center transition ${
                              activeFilters.sizes.includes(size) 
                                ? 'border-primary bg-primary text-white' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleSizeFilter(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div>
                  <button
                    className="flex justify-between items-center w-full font-medium mb-2"
                    onClick={() => toggleFilter('tags')}
                  >
                    <span>Product Tags</span>
                    {filtersExpanded.tags ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {filtersExpanded.tags && (
                    <div className="space-y-2 mt-2 pl-2">
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            className={`px-3 py-1 text-sm border rounded-full transition ${
                              activeFilters.tags.includes(tag) 
                                ? 'border-primary bg-primary text-white' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium mb-2">No Products Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any products that match your criteria.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default ProductsPage;
