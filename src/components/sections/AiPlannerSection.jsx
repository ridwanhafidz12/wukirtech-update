import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot, Wand2, Mountain, Utensils, Palette, ShoppingBag, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data UMKM dan Produk dari kode sebelumnya
const umkmData = [
  { name: 'Kerajinan', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Kuliner', value: 35, color: 'hsl(80, 70%, 50%)' },
  { name: 'Jasa & Akomodasi', value: 15, color: 'hsl(140, 50%, 60%)' },
  { name: 'Agrowisata', value: 12, color: 'hsl(40, 60%, 60%)' },
];

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
    imageUrl: "public/wayang.jpeg",
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
  }
];

// Data destinasi wisata
const destinations = [
  {
    name: "Batik Giriloyo",
    type: "Budaya & Kerajinan",
    description: "Sentra batik tulis tradisional dengan workshop untuk belajar membatik",
    activities: ["Workshop Batik", "Belajar Membatik", "Membeli Batik"]
  },
  {
    name: "Wayang Kulit Pucung",
    type: "Seni & Budaya",
    description: "Sanggar pembuatan wayang kulit tradisional",
    activities: ["Melihat Proses Pembuatan", "Belajar Membuat Wayang", "Pertunjukan Wayang"]
  },
  {
    name: "Watu Gagak",
    type: "Alam & Pemandangan",
    description: "Spot sunset dengan pemandangan menakjubkan",
    activities: ["Foto Sunset", "Trekking", "Camping"]
  },
  {
    name: "Embung Wukirsari",
    type: "Alam & Rekreasi",
    description: "Waduk kecil dengan pemandangan alam yang tenang",
    activities: ["Bersantai", "Foto Alam", "Piknik"]
  }
];

const aiResponseItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const aiResponseItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const AiResponseVisualizer = ({ response }) => {
  const [parsedResponse, setParsedResponse] = useState(null);

  useEffect(() => {
    if (!response) return;

    // Parse response untuk mengekstrak informasi
    const activities = [];
    const recommendedProducts = [];
    const recommendedDestinations = [];

    // Cek destinasi yang direkomendasikan
    destinations.forEach(dest => {
      if (response.includes(dest.name)) {
        recommendedDestinations.push(dest);
      }
    });

    // Cek produk yang direkomendasikan
    products.forEach(product => {
      if (response.includes(product.name) || response.includes(product.category)) {
        recommendedProducts.push(product);
      }
    });

    // Parse aktivitas berdasarkan keyword
    if (response.includes("Batik") || response.includes("Giriloyo")) {
      activities.push({ 
        title: "Workshop Batik Giriloyo", 
        icon: Palette, 
        text: "Belajar membatik langsung dari pengrajin batik tulis tradisional.",
        type: "budaya"
      });
    }
    if (response.includes("Wayang") || response.includes("Pucung")) {
      activities.push({ 
        title: "Sanggar Wayang Kulit", 
        icon: Palette, 
        text: "Melihat proses pembuatan wayang kulit di sanggar tradisional.",
        type: "budaya"
      });
    }
    if (response.includes("Watu Gagak") || response.includes("sunset")) {
      activities.push({ 
        title: "Sunset di Watu Gagak", 
        icon: Mountain, 
        text: "Menikmati pemandangan matahari terbenam yang spektakuler.",
        type: "alam"
      });
    }
    if (response.includes("kuliner") || response.includes("makan") || response.includes("Wedang") || response.includes("Thiwul")) {
      activities.push({ 
        title: "Wisata Kuliner Lokal", 
        icon: Utensils, 
        text: "Mencicipi kuliner khas Wukirsari seperti Wedang Uwuh dan Thiwul.",
        type: "kuliner"
      });
    }
    if (response.includes("Embung") || response.includes("alam") || response.includes("trekking")) {
      activities.push({ 
        title: "Eksplorasi Alam", 
        icon: Mountain, 
        text: "Bersantai di Embung Wukirsari dan menikmati udara segar.",
        type: "alam"
      });
    }

    setParsedResponse({
      intro: response,
      activities: activities,
      products: recommendedProducts,
      destinations: recommendedDestinations
    });
  }, [response]);

  if (!parsedResponse) return null;

  return (
    <motion.div 
      className="text-left max-w-4xl mx-auto space-y-6"
      variants={aiResponseItems}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Response */}
      <motion.div className="flex items-start gap-4" variants={aiResponseItem}>
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-1">
          <Bot className="w-6 h-6" />
        </span>
        <div>
          <p className="text-lg text-muted-foreground mb-4">{parsedResponse.intro}</p>
          
          {/* Destinasi yang Direkomendasikan */}
          {parsedResponse.destinations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Destinasi yang Cocok
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parsedResponse.destinations.map((dest, index) => (
                  <div key={index} className="bg-secondary/30 border border-border/20 rounded-lg p-3">
                    <h5 className="font-semibold text-foreground">{dest.name}</h5>
                    <p className="text-sm text-muted-foreground">{dest.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Produk yang Direkomendasikan */}
          {parsedResponse.products.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Produk Rekomendasi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parsedResponse.products.map((product, index) => (
                  <div key={index} className="bg-secondary/30 border border-border/20 rounded-lg p-3">
                    <h5 className="font-semibold text-foreground">{product.name}</h5>
                    <p className="text-sm text-muted-foreground">Oleh {product.umkm} • {product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Aktivitas */}
      {parsedResponse.activities.length > 0 && (
        <motion.div variants={aiResponseItem}>
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Aktivitas yang Bisa Dilakukan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {parsedResponse.activities.map((activity, index) => (
              <div key={index} className="bg-secondary/50 border border-border/30 rounded-lg p-4 flex items-center gap-4">
                <activity.icon className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const AiPlannerSection = () => {
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const generateAIResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    
    // Response berdasarkan kategori input user
    if (lowerCaseInput.includes("budaya") || lowerCaseInput.includes("tradisi") || lowerCaseInput.includes("seni")) {
      return `Untuk pengalaman budaya yang mendalam di Wukirsari, saya merekomendasikan:\n\n• Kunjungi sentra Batik Giriloyo untuk workshop membatik dan melihat proses pembuatan batik tulis tradisional\n• Jelajahi sanggar Wayang Kulit Pucung untuk belajar tentang seni wayang tradisional\n• Anda bisa membeli produk batik dari Paguyuban Batik Giriloyo atau Wayang Kulit dari Ituk Wayang sebagai oleh-oleh\n\nRekomendasi produk: Handmade Batik (Rp700.000-800.000), Wayang Kulit Arjuna (Rp600.000)`;
    
    } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan") || lowerCaseInput.includes("minum")) {
      return `Wisata kuliner Wukirsari menawarkan pengalaman yang tak terlupakan:\n\n• Coba Wedang Uwuh Bu Endang yang menghangatkan (Rp20.000/10pcs)\n• Nikmati Thiwul Mbak Iswati sebagai makanan tradisional (Rp15.000/porsi)\n• Jelajahi berbagai UMKM kuliner lokal dengan 35 unit usaha kuliner tersebar\n\nRekomendasi produk: Wedang Uwuh Bu Endang, Thiwul Mbak Iswati`;
    
    } else if (lowerCaseInput.includes("alam") || lowerCaseInput.includes("pemandangan") || lowerCaseInput.includes("outdoor")) {
      return `Untuk menikmati keindahan alam Wukirsari:\n\n• Nikmati sunset spektakuler di Watu Gagak\n• Bersantai di Embung Wukirsari dengan pemandangan yang menenangkan\n• Lakukan trekking ringan sambil menikmati udara segar pedesaan\n\nJangan lupa bawa oleh-oleh kerajinan tangan seperti Kipas Tangan Zainal (Rp25.000)`;
    
    } else if (lowerCaseInput.includes("kreatif") || lowerCaseInput.includes("kerajinan") || lowerCaseInput.includes("souvenir")) {
      const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);
      return `Wukirsari memiliki ${totalUmkm}+ UMKM dengan beragam produk unggulan:\n\n• Kerajinan: Batik Sungsang (Rp900.000), Handmade Batik (Rp700.000-800.000), Kipas Tangan (Rp25.000)\n• Kuliner: Wedang Uwuh, Thiwul instan\n• Semua produk dibuat langsung oleh pengrajin lokal\n\nRekomendasi: Batik untuk koleksi, Wedang Uwuh untuk oleh-oleh praktis`;
    
    } else if (lowerCaseInput.includes("1 hari") || lowerCaseInput.includes("sehari")) {
      return `Itinerary 1 hari di Wukirsari:\n\nPAGI: Workshop batik di Batik Giriloyo\nSIANG: Makan siang dengan kuliner lokal + beli Wedang Uwuh\nSORE: Kunjungi sanggar Wayang Kulit Pucung\nMALAM: Sunset di Watu Gagak\n\nProduk rekomendasi: Batik dari Giriloyo, Wayang Kulit dari Pucung`;
    
    } else if (lowerCaseInput.includes("2 hari") || lowerCaseInput.includes("weekend")) {
      return `Itinerary 2 hari sempurna di Wukirsari:\n\nHARI 1:\n- Pagi: Workshop Batik Giriloyo\n- Siang: Wisata kuliner & beli oleh-oleh\n- Sore: Eksplor Embung Wukirsari\n- Malam: Sunset di Watu Gagak\n\nHARI 2:\n- Pagi: Kunjungi sanggar Wayang Kulit\n- Siang: Belanja produk UMKM lokal\n- Sore: Aktivitas alam atau budaya pilihan\n\nRekomendasi produk: Berbagai batik, wayang, dan kuliner khas`;
    
    } else {
      // Default response dengan informasi umum
      const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);
      return `Tentu! Berdasarkan permintaan Anda, berikut rekomendasi perjalanan di Wukirsari:\n\nWukirsari memiliki ${totalUmkm}+ UMKM dengan fokus pada kerajinan (45 unit) dan kuliner (35 unit). Kunjungi Batik Giriloyo untuk workshop, sanggar Wayang Kulit Pucung untuk seni tradisional, dan nikmati sunset di Watu Gagak. Jangan lupa mencoba Wedang Uwuh dan Thiwul sebagai kuliner khas, serta beli batik atau wayang sebagai oleh-oleh.`;
    }
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiResponse('');

    setTimeout(() => {
      const response = generateAIResponse(aiInput);
      setAiResponse(response);
      setIsAiLoading(false);
    }, 2000);
  };

  return (
    <section id="ai-planner" className="py-20 md:py-32 ai-planner-bg">
      <div className="container mx-auto px-6">
        <motion.div 
          className="relative bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-primary/10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-400"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-8 border border-primary/20 shadow-lg">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perencana Perjalanan Cerdas</h2>
            <div className="min-h-[300px] my-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aiResponse ? 'response' : 'prompt'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {aiResponse ? (
                    <AiResponseVisualizer response={aiResponse} />
                  ) : (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Bingung mau mulai dari mana? Tanyakan pada AI kami! Dapatkan rekomendasi personal untuk itinerary, kuliner, Kerajinan tangan, dan produk UMKM di Wukirsari.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <form onSubmit={handleAiSubmit} className="max-w-xl mx-auto">
              <div className="relative">
                <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Contoh: 'Rekomendasikan wisata budaya dan produk UMKM untuk 2 hari'"
                  className="flex-grow h-14 pl-12 pr-32 bg-background/50 border-border/30 focus:ring-primary/50 text-base"
                  disabled={isAiLoading}
                />
                <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4" disabled={isAiLoading}>
                  {isAiLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Memproses
                    </>
                  ) : (
                    <>
                      Tanya AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiPlannerSection;