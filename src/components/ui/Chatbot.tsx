
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Mic, MicOff, Send, ShoppingBag, Search, Info, 
  CreditCard, HelpCircle, Home, Package, User, Heart, MapPin, Gift,
  Star, Compass, RefreshCw, Tag, Bell, ThumbsUp, MessagesSquare, Percent
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { Product, products } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import {
  addToCart,
  addToWishlist,
  isInWishlist,
  fetchWishlistItems,
} from '@/lib/services';

// Define categories and actions for the chatbot
interface CategoryAction {
  label: string;
  icon: React.ReactNode;
  action: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  actions: CategoryAction[];
}

const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [isProactiveMode, setIsProactiveMode] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentProductDetails, setCurrentProductDetails] = useState<Product | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlistCount, updateCounts } = useCart();

  // Categories with their actions
  const categories: Category[] = [
    {
      name: 'Navigation',
      icon: <Compass className="w-5 h-5" />,
      actions: [
        { label: 'Open my cart', icon: <ShoppingBag className="w-4 h-4" />, action: 'Open my cart' },
        { label: 'Go to home page', icon: <Home className="w-4 h-4" />, action: 'Go to home page' },
        { label: 'Show my wishlist', icon: <Heart className="w-4 h-4" />, action: 'Show my wishlist' },
        { label: 'Go to products', icon: <Search className="w-4 h-4" />, action: 'Show me all products' },
        { label: 'Go to my account', icon: <User className="w-4 h-4" />, action: 'Open my account settings' }
      ]
    },
    {
      name: 'Products',
      icon: <ShoppingBag className="w-5 h-5" />,
      actions: [
        { label: 'Add to cart', icon: <ShoppingBag className="w-4 h-4" />, action: 'Add this product to my cart' },
        { label: 'Add to wishlist', icon: <Heart className="w-4 h-4" />, action: 'Add this to my wishlist' },
        { label: 'Show reviews', icon: <Star className="w-4 h-4" />, action: 'Show me customer reviews' },
        { label: 'Show similar products', icon: <Search className="w-4 h-4" />, action: 'Show me similar products' },
        { label: 'Change product color', icon: <RefreshCw className="w-4 h-4" />, action: 'Show this in a different color' }
      ]
    },
    {
      name: 'Assistance',
      icon: <HelpCircle className="w-5 h-5" />,
      actions: [
        { label: 'Gift ideas', icon: <Gift className="w-4 h-4" />, action: 'Help me find a gift' },
        { label: 'Track order', icon: <Package className="w-4 h-4" />, action: 'Track my order' },
        { label: 'Return item', icon: <RefreshCw className="w-4 h-4" />, action: 'Start a return' },
        { label: 'Apply discount', icon: <Percent className="w-4 h-4" />, action: 'Apply a discount code' },
        { label: 'Find stores', icon: <MapPin className="w-4 h-4" />, action: 'Where is the nearest store?' }
      ]
    },
    {
      name: 'Support',
      icon: <MessagesSquare className="w-5 h-5" />,
      actions: [
        { label: 'Payment help', icon: <CreditCard className="w-4 h-4" />, action: 'Payment help' },
        { label: 'FAQs', icon: <Info className="w-4 h-4" />, action: 'Show me FAQs' },
        { label: 'Returns policy', icon: <RefreshCw className="w-4 h-4" />, action: 'Returns policy' },
        { label: 'Shipping info', icon: <Package className="w-4 h-4" />, action: 'Shipping info' },
        { label: 'Contact us', icon: <MessagesSquare className="w-4 h-4" />, action: 'Contact customer service' }
      ]
    },
    {
      name: 'Personal',
      icon: <User className="w-5 h-5" />,
      actions: [
        { label: 'My recommendations', icon: <ThumbsUp className="w-4 h-4" />, action: 'Show me recommendations' },
        { label: 'Stock alerts', icon: <Bell className="w-4 h-4" />, action: 'Stock alerts' },
        { label: 'My wish list', icon: <Heart className="w-4 h-4" />, action: 'Show my wish list' },
        { label: 'Order history', icon: <Package className="w-4 h-4" />, action: 'Order history' },
        { label: 'Special offers', icon: <Tag className="w-4 h-4" />, action: 'Special offers' }
      ]
    }
  ];

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Hi there! I'm your shopping assistant. I can help you navigate the site, find products, and complete tasks. What would you like me to do?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Initially show categories when chat is first opened
      setShowCategories(true);
    }
  }, [isOpen, messages.length]);

  // Get current product info if on a product page
  useEffect(() => {
    if (location.pathname.includes('/product/')) {
      const productId = location.pathname.split('/product/')[1];
      const product = products.find(p => p.id === productId);
      if (product) {
        setCurrentProductDetails(product);
      }
    } else {
      setCurrentProductDetails(null);
    }
  }, [location.pathname]);

  // Track user activity on the site
  useEffect(() => {
    // Update last activity when route changes
    setLastActivity(new Date());
    generateSuggestedQuestions();
    
    // Reset proactive timer if it exists
    if (proactiveTimerRef.current) {
      clearTimeout(proactiveTimerRef.current);
    }
    
    // Set a new proactive timer
    proactiveTimerRef.current = setTimeout(() => {
      if (isOpen && messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
        return; // Don't send proactive message if last message was from bot
      }
      setIsProactiveMode(true);
    }, 60000); // 1 minute of inactivity
    
    return () => {
      if (proactiveTimerRef.current) {
        clearTimeout(proactiveTimerRef.current);
      }
    };
  }, [location.pathname, isOpen]);

  // Proactive mode - suggest something based on inactivity
  useEffect(() => {
    if (isProactiveMode && isOpen) {
      const currentPath = location.pathname;
      let proactiveMessage = "Still looking for something? I can help you!";
      
      // Contextual proactive suggestions based on current page
      if (currentPath.includes('/product/')) {
        proactiveMessage = "Would you like me to help you add this item to your cart or wishlist?";
      } else if (currentPath.includes('/products')) {
        proactiveMessage = "Need help filtering these products or finding something specific?";
      } else if (currentPath.includes('/cart')) {
        proactiveMessage = "Can I help you apply a discount code or proceed to checkout?";
      } else if (currentPath.includes('/wishlist')) {
        proactiveMessage = "Would you like to move any of these items to your cart?";
      }
      
      setMessages(prev => [
        ...prev,
        {
          text: proactiveMessage,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Generate new suggested questions
      generateSuggestedQuestions();
      setIsProactiveMode(false);
    }
  }, [isProactiveMode, isOpen, location.pathname]);

  // Generate contextual suggested questions based on current route
  const generateSuggestedQuestions = () => {
    let questions: string[] = [];
    
    // Default questions for any page
    const defaultQuestions = [
      "What are your best-selling products?",
      "How can I track my order?",
      "What's your return policy?",
      "Do you offer free shipping?"
    ];
    
    // Check current route and add context-specific questions
    if (location.pathname === '/') {
      questions = [
        "What's new in this season?",
        "Can you recommend popular items?",
        "Where are your featured collections?",
        "Tell me about your current promotions"
      ];
    } else if (location.pathname.includes('/product/')) {
      questions = [
        "Add this to my cart",
        "Add this to my wishlist",
        "Show me similar products",
        "Show this in a different color"
      ];
    } else if (location.pathname.includes('/products')) {
      questions = [
        "What's the difference between these products?",
        "Can you help me filter these results?",
        "Which of these would you recommend?",
        "Are any of these on sale?"
      ];
    } else if (location.pathname.includes('/cart')) {
      questions = [
        "Can I get a discount on my order?",
        "How long will shipping take?",
        "Do you offer gift wrapping?",
        "What payment methods do you accept?"
      ];
    } else if (location.pathname.includes('/wishlist')) {
      questions = [
        "Move all items to cart",
        "Which of these items are on sale?",
        "Remove all items from wishlist",
        "When will these items be back in stock?"
      ];
    }
    
    // Add some default questions if we don't have enough context-specific ones
    if (questions.length < 4) {
      questions = [...questions, ...defaultQuestions.slice(0, 4 - questions.length)];
    }
    
    setSuggestedQuestions(questions);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        return () => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        };
      }
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLastActivity(new Date());
    setShowCategories(false);

    // Process user input to generate a more contextual response
    executeAction(input);
  };

  // Function to execute an action based on user input
  const executeAction = (userInput: string) => {
    // Reset the proactive mode
    setIsProactiveMode(false);
    const lowercaseInput = userInput.toLowerCase();
    
    // Navigation & Page Actions
    if (lowercaseInput.includes('open my cart') || lowercaseInput.includes('go to cart')) {
      navigate('/cart');
      sendBotResponse("Taking you to your cart now!");
    } 
    else if (lowercaseInput.includes('home page')) {
      navigate('/');
      sendBotResponse("Redirecting you to the home page!");
    }
    else if (lowercaseInput.includes('my wishlist') || lowercaseInput.includes('saved items') || lowercaseInput.includes('wish list')) {
      navigate('/wishlist');
      sendBotResponse("Here's your wishlist!");
    }
    else if (lowercaseInput.includes('all products') || lowercaseInput.includes('products page')) {
      navigate('/products');
      sendBotResponse("Taking you to all our products!");
    }
    else if (lowercaseInput.includes('account') || lowercaseInput.includes('profile')) {
      navigate('/account');
      sendBotResponse("Here's your account page!");
    }
    
    // Product Interaction - for current product page
    else if (location.pathname.includes('/product/') && 
            (lowercaseInput.includes('add to cart') || lowercaseInput.includes('add this product to my cart') || lowercaseInput.includes('add this to my cart'))) {
      handleCurrentProductToCart();
    }
    else if (location.pathname.includes('/product/') && 
            (lowercaseInput.includes('add to wishlist') || lowercaseInput.includes('add this to my wishlist'))) {
      handleCurrentProductToWishlist();
    }
    else if (location.pathname.includes('/product/') && 
            (lowercaseInput.includes('customer reviews') || lowercaseInput.includes('show reviews'))) {
      // Scroll to reviews section
      const reviewsSection = document.getElementById('product-reviews');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
        sendBotResponse("Here are the customer reviews for this product!");
      } else {
        sendBotResponse("I couldn't find the reviews section. Please scroll down to see reviews.");
      }
    }
    else if (location.pathname.includes('/product/') && 
            (lowercaseInput.includes('different color') || lowercaseInput.includes('change color'))) {
      // Find and click a different color option
      const colorButtons = document.querySelectorAll('[data-color]');
      if (colorButtons.length > 1) {
        // Find a color that's not currently selected
        let selectedIndex = -1;
        colorButtons.forEach((button, index) => {
          if ((button as HTMLElement).dataset.selected === 'true') {
            selectedIndex = index;
          }
        });
        
        // Choose the next color in the list
        const nextIndex = (selectedIndex + 1) % colorButtons.length;
        (colorButtons[nextIndex] as HTMLElement).click();
        
        const colorName = (colorButtons[nextIndex] as HTMLElement).dataset.color || 'different';
        sendBotResponse(`I've changed the color to ${colorName} for you!`);
      } else {
        sendBotResponse("I couldn't find other color options for this product.");
      }
    }
    
    // Support Responses - Give direct answers instead of asking follow-up questions
    else if (lowercaseInput.includes('payment help')) {
      sendBotResponse(`To complete a payment, follow these steps:
1. Go to your cart and click "Proceed to Checkout"
2. Enter your shipping details and click "Continue"
3. Choose your preferred payment method (Credit Card, PayPal, or Apple Pay)
4. Enter your payment details securely
5. Review your order and click "Place Order"

If you face any issues with payment, please contact our support team at support@example.com or call 1-800-123-4567.`);
    }
    else if (lowercaseInput.includes('returns policy') || lowercaseInput.includes('return policy')) {
      sendBotResponse(`Our Returns Policy:
• You can return any item within 30 days of purchase
• Items must be unworn with original tags attached
• Original receipt or proof of purchase required
• Free returns for orders over $50
• Refunds will be processed to the original payment method within 5-7 business days

To start a return, visit your order history page and select the item you wish to return, or contact our customer service team.`);
    }
    else if (lowercaseInput.includes('shipping info')) {
      sendBotResponse(`Shipping Information:
• Free standard shipping on all orders over $50
• Standard shipping (3-5 business days): $4.99
• Express shipping (1-2 business days): $9.99
• Overnight shipping (next business day): $19.99
• International shipping available to select countries

Orders placed before 2 PM EST will ship the same day. All orders include tracking information sent to your email.`);
    }
    else if (lowercaseInput.includes('contact') && lowercaseInput.includes('service')) {
      sendBotResponse(`Contact Customer Service:
• Phone: 1-800-123-4567 (Mon-Fri, 9 AM - 6 PM EST)
• Email: support@example.com
• Live Chat: Available 24/7 on our website
• Social Media: @EngageWise on Twitter and Instagram

Our support team typically responds within 24 hours. For urgent matters, we recommend using phone or live chat for the fastest assistance.`);
    }
    
    // Personalized Sections with Direct Answers
    else if (lowercaseInput.includes('recommendations')) {
      // Show personalized recommendations
      const recommendedProducts = products.slice(0, 4); // Get 4 random products as recommendations
      let recommendationsMessage = "Based on your browsing history, here are some recommendations:\n\n";
      
      recommendedProducts.forEach((product, index) => {
        recommendationsMessage += `${index + 1}. ${product.name} - $${product.price.toFixed(2)}\n`;
      });
      
      recommendationsMessage += "\nWould you like to view any of these products?";
      sendBotResponse(recommendationsMessage);
    }
    else if (lowercaseInput.includes('stock alerts')) {
      // Show stock alert information
      sendBotResponse("You currently have stock alerts set for the following items:\n\n1. Leather Crossbody Bag - Black\n2. Premium Cotton T-Shirt - Medium, Navy\n\nWe'll notify you via email when these items are back in stock. Would you like to set up an alert for any other items?");
    }
    else if (lowercaseInput.includes('order history')) {
      // Show order history
      sendBotResponse("Here's your recent order history:\n\n• Order #12345 - Placed on June 15, 2023 - Delivered\n• Order #12346 - Placed on July 2, 2023 - In Transit\n• Order #12347 - Placed on July 10, 2023 - Processing\n\nClick on any order number to view details or track your shipment.");
    }
    else if (lowercaseInput.includes('special offers')) {
      // Show special offers
      sendBotResponse("Current Special Offers:\n\n• Summer Sale: 20% off all summer apparel with code SUMMER20\n• Buy One Get One 50% Off on all accessories\n• Free shipping on orders over $50\n• 10% off your first order when you sign up for our newsletter\n\nThese offers are valid until August 31, 2023.");
    }
    
    // General shopping assistance
    else if (lowercaseInput.includes('find a gift')) {
      sendBotResponse("I'd be happy to help you find a gift! Could you tell me who it's for and what's your budget?");
    }
    else if (lowercaseInput.includes('track my order') || lowercaseInput.includes('order status')) {
      sendBotResponse("To track your order, please provide your order number or email address used for the purchase.");
    }
    else if (lowercaseInput.includes('return') || lowercaseInput.includes('exchange')) {
      sendBotResponse("Our return policy allows returns within 30 days of purchase. Would you like me to help you start a return process?");
    }
    else if (lowercaseInput.includes('discount') || lowercaseInput.includes('promo code')) {
      sendBotResponse("Please enter your discount code, and I'll help you apply it to your order.");
    }
    else if (lowercaseInput.includes('nearest store') || lowercaseInput.includes('store location')) {
      sendBotResponse("To find the nearest store, I need your location. Could you share your city or zip code?");
    }
    
    // Fallback for unrecognized commands - more helpful than before
    else {
      // Generate more helpful responses based on context
      if (location.pathname.includes('/product/')) {
        sendBotResponse(`I see you're looking at ${currentProductDetails?.name || 'this product'}. I can help you add it to your cart, check reviews, find similar products, or answer any questions about it. What would you like to know?`);
      } else if (location.pathname.includes('/cart')) {
        sendBotResponse("I see you're viewing your cart. I can help you apply discounts, estimate shipping, or proceed to checkout. What would you like to do?");
      } else if (location.pathname.includes('/wishlist')) {
        sendBotResponse("I see you're viewing your wishlist. I can help you move items to your cart, check if any items are on sale, or help you find similar products. How can I assist you?");
      } else {
        // Generic but more helpful response
        sendBotResponse("I'm not sure I understand what you're looking for. I can help you find products, navigate the site, track orders, or provide information about our policies. Could you please clarify what you need?");
      }
    }
    
    // Generate new suggested questions after processing
    generateSuggestedQuestions();
  };

  // Helper function to add bot response message
  const sendBotResponse = (text: string) => {
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: text,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 600);
  };

  // Function to handle adding the current product to cart
  const handleCurrentProductToCart = async () => {
    if (!currentProductDetails) {
      sendBotResponse("I don't see any product details. Are you on a product page?");
      return;
    }

    try {
      // Add to cart using the first color and size options
      const success = await addToCart(
        currentProductDetails.id,
        1,
        currentProductDetails.colors[0],
        currentProductDetails.sizes[0]
      );
      
      if (success) {
        // Update cart count
        updateCounts();
        
        sendBotResponse(`I've added ${currentProductDetails.name} to your cart! Would you like to continue shopping or view your cart?`);
      } else {
        sendBotResponse("I couldn't add this item to your cart. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      sendBotResponse("There was a problem adding this item to your cart.");
    }
  };

  // Function to handle adding the current product to wishlist
  const handleCurrentProductToWishlist = async () => {
    if (!currentProductDetails) {
      sendBotResponse("I don't see any product details. Are you on a product page?");
      return;
    }

    try {
      // Check if already in wishlist
      const alreadyInWishlist = await isInWishlist(currentProductDetails.id);
      
      if (alreadyInWishlist) {
        sendBotResponse(`${currentProductDetails.name} is already in your wishlist! Would you like to view your wishlist or add it to your cart instead?`);
        return;
      }
      
      // Add to wishlist
      const success = await addToWishlist(currentProductDetails.id);
      
      if (success) {
        // Update wishlist count
        updateCounts();
        
        sendBotResponse(`I've added ${currentProductDetails.name} to your wishlist! Would you like to continue shopping or view your wishlist?`);
      } else {
        sendBotResponse("I couldn't add this item to your wishlist. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      sendBotResponse("There was a problem adding this item to your wishlist.");
    }
  };

  // Handle wishlist-specific actions when on the wishlist page
  const handleWishlistActions = async (action: string) => {
    if (location.pathname === '/wishlist') {
      if (action === 'move all to cart') {
        const wishlistItems = await fetchWishlistItems();
        if (wishlistItems.length === 0) {
          sendBotResponse("Your wishlist is empty. Let's find some products to add!");
          return;
        }
        
        // Add all items to cart
        // This is just a simulation - in a real app, you'd add them all to cart
        sendBotResponse(`I've moved ${wishlistItems.length} items from your wishlist to your cart. Would you like to view your cart now?`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
        setIsListening(false);
        if (input.trim()) {
          handleSend();
        }
      }
    } else {
      if (recognitionRef.current) {
        setIsRecording(true);
        setIsListening(true);
        recognitionRef.current.start();
        
        // Add a voice prompt message
        setMessages(prev => [
          ...prev,
          {
            text: "I'm listening! Tell me what you'd like me to do.",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else {
        toast({
          title: "Speech Recognition Unavailable",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Add a small delay to make it feel more natural
    setTimeout(() => {
      handleSend();
    }, 300);
  };

  const handleCategorySelect = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryName);
    }
  };

  const handleActionSelect = (action: string) => {
    setInput(action);
    setTimeout(() => {
      handleSend();
    }, 300);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className="absolute bottom-20 right-0 w-80 sm:w-96 h-[480px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
          style={{
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            opacity: isOpen ? 1 : 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease'
          }}
        >
          {/* Header */}
          <div className="p-4 bg-primary text-white">
            <h3 className="font-medium">EngageWise Assistant</h3>
            <p className="text-xs opacity-80">How can I help you shop today?</p>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`relative max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="block text-[10px] mt-1 opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Categories */}
          {showCategories && (
            <div className="px-4 py-2 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-600 mb-2">What can I help you with?</h4>
              <div className="mb-2">
                <div className="grid grid-cols-5 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategorySelect(category.name)}
                      className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
                        activeCategory === category.name 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="mb-1">{category.icon}</div>
                      <span className="text-xs whitespace-nowrap">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {activeCategory && (
                <div className="mt-3">
                  <div className="grid grid-cols-1 gap-2">
                    {categories
                      .find(cat => cat.name === activeCategory)
                      ?.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionSelect(action.action)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md text-left transition-colors text-gray-700"
                        >
                          <span className="flex-shrink-0 text-primary">{action.icon}</span>
                          <span>{action.label}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggested Questions */}
          {!showCategories && suggestedQuestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs whitespace-nowrap bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors text-gray-700 flex-shrink-0"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex-shrink-0 p-2 rounded-full text-gray-500 hover:text-primary transition"
                aria-label="Show options"
              >
                <Compass className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleRecording}
                className={`flex-shrink-0 p-2 rounded-full ${
                  isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-primary'
                } transition`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... Speak now!" : "Ask me to do something..."}
                className="flex-grow mx-2 p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`flex-shrink-0 p-2 rounded-full ${
                  input.trim() === '' ? 'text-gray-400' : 'text-primary hover:bg-primary/10'
                } transition`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
