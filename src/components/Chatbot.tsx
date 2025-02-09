import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ShoppingCart, Package, HelpCircle, Search, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import { faqs } from '../data/faqs';

interface Message {
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[];
  products?: Product[];
  orderHistory?: any[];
}

interface SuggestionGroup {
  label: string;
  suggestions: string[];
}

const initialSuggestions: SuggestionGroup[] = [
  {
    label: "Product Search",
    suggestions: [
      "Show me coffee beans",
      "What equipment do you have?",
      "Show products under ₹50",
      "Show me dark roast coffee"
    ]
  },
  {
    label: "Orders & Cart",
    suggestions: [
      "What's in my cart?",
      "Track my order",
      "Show my recent orders",
      "How do I checkout?"
    ]
  },
  {
    label: "Help & Support",
    suggestions: [
      "What are your shipping options?",
      "How do I return a product?",
      "What's your refund policy?",
      "How to brew coffee?"
    ]
  }
];

const faqss = {
  shipping: "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.",
  returns: "You can return unopened products within 30 days for a full refund.",
  refund: "Refunds are processed within 5-7 business days after we receive your return.",
  brewing: "For the perfect cup, use freshly ground beans, filtered water at 200°F, and follow the recommended ratios for your brewing method.",
  login: "To login, click on the user icon in the top right corner and enter your email and password. If you don't have an account, you can create one by clicking 'Sign up'.",
  help: "I can help you with:\n- Product information and recommendations\n- Order tracking and history\n- Account and payment questions\n- Shipping and returns\n\nWhat would you like to know more about?",
  contact: "You can reach our support team through:\n- Email: tanjoredegreecoffee@yahoo.in\n- Phone: +919003106755\n- Live Chat: Available 24/7\n\nOur support hours are Monday-Friday, 9 AM - 6 PM EST."
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "👋 Hi! I'm your coffee assistant. How can I help you today?",
      suggestions: ["Show me coffee beans", "What's in my cart?", "Track my order"]
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          api.getAllProducts(),
          user ? api.getMyOrders() : Promise.resolve([])
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestion = (suggestion: string) => {
    handleUserMessage(suggestion);
  };

  const filterProducts = (query: string): Product[] => {
    const searchTerms = query.toLowerCase().split(' ');
    
    if (query.toLowerCase().includes('coffee beans')) {
      return products.filter(product => product.category === 'beans');
    }
    
    if (query.toLowerCase().includes('equipment')) {
      return products.filter(product => product.category === 'equipment');
    }
    
    if (query.toLowerCase().includes('accessories')) {
      return products.filter(product => product.category === 'accessories');
    }
    
    if (query.toLowerCase().includes('show') && query.toLowerCase().includes('product')) {
      return products.slice(0, 6);
    }

    return products.filter(product => {
      const searchText = `${product.name} ${product.description} ${product.category} ${product.roastLevel || ''} ${product.origin || ''}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
  };

  const findFAQAnswer = (userMessage: string): string | null => {
    const normalizedMessage = userMessage.toLowerCase();
    
    const exactMatch = faqs.find(faq => 
      faq.question.toLowerCase() === normalizedMessage
    );
    if (exactMatch) return exactMatch.answer;

    const partialMatch = faqs.find(faq => 
      normalizedMessage.includes(faq.question.toLowerCase()) ||
      faq.question.toLowerCase().includes(normalizedMessage)
    );
    if (partialMatch) return partialMatch.answer;

    return null;
  };

  const handleUserMessage = async (message: string) => {
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const faqAnswer = findFAQAnswer(message);
      if (faqAnswer) {
        const response = {
          type: 'bot',
          content: faqAnswer,
          suggestions: ["Show products", "Track my order", "Need more help?"]
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, response]);
          setLoading(false);
        }, 500);
        return;
      }

      const lowerMessage = message.toLowerCase();
      let response: Message;

      if (lowerMessage.includes('show') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
        let filteredProducts = products;
        
        if (lowerMessage.includes('coffee beans') || lowerMessage.includes('beans')) {
          filteredProducts = products.filter(p => p.category === 'beans');
        } else if (lowerMessage.includes('equipment')) {
          filteredProducts = products.filter(p => p.category === 'equipment');
        } else if (lowerMessage.includes('accessories')) {
          filteredProducts = products.filter(p => p.category === 'accessories');
        }

        if (lowerMessage.includes('dark roast')) {
          filteredProducts = filteredProducts.filter(p => p.roastLevel === 'dark');
        } else if (lowerMessage.includes('light roast')) {
          filteredProducts = filteredProducts.filter(p => p.roastLevel === 'light');
        }

        response = {
          type: 'bot',
          content: filteredProducts.length > 0 
            ? `Here are the products you requested:`
            : "I couldn't find any products matching your request. Would you like to see our featured items?",
          products: filteredProducts.sort(() => Math.random() - 0.5).slice(0, 5),
          suggestions: ["Show all products", "Show coffee beans", "Show equipment"]
        };
      }
      else if (lowerMessage.includes('how to login') || lowerMessage.includes('login help')) {
        response = {
          type: 'bot',
          content: faqss.login,
          suggestions: ["Create account", "Reset password", "Other help"]
        };
      }
      else if (lowerMessage === 'help' || lowerMessage.includes('need help')) {
        response = {
          type: 'bot',
          content: faqss.help,
          suggestions: ["Shipping info", "Return policy", "Contact support"]
        };
      }
      else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
        response = {
          type: 'bot',
          content: faqss.contact,
          suggestions: ["Track order", "Return policy", "Show products"]
        };
      }
      else if (lowerMessage.includes('track') && lowerMessage.includes('order')) {
        if (!user) {
          response = {
            type: 'bot',
            content: "Please log in to track your orders.",
            suggestions: ["How to login?", "Show products", "Help"]
          };
        } else if (orders.length === 0) {
          response = {
            type: 'bot',
            content: "You don't have any orders yet. Would you like to browse our products?",
            suggestions: ["Show products", "Show coffee beans", "Show equipment"]
          };
        } else {
          const recentOrder = orders[0];
          const orderDate = new Date(recentOrder.createdAt).toLocaleDateString();
          const orderItems = recentOrder.items.map((item: any) => 
            `${item.product.name} (Qty: ${item.quantity})`
          ).join(', ');
          
          response = {
            type: 'bot',
            content: `Your most recent order (#${recentOrder._id}):\n\n` +
                    `Date: ${orderDate}\n` +
                    `Status: ${recentOrder.status}\n` +
                    `Items: ${orderItems}\n` +
                    `Total: $${recentOrder.totalAmount.toFixed(2)}\n\n` +
                    `Shipping to: ${recentOrder.shippingAddress.city}, ${recentOrder.shippingAddress.country}\n` +
                    `${recentOrder.status === 'shipped' ? 'Expected delivery in 2-3 days.' : ''}`,
            suggestions: ["Show all orders", "Track another order", "Need help?"]
          };
        }
      }
      else if (lowerMessage.includes('under') || lowerMessage.includes('below')) {
        const priceMatch = message.match(/\d+/);
        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[0]);
          const filteredProducts = products.filter(p => p.price <= maxPrice);
          response = {
            type: 'bot',
            content: filteredProducts.length > 0 
              ? `Here are products under ₹${maxPrice}:`
              : `I couldn't find any products under ₹${maxPrice}. Would you like to see other options?`,
            products: filteredProducts.slice(0, 3),
            suggestions: ["Show more products", "Other price range", "Show all products"]
          };
        } else {
          response = {
            type: 'bot',
            content: "Could you specify a price range? For example, 'Show products under $50'",
            suggestions: ["Under ₹50", "Under $100", "Show all products"]
          };
        }
      }
      else if (lowerMessage.includes('stock') || lowerMessage.includes('available')) {
        const searchTerms = lowerMessage.split(' ');
        const filteredProducts = filterProducts(message);
        if (filteredProducts.length > 0) {
          response = {
            type: 'bot',
            content: "Here's the current stock information:",
            products: filteredProducts.map(p => ({
              ...p,
              stockInfo: `${p.stock} units available`
            })),
            suggestions: ["Check other products", "Low stock items", "New arrivals"]
          };
        } else {
          response = {
            type: 'bot',
            content: "I couldn't find the specific product. Would you like to see our available products?",
            suggestions: ["Show all products", "Check coffee beans", "Check equipment"]
          };
        }
      }
      else if (lowerMessage.includes('order') && (lowerMessage.includes('history') || lowerMessage.includes('recent'))) {
        if (!user) {
          response = {
            type: 'bot',
            content: "Please log in to view your order history.",
            suggestions: ["How to login?", "Show products", "Help"]
          };
        } else {
          response = {
            type: 'bot',
            content: `You have ${orders.length} orders. ${
              orders.length > 0 ? 'Here are your recent orders:' : 'Would you like to start shopping?'
            }`,
            orderHistory: orders.slice(0, 3),
            suggestions: ["Show all orders", "Track latest order", "Need help?"]
          };
        }
      }
      else if (lowerMessage.includes('cart')) {
        if (cartItems.length === 0) {
          response = {
            type: 'bot',
            content: "Your cart is empty. Would you like to see our products?",
            suggestions: ["Show coffee beans", "Show equipment", "Show featured products"]
          };
        } else {
          const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          response = {
            type: 'bot',
            content: `You have ${cartItems.length} items in your cart. Total: ₹${total.toFixed(2)}`,
            suggestions: ["Checkout now", "Show cart details", "Continue shopping"]
          };
        }
      }
      else if (lowerMessage.includes('shipping')) {
        response = {
          type: 'bot',
          content: faqss.shipping,
          suggestions: ["Track my order", "Return policy", "Continue shopping"]
        };
      }
      else if (lowerMessage.includes('return')) {
        response = {
          type: 'bot',
          content: faqss.returns,
          suggestions: ["Refund policy", "Shipping info", "Contact support"]
        };
      }
      else if (lowerMessage.includes('refund')) {
        response = {
          type: 'bot',
          content: faqss.refund,
          suggestions: ["Return policy", "Track my order", "Contact support"]
        };
      }
      else if (lowerMessage.includes('brew') || lowerMessage.includes('brewing')) {
        response = {
          type: 'bot',
          content: faqss.brewing,
          suggestions: ["Show coffee beans", "Show equipment", "More brewing tips"]
        };
      }
      else if (lowerMessage.includes('checkout') || lowerMessage.includes('buy')) {
        response = {
          type: 'bot',
          content: "Ready to checkout? I'll guide you through the process. First, make sure you're logged in, then review your cart and proceed to checkout where you can enter shipping details and payment information.",
          suggestions: ["Go to cart", "Continue shopping", "Shipping info"]
        };
      }
      else if (lowerMessage.includes('go to') || lowerMessage.includes('show me')) {
        if (lowerMessage.includes('cart')) {
          navigate('/cart');
          response = {
            type: 'bot',
            content: "I've opened your cart in a new page.",
            suggestions: ["Continue shopping", "Checkout help", "Shipping info"]
          };
        } else if (lowerMessage.includes('shop')) {
          navigate('/shop');
          response = {
            type: 'bot',
            content: "I've opened the shop page. Let me know if you need help finding anything!",
            suggestions: ["Show coffee beans", "Show equipment", "Filter by price"]
          };
        }
      }
      else {
        response = {
          type: 'bot',
          content: "I'm not sure how to help with that. Can you try rephrasing?",
          suggestions: ["Show me coffee beans", "What's in my cart?", "Track my order"]
        };
      }

      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error('Error processing message:', err);
      const response = {
        type: 'bot',
        content: "I'm having trouble processing your request. Please try again later.",
        suggestions: ["Show products", "Contact support", "Help"]
      };
      setMessages(prev => [...prev, response]);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-4 bg-primary-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Coffee Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  
                  {message.products && (
                    <div className="mt-4 space-y-4">
                      {message.products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
                          <img
                            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">${product.price}</p>
                            <p className="text-xs text-gray-500">
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.suggestions && message.type === 'bot' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="text-xs bg-white text-primary-600 px-2 py-1 rounded-full hover:bg-primary-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => handleUserMessage("What's in my cart?")}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-gray-200"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </button>
              <button
                onClick={() => handleUserMessage("Show me products")}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-gray-200"
              >
                <Search className="h-4 w-4" />
                Browse
              </button>
              <button
                onClick={() => handleUserMessage("Track my order")}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-gray-200"
              >
                <Truck className="h-4 w-4" />
                Track
              </button>
              <button
                onClick={() => handleUserMessage("Help with shipping")}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-gray-200"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}