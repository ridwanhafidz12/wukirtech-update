import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot, ShoppingBag, X, Send } from 'lucide-react';

// Data produk dari kode yang diberikan
const products = [
  {
    name: "Wedang Uwuh Bu Endang",
    category: "Kuliner",
    umkm: "UMKM Wukirsari",
    price: "Rp20.000 / 10pcs",
    imageAlt: "Tiga gelas wedang uwuh hangat disajikan di atas meja",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/831f4e5dfdf72e4880aa6b7ee71b46b8.jpg",
    isNew: false,
  },
  {
    name: "Handmade Batik",
    category: "Kerajinan Tangan",
    umkm: "Handmade batik",
    price: "Rp700.000 - Rp800.000",
    imageAlt: "Batik tulis Giriloyo dengan motif klasik",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg",
    isNew: false,
  },
  {
    name: "Wayang Kulit Arjuna",
    category: "Seni Pertunjukan",
    umkm: "Ituk Wayang",
    price: "Rp600.000",
    imageAlt: "Wayang kulit dari Pucung",
    imageUrl: "wayang.jpeg",
    isNew: true,
  },
  {
    name: "Kipas Tangan Zainal",
    category: "Kerajinan Tangan",
    umkm: "Zainal",
    price: "Rp25.000",
    imageAlt: "Kipas bambu dengan motif batik",
    imageUrl: "kipas.jpg",
    isNew: true,
  },
  {
    name: "Thiwul Mbak Iswati",
    category: "Kuliner",
    umkm: "Mbak Iswati",
    price: "Rp15.000 / porsi",
    imageAlt: "Thiwul instan disajikan dengan kelapa parut",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/1af69d4a5467c90cf617e50609d8d0cb.jpg",
    isNew: true,
  },
  {
    name: "Batik Sungsang",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000",
    imageAlt: "Batik Sungsang dengan motif abstrak dan warna cerah",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/5fc39e8d401246d025cbe6ff72389b49.jpg",
    isNew: true,
  },
  {
    name: "Tatik Batik",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000 - Rp. 1.500.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik-1.jpg",
    isNew: true,
  },
  {
    name: "Kampung Batik Giriloyo",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000 - Rp. 2.0000.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik.jpg",
    isNew: true,
  },
  {
    name: "Wedang Uwuh",
    category: "Kerajinan Tangan",
    umkm: "Wedang Uwuh HJ. Jazimah",
    price: "Rp20.000 / pcs",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "uwuh.jpg",
    isNew: true,
  },
  {
    name: "Shalsabila Batik",
    category: "Kerajinan Tangan",
    umkm: "Shalsabila Batik",
    price: "Rp900.000 - 1.500.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik-2.png",
    isNew: true,
  },
];

const ProductCard = ({ product, onOrder }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        alt={product.imageAlt} 
        src={product.imageUrl} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      {product.isNew && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded-full">
          BARU
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="text-xs text-primary font-semibold mb-1">{product.category}</p>
      <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">Oleh {product.umkm}</p>
      {product.price && <p className="text-sm font-semibold text-foreground">{product.price}</p>}
      <Button 
        onClick={() => onOrder(product)} 
        size="sm" 
        className="w-full mt-2 text-xs"
      >
        <ShoppingBag className="w-3 h-3 mr-1" /> Pesan
      </Button>
    </div>
  </motion.div>
);

const AnimatedTyping = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 20);
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">
          {displayedText}
          {displayedText.length < text.length && <span className="animate-pulse">|</span>}
        </p>
      </div>
    </div>
  );
};

const ProductChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = "Halo! Saya asisten virtual produk UMKM Wukirsari. Saya bisa membantu Anda menemukan produk yang sesuai. Coba tanyakan tentang 'produk batik', 'kuliner', atau 'semua produk'!";
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ type: 'bot', text: welcomeMessage }]);
        setIsTyping(false);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleWhatsAppOrder = (productName) => {
    const phoneNumber = "628816413617";
    const message = encodeURIComponent(`Halo, saya tertarik untuk memesan produk "${productName}" dari WukirTech.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const filterProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('semua') || lowerQuery.includes('semua produk')) {
      return products;
    }
    
    if (lowerQuery.includes('batik')) {
      return products.filter(product => 
        product.name.toLowerCase().includes('batik') || 
        product.category === 'Kerajinan Tangan'
      );
    }
    
    if (lowerQuery.includes('kuliner') || lowerQuery.includes('makan') || lowerQuery.includes('minuman')) {
      return products.filter(product => product.category === 'Kuliner');
    }
    
    if (lowerQuery.includes('kerajinan') || lowerQuery.includes('tangan')) {
      return products.filter(product => product.category === 'Kerajinan Tangan');
    }
    
    if (lowerQuery.includes('wayang') || lowerQuery.includes('seni')) {
      return products.filter(product => product.category === 'Seni Pertunjukan');
    }
    
    if (lowerQuery.includes('baru') || lowerQuery.includes('terbaru')) {
      return products.filter(product => product.isNew);
    }
    
    // Default search by name
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.umkm.toLowerCase().includes(lowerQuery)
    );
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let productsToShow = [];

    if (lowerMessage.includes('hai') || lowerMessage.includes('halo') || lowerMessage.includes('hello')) {
      response = "Halo! Senang bertemu dengan Anda. Saya bisa membantu menemukan produk UMKM terbaik dari Wukirsari. Produk apa yang sedang Anda cari?";
    } else if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks')) {
      response = "Sama-sama! Jika ada yang else yang bisa saya bantu, jangan ragu untuk bertanya 😊";
    } else {
      productsToShow = filterProducts(userMessage);
      
      if (productsToShow.length > 0) {
        response = `Saya menemukan ${productsToShow.length} produk yang sesuai dengan pencarian Anda:`;
      } else {
        response = "Maaf, saya belum menemukan produk yang sesuai. Coba tanyakan tentang 'produk batik', 'kuliner khas', atau 'kerajinan tangan'.";
      }
    }

    return { response, products: productsToShow };
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    // Add user message
    const userMessage = userInput.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setUserInput('');
    setIsTyping(true);

    // Generate bot response after delay
    setTimeout(() => {
      const { response, products: responseProducts } = generateBotResponse(userMessage);
      
      const newMessages = [{ type: 'bot', text: response }];
      
      // Add products if any
      if (responseProducts.length > 0) {
        newMessages.push({ type: 'products', products: responseProducts });
      }
      
      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1000);
  };

  const suggestedQueries = [
    "Tampilkan semua produk",
    "Produk batik",
    "Kuliner khas",
    "Produk terbaru",
    "Kerajinan tangan"
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Asisten Produk UMKM</h3>
                  <p className="text-xs opacity-80">Online • Siap membantu</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  {message.type === 'user' && (
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}
                  
                  {message.type === 'bot' && (
                    <AnimatedTyping text={message.text} />
                  )}
                  
                  {message.type === 'products' && (
                    <div className="w-full">
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {message.products.map((product, productIndex) => (
                          <ProductCard
                            key={productIndex}
                            product={product}
                            onOrder={handleWhatsAppOrder}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="flex gap-1 bg-card rounded-full px-3 py-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setUserInput(query)}
                      className="text-xs h-7"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Tanyakan tentang produk..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!userInput.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductChatbot;