
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, CreditCard, History, Settings, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import { userCredentials } from '@/lib/data';

const Account = () => {
  const navigate = useNavigate();
  
  // Simulated user data
  const userData = {
    name: 'Sarah Johnson',
    email: userCredentials.email,
    joined: 'March 2023',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    orders: 8,
    wishlisted: 12,
    reviews: 4
  };
  
  const accountSections = [
    { 
      title: 'Orders', 
      icon: <Package className="w-5 h-5" />, 
      description: 'View and track your orders',
      count: userData.orders,
      path: '#orders' 
    },
    { 
      title: 'Wishlist', 
      icon: <Heart className="w-5 h-5" />, 
      description: 'Products you\'ve saved',
      count: userData.wishlisted,
      path: '#wishlist' 
    },
    { 
      title: 'Payment Methods', 
      icon: <CreditCard className="w-5 h-5" />, 
      description: 'Manage your payment options',
      path: '#payment' 
    },
    { 
      title: 'Purchase History', 
      icon: <History className="w-5 h-5" />, 
      description: 'Your shopping history',
      path: '#history' 
    },
    { 
      title: 'Account Settings', 
      icon: <Settings className="w-5 h-5" />, 
      description: 'Manage your account details',
      path: '#settings' 
    }
  ];
  
  const recentlyViewed = [
    {
      id: 'product-1',
      name: 'Silk Blouse',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?q=80&w=387&auto=format&fit=crop'
    },
    {
      id: 'product-2',
      name: 'Casual Joggers',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=387&auto=format&fit=crop'
    },
    {
      id: 'product-3',
      name: 'Lace Chemise',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1616350326303-27e8bad156d7?q=80&w=387&auto=format&fit=crop'
    }
  ];
  
  const handleLogout = () => {
    // In a real app, clear auth tokens/state here
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container">
          {/* Account Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary">
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-medium">{userData.name}</h1>
                <p className="text-gray-500">Member since {userData.joined}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
          
          {/* Account Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {accountSections.map((section, index) => (
              <a 
                key={index}
                href={section.path}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-md text-primary">
                    {section.icon}
                  </div>
                  {section.count !== undefined && (
                    <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full">
                      {section.count}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {section.description}
                </p>
              </a>
            ))}
          </div>
          
          {/* Recently Viewed */}
          <div className="mb-12">
            <h2 className="text-xl font-medium mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentlyViewed.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <div className="rounded-lg overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Account Stats */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Account Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <div className="text-3xl font-medium text-primary mb-1">{userData.orders}</div>
                <div className="text-sm text-gray-500">Orders Placed</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <div className="text-3xl font-medium text-primary mb-1">{userData.reviews}</div>
                <div className="text-sm text-gray-500">Reviews Written</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <div className="text-3xl font-medium text-primary mb-1">{userData.wishlisted}</div>
                <div className="text-sm text-gray-500">Wishlisted Items</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Account;
