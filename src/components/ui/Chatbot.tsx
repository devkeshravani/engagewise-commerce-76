
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, MicOff, Send, ShoppingBag, Search, Info, CreditCard, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [isProactiveMode, setIsProactiveMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Hi there! I'm your shopping assistant. Feel free to ask me anything about our products or use voice commands by clicking the mic icon. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Set initial suggested questions
      generateSuggestedQuestions();
    }
  }, [isOpen, messages.length]);

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
      const proactiveMessages = [
        "Still looking for something? I can help you find the perfect item!",
        "Need some product recommendations based on your browsing?",
        "Can I help you with sizing or material information?",
        "Looking for something specific? Feel free to ask me anything!",
        "You can also use voice search by clicking the microphone icon."
      ];
      
      const randomMessage = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];
      
      setMessages(prev => [
        ...prev,
        {
          text: randomMessage,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Generate new suggested questions
      generateSuggestedQuestions();
      setIsProactiveMode(false);
    }
  }, [isProactiveMode, isOpen]);

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
        "Is this item in stock?",
        "What materials is this made of?",
        "Do you have this in other colors?",
        "What size would you recommend for me?"
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

    // Process user input to generate a more contextual response
    generateBotResponse(input);
  };

  const generateBotResponse = (userInput: string) => {
    // Reset the proactive mode
    setIsProactiveMode(false);
    
    // Set a slight delay to make it feel more natural
    setTimeout(() => {
      const lowercaseInput = userInput.toLowerCase();
      
      // Check for specific keywords to provide more contextual responses
      if (lowercaseInput.includes('size') || lowercaseInput.includes('fit')) {
        setMessages(prev => [
          ...prev,
          {
            text: "We offer sizes from XS to XXL. For the best fit, please check our detailed size chart on each product page. Would you like me to help you find a specific size?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('ship') || lowercaseInput.includes('delivery')) {
        setMessages(prev => [
          ...prev,
          {
            text: "We offer free standard shipping on orders over $50. Express shipping is available for an additional fee. Orders typically arrive within 3-5 business days. Is there anything else you'd like to know about our shipping?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('return') || lowercaseInput.includes('exchange')) {
        setMessages(prev => [
          ...prev,
          {
            text: "Our return policy allows returns within 30 days of purchase. Items must be unworn with tags attached. Would you like me to provide more details about our return process?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('discount') || lowercaseInput.includes('coupon') || lowercaseInput.includes('sale')) {
        setMessages(prev => [
          ...prev,
          {
            text: "We currently have a seasonal sale with up to 30% off selected items. You can also sign up for our newsletter to receive a 10% discount on your first order. Would you like to see our current promotions?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('material') || lowercaseInput.includes('fabric')) {
        setMessages(prev => [
          ...prev,
          {
            text: "We use high-quality materials for all our products. Each product page contains detailed information about the specific fabrics and materials used. Is there a particular material you're interested in?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('recommend') || lowercaseInput.includes('suggestion')) {
        setMessages(prev => [
          ...prev,
          {
            text: "Based on current trends, I'd recommend checking out our new arrivals section! Our fine gauge sweaters and high-rise jeans are particularly popular this season. Would you like me to suggest specific items?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else if (lowercaseInput.includes('help') || lowercaseInput.includes('find')) {
        setMessages(prev => [
          ...prev,
          {
            text: "I'm happy to help you find what you're looking for! Could you tell me more about the type of item you're interested in? For example, are you looking for tops, bottoms, dresses, or accessories?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else {
        // Generic responses for other queries
        const botResponses = [
          "That's a great question! Let me help you with that. We have several options that might interest you.",
          "I'd be happy to assist with that. Based on your question, you might want to check out our newest collection.",
          "Thanks for asking! We have some great options that match what you're looking for.",
          "I can definitely help with that. Would you like me to show you some specific recommendations?",
          "Great question! Let me find some options that would work well for you.",
          "I understand what you're looking for. Let me suggest a few items that might be perfect for you.",
          "That's something I can help with. Would you like me to provide more details?",
          "I'm here to help with exactly that kind of question. Let me guide you to the best options."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        setMessages(prev => [
          ...prev,
          {
            text: randomResponse,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }
      
      // Generate new suggested questions after bot response
      generateSuggestedQuestions();
    }, 1000);
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
            text: "I'm listening! Feel free to ask me anything.",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      } else {
        alert('Speech recognition is not supported in your browser.');
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
          className="absolute bottom-20 right-0 w-80 sm:w-96 h-[480px] rounded-lg shadow-xl overflow-hidden glass-morph"
          style={{
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            opacity: isOpen ? 1 : 0
          }}
        >
          {/* Header */}
          <div className="p-4 bg-primary text-white">
            <h3 className="font-medium">Shopping Assistant</h3>
            <p className="text-xs opacity-80">We typically reply within seconds</p>
          </div>

          {/* Messages */}
          <div className="h-[340px] p-4 overflow-y-auto">
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
                  <p className="text-sm">{message.text}</p>
                  <span className="block text-[10px] mt-1 opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors whitespace-nowrap text-gray-700"
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
                placeholder={isListening ? "Listening... Speak now!" : "Type your message..."}
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
