import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, MessageCircle, MapPin, Clock, Users, Mountain, Utensils, Palette } from 'lucide-react';

// Data wisata dari kode yang diberikan (tanpa harga dan gambar)
const wisataData = [
  {
    name: "Workshop Batik Giriloyo",
    category: "Budaya & Kerajinan",
    lokasi: "Sentra Batik Giriloyo",
    imageAlt: "Workshop membatik di Giriloyo",
    isNew: true,
    durasi: "2-3 jam",
    rating: "4.8",
    fasilitas: ["Workshop", "Pemandu", "Materi Batik"],
    icon: Palette
  },
  {
    name: "Sanggar Wayang Kulit Pucung",
    category: "Seni & Pertunjukan",
    lokasi: "Desa Pucung",
    imageAlt: "Pembuatan wayang kulit tradisional",
    isNew: false,
    durasi: "1-2 jam",
    rating: "4.7",
    fasilitas: ["Demo Pembuatan", "Pertunjukan", "Workshop"],
    icon: Palette
  },
  {
    name: "Watu Gagak Sunset Point",
    category: "Alam & Pemandangan",
    lokasi: "Perbukitan Wukirsari",
    imageAlt: "Pemandangan sunset dari Watu Gagak",
    isNew: true,
    durasi: "1-3 jam",
    rating: "4.9",
    fasilitas: ["Area Foto", "Warung Kopi", "Trekking Path"],
    icon: Mountain
  },
  {
    name: "Wisata Kuliner Sate Klathak",
    category: "Kuliner",
    lokasi: "Pusat Kuliner Wukirsari",
    imageAlt: "Sate Klathak legendaris",
    isNew: false,
    durasi: "1-2 jam",
    rating: "4.6",
    fasilitas: ["Makanan Khas", "Area Makan", "Parkir Luas"],
    icon: Utensils
  },
  {
    name: "Embung Wukirsari",
    category: "Alam & Rekreasi",
    lokasi: "Tengah Desa Wukirsari",
    imageAlt: "Embung dengan pemandangan alam",
    isNew: true,
    durasi: "1-2 jam",
    rating: "4.5",
    fasilitas: ["Area Bersantai", "Perahu", "Spot Foto"],
    icon: Mountain
  },
  {
    name: "Pasar Tradisional Wukirsari",
    category: "Kuliner & Belanja",
    lokasi: "Pusat Desa Wukirsari",
    imageAlt: "Pasar tradisional pagi hari",
    isNew: false,
    durasi: "1-2 jam",
    rating: "4.4",
    fasilitas: ["Jajanan Pasar", "Oleh-oleh", "Parkir"],
    icon: Utensils
  },
  {
    name: "Trekking Bukit Wukirsari",
    category: "Alam & Petualangan",
    lokasi: "Perbukitan Sekitar",
    imageAlt: "Jalur trekking di bukit",
    isNew: true,
    durasi: "2-4 jam",
    rating: "4.7",
    fasilitas: ["Pemandu", "Air Minum", "First Aid"],
    icon: Mountain
  },
  {
    name: "Madu Asli Wukirsari",
    category: "Oleh-oleh & Kerajinan",
    lokasi: "UMKM Madu Wukirsari",
    imageAlt: "Madu asli produksi lokal",
    isNew: true,
    durasi: "30 menit - 1 jam",
    rating: "4.8",
    fasilitas: ["Demo Produksi", "Tasting", "Packaging"],
    icon: Users
  }
];

// Komponen Payment Modal yang disederhanakan (hanya WhatsApp)
const PaymentModal = ({ wisata, onClose, onWhatsAppOrder }) => {
  if (!wisata) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 mb-4 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Informasi: {wisata.name}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        Hubungi kami via WhatsApp untuk informasi lebih lanjut tentang wisata ini.
      </p>

      <div className="p-3 bg-secondary/20 rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">
          Klik tombol di bawah untuk mengirim pesan langsung ke kami.
        </p>
        <Button 
          onClick={() => onWhatsAppOrder(wisata.name)} 
          size="sm" 
          className="w-full text-xs"
        >
          <MessageCircle className="w-3 h-3 mr-1" /> 
          Konsultasi via WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

const WisataCard = ({ wisata, onOrder }) => {
  const IconComponent = wisata.icon || Mountain;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-3">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-semibold mb-1">{wisata.category}</p>
            <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{wisata.name}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{wisata.lokasi}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{wisata.durasi}</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
            <span>⭐ {wisata.rating}</span>
          </div>
        </div>

        {wisata.isNew && (
          <div className="inline-block bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded-full mb-2">
            BARU
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {wisata.fasilitas.slice(0, 2).map((fasilitas, index) => (
            <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-md">
              {fasilitas}
            </span>
          ))}
          {wisata.fasilitas.length > 2 && (
            <span className="text-xs bg-secondary px-2 py-1 rounded-md">
              +{wisata.fasilitas.length - 2} lagi
            </span>
          )}
        </div>
        
        <Button 
          onClick={() => onOrder(wisata)} 
          size="sm" 
          className="w-full text-xs"
        >
          <MessageCircle className="w-3 h-3 mr-1" /> Info Lebih Lanjut
        </Button>
      </div>
    </motion.div>
  );
};

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

const WisataChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedWisata, setSelectedWisata] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showPaymentModal]);

  // Initial message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = "Halo! Saya asisten virtual wisata Wukirsari. Saya bisa membantu Anda menemukan destinasi wisata yang sesuai. Coba tanyakan tentang 'wisata alam', 'budaya', 'kuliner', atau 'semua wisata'!";
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ type: 'bot', text: welcomeMessage }]);
        setIsTyping(false);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleWhatsAppOrder = (wisataName) => {
    const phoneNumber = "628816413617";
    const message = encodeURIComponent(`Halo, saya tertarik dengan wisata "${wisataName}" di Wukirsari. Bisa info lebih lanjut?`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setShowPaymentModal(false);
    setSelectedWisata(null);
  };

  const filterWisata = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('semua') || lowerQuery.includes('semua wisata')) {
      return wisataData;
    }
    
    if (lowerQuery.includes('alam') || lowerQuery.includes('pemandangan') || lowerQuery.includes('trekking')) {
      return wisataData.filter(wisata => 
        wisata.category.includes('Alam') || 
        wisata.name.toLowerCase().includes('watu') ||
        wisata.name.toLowerCase().includes('embung') ||
        wisata.name.toLowerCase().includes('bukit')
      );
    }
    
    if (lowerQuery.includes('budaya') || lowerQuery.includes('kerajinan') || lowerQuery.includes('seni')) {
      return wisataData.filter(wisata => 
        wisata.category.includes('Budaya') || 
        wisata.category.includes('Seni') ||
        wisata.name.toLowerCase().includes('batik') ||
        wisata.name.toLowerCase().includes('wayang')
      );
    }
    
    if (lowerQuery.includes('kuliner') || lowerQuery.includes('makan') || lowerQuery.includes('jajanan')) {
      return wisataData.filter(wisata => 
        wisata.category.includes('Kuliner') || 
        wisata.name.toLowerCase().includes('sate') ||
        wisata.name.toLowerCase().includes('pasar')
      );
    }
    
    if (lowerQuery.includes('oleh-oleh') || lowerQuery.includes('madu')) {
      return wisataData.filter(wisata => 
        wisata.category.includes('Oleh-oleh') || 
        wisata.name.toLowerCase().includes('madu')
      );
    }
    
    if (lowerQuery.includes('baru') || lowerQuery.includes('terbaru')) {
      return wisataData.filter(wisata => wisata.isNew);
    }
    
    // Default search by name
    return wisataData.filter(wisata => 
      wisata.name.toLowerCase().includes(lowerQuery) ||
      wisata.lokasi.toLowerCase().includes(lowerQuery) ||
      wisata.category.toLowerCase().includes(lowerQuery)
    );
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let wisataToShow = [];

    if (lowerMessage.includes('hai') || lowerMessage.includes('halo') || lowerMessage.includes('hello')) {
      response = "Halo! Senang bertemu dengan Anda. Saya bisa membantu menemukan destinasi wisata terbaik di Wukirsari. Jenis wisata apa yang sedang Anda cari?";
    } else if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks')) {
      response = "Sama-sama! Jika ada yang else yang bisa saya bantu, jangan ragu untuk bertanya 😊";
    } else if (lowerMessage.includes('rekomendasi') || lowerMessage.includes('sarankan')) {
      response = "Berdasarkan preferensi pengunjung, berikut beberapa wisata populer di Wukirsari:";
      wisataToShow = wisataData.filter(wisata => wisata.rating >= 4.7).slice(0, 4);
    } else {
      wisataToShow = filterWisata(userMessage);
      
      if (wisataToShow.length > 0) {
        response = `Saya menemukan ${wisataToShow.length} destinasi wisata yang sesuai dengan pencarian Anda:`;
      } else {
        response = "Maaf, saya belum menemukan wisata yang sesuai. Coba tanyakan tentang 'wisata alam', 'budaya tradisional', 'kuliner khas', atau 'wisata terbaru'.";
      }
    }

    return { response, wisata: wisataToShow };
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
      const { response, wisata: responseWisata } = generateBotResponse(userMessage);
      
      const newMessages = [{ type: 'bot', text: response }];
      
      // Add wisata if any
      if (responseWisata.length > 0) {
        newMessages.push({ type: 'wisata', wisata: responseWisata });
      }
      
      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOrderClick = (wisata) => {
    setSelectedWisata(wisata);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedWisata(null);
  };

  const suggestedQueries = [
    "Tampilkan semua wisata",
    "Wisata alam",
    "Budaya & kerajinan",
    "Kuliner khas",
    "Wisata terbaru",
    "Rekomendasi terpopuler"
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
                  <h3 className="font-semibold">Asisten Wisata Wukirsari</h3>
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
                  
                  {message.type === 'wisata' && (
                    <div className="w-full">
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {message.wisata.map((wisata, wisataIndex) => (
                          <WisataCard
                            key={wisataIndex}
                            wisata={wisata}
                            onOrder={handleOrderClick}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Payment Modal */}
              {showPaymentModal && selectedWisata && (
                <PaymentModal 
                  wisata={selectedWisata}
                  onClose={closePaymentModal}
                  onWhatsAppOrder={handleWhatsAppOrder}
                />
              )}
              
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
            {messages.length <= 2 && !showPaymentModal && (
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
                  placeholder="Tanyakan tentang wisata..."
                  className="flex-1"
                  disabled={isTyping || showPaymentModal}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!userInput.trim() || isTyping || showPaymentModal}
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

export default WisataChatbot;