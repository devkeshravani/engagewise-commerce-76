
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Mic, MicOff, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Hi there! I'm your shopping assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

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

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'll help you find that! Let me check our inventory for you.",
        "Great choice! We have several options available in that category.",
        "That item is currently in stock. Would you like to see similar products?",
        "I'd recommend checking out our new arrivals in that category.",
        "Based on your interests, you might also like our collection of seasonal items.",
        "We're having a sale on those items right now! Would you like to see the discounted options?",
        "Let me know if you have any questions about sizes or materials.",
        "Would you like me to recommend some popular items that match your search?"
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
        handleSend();
      }
    } else {
      if (recognitionRef.current) {
        setIsRecording(true);
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    }
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
            <p className="text-xs opacity-80">We typically reply within minutes</p>
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
                placeholder={isListening ? "Listening..." : "Type your message..."}
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
