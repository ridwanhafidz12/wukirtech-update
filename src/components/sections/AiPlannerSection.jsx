import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot, Wand2, Mountain, Utensils, Palette, ShoppingBag, Users, MapPin, Calendar, Clock, Star, CheckCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data UMKM dan Produk
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

// Data paket wisata
const tourPackages = [
  {
    id: 1,
    name: "Paket Wisata Budaya Lengkap",
    duration: "1 Hari",
    price: "Rp 350.000",
    description: "Pengalaman lengkap seni dan budaya Wukirsari",
    highlights: [
      "Workshop Batik Giriloyo",
      "Kunjungan Sanggar Wayang Kulit",
      "Makan Siang Kuliner Lokal",
      "Pemandu Wisata Berpengalaman"
    ],
    includes: [
      "Akses ke semua lokasi wisata",
      "Material workshop batik",
      "Makan siang tradisional",
      "Air mineral dan snack",
      "Souvenir batik kecil"
    ],
    category: "budaya",
    rating: 4.8,
    popular: true
  },
  {
    id: 2,
    name: "Paket Eksplorasi Alam",
    duration: "1 Hari",
    price: "Rp 250.000",
    description: "Petualangan menyenangkan menikmati keindahan alam Wukirsari",
    highlights: [
      "Sunset di Watu Gagak",
      "Bersantai di Embung Wukirsari",
      "Trekking ringan",
      "Foto landscape profesional"
    ],
    includes: [
      "Transportasi antar lokasi",
      "Pemandu wisata alam",
      "Air mineral dan snack",
      "Dokumentasi foto",
      "Asuransi perjalanan"
    ],
    category: "alam",
    rating: 4.6,
    popular: false
  },
  {
    id: 3,
    name: "Paket Wisata Kuliner & Belanja",
    duration: "6 Jam",
    price: "Rp 180.000",
    description: "Jelajahi kuliner khas dan produk UMKM unggulan",
    highlights: [
      "Wisata kuliner tradisional",
      "Kunjungan UMKM lokal",
      "Belanja produk kerajinan",
      "Demo memasak tradisional"
    ],
    includes: [
      "5 sample makanan tradisional",
      "Goodie bag produk UMKM",
      "Pemandu kuliner",
      "Buku resep tradisional",
      "Diskon belanja UMKM"
    ],
    category: "kuliner",
    rating: 4.7,
    popular: true
  },
  {
    id: 4,
    name: "Paket Premium 2 Hari 1 Malam",
    duration: "2 Hari 1 Malam",
    price: "Rp 850.000",
    description: "Pengalaman komprehensif semua aspek wisata Wukirsari",
    highlights: [
      "Akomodasi penginapan lokal",
      "Semua aktivitas budaya & alam",
      "Makan lengkap 3x sehari",
      "Workshop eksklusif"
    ],
    includes: [
      "Penginapan homestay",
      "Semua tiket masuk lokasi",
      "Makan tradisional lengkap",
      "Pemandu pribadi",
      "Transportasi selama tour",
      "Souvenir premium"
    ],
    category: "premium",
    rating: 4.9,
    popular: true
  }
];

const aiResponseItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const aiResponseItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const TourPackageCard = ({ pkg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={cn(
      "bg-card border border-border/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full flex flex-col",
      pkg.popular && "ring-2 ring-primary/20 relative"
    )}
  >
    {pkg.popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Paling Populer
        </span>
      </div>
    )}
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg text-foreground mb-1">{pkg.name}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {pkg.rating}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{pkg.price}</div>
        <div className="text-sm text-muted-foreground">/orang</div>
      </div>
    </div>

    <p className="text-muted-foreground mb-4 text-sm flex-grow">{pkg.description}</p>

    <div className="space-y-3 mb-4">
      <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        Highlight Aktivitas
      </h4>
      <div className="space-y-2">
        {pkg.highlights.map((highlight, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{highlight}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <h4 className="font-semibold text-foreground text-sm">Termasuk dalam paket:</h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        {pkg.includes.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
            <span className="text-xs">{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <Button className="w-full mt-auto" size="lg">
      Pesan Sekarang
    </Button>
  </motion.div>
);

const QuickSuggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "Paket wisata budaya",
    "Wisata alam murah",
    "Tour kuliner lokal",
    "Paket 2 hari 1 malam",
    "Aktivitas keluarga",
    "Oleh-oleh khas"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center mt-4"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-2 bg-secondary/50 border border-border/30 rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
};

const AiResponseVisualizer = ({ response }) => {
  const [parsedResponse, setParsedResponse] = useState(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (!response) return;

    // Parse response untuk mengekstrak informasi
    const activities = [];
    const recommendedProducts = [];
    const recommendedDestinations = [];
    const recommendedPackages = [];

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

    // Cek paket wisata yang direkomendasikan
    tourPackages.forEach(pkg => {
      if (response.includes(pkg.name) || response.includes(pkg.category) || 
          response.toLowerCase().includes('paket') || response.toLowerCase().includes('tour package')) {
        recommendedPackages.push(pkg);
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
      destinations: recommendedDestinations,
      packages: recommendedPackages
    });

    // Scroll ke atas ketika response baru diterima
    setTimeout(() => {
      if (responseRef.current) {
        responseRef.current.scrollTop = 0;
      }
    }, 100);
  }, [response]);

  if (!parsedResponse) return null;

  return (
    <div ref={responseRef} className="h-full overflow-y-auto">
      <motion.div 
        className="text-left space-y-6 pb-4"
        variants={aiResponseItems}
        initial="hidden"
        animate="visible"
      >
        {/* Intro Response */}
        <motion.div className="flex items-start gap-3" variants={aiResponseItem}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-1">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground leading-relaxed whitespace-pre-line">{parsedResponse.intro}</p>
          </div>
        </motion.div>

        {/* Paket Wisata yang Direkomendasikan */}
        {parsedResponse.packages.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-11">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Paket Wisata Rekomendasi
            </h4>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {parsedResponse.packages.map((pkg, index) => (
                <TourPackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Destinasi yang Direkomendasikan */}
        {parsedResponse.destinations.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-11">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-primary" />
              Destinasi yang Cocok
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parsedResponse.destinations.map((dest, index) => (
                <div key={index} className="bg-secondary/30 border border-border/20 rounded-lg p-3 transition-colors hover:bg-secondary/50">
                  <h5 className="font-semibold text-foreground text-base mb-1">{dest.name}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{dest.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {dest.activities.slice(0, 3).map((activity, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Produk yang Direkomendasikan */}
        {parsedResponse.products.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-11">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Produk Rekomendasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {parsedResponse.products.map((product, index) => (
                <div key={index} className="bg-secondary/30 border border-border/20 rounded-lg p-3 transition-colors hover:bg-secondary/50">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-semibold text-foreground text-sm">{product.name}</h5>
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">Baru</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Oleh {product.umkm}</p>
                  <p className="text-primary font-semibold text-sm">{product.price}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Aktivitas */}
        {parsedResponse.activities.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-11">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Aktivitas yang Bisa Dilakukan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parsedResponse.activities.map((activity, index) => (
                <div key={index} className="bg-secondary/50 border border-border/30 rounded-lg p-3 flex items-start gap-3 transition-colors hover:bg-secondary/70">
                  <activity.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{activity.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const AiPlannerSection = () => {
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const containerRef = useRef(null);

  const generateAIResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    
    // Response berdasarkan kategori input user
    if (lowerCaseInput.includes("paket") || lowerCaseInput.includes("tour") || lowerCaseInput.includes("package")) {
      if (lowerCaseInput.includes("budaya") || lowerCaseInput.includes("seni")) {
        return `Berdasarkan minat Anda pada wisata budaya, saya merekomendasikan Paket Wisata Budaya Lengkap. Paket ini menawarkan pengalaman mendalam seni tradisional Wukirsari dengan workshop batik, kunjungan sanggar wayang kulit, dan kuliner lokal. Durasi 1 hari dengan harga Rp 350.000 termasuk semua aktivitas dan makan siang.`;
      
      } else if (lowerCaseInput.includes("alam") || lowerCaseInput.includes("outdoor")) {
        return `Untuk petualangan alam di Wukirsari, Paket Eksplorasi Alam sangat cocok. Anda akan menikmati sunset di Watu Gagak, bersantai di Embung Wukirsari, dan trekking ringan. Paket 1 hari dengan harga Rp 250.000 termasuk transportasi dan dokumentasi foto.`;
      
      } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan")) {
        return `Paket Wisata Kuliner & Belanja sempurna untuk menjelajahi kekayaan kuliner Wukirsari. Anda akan mencicipi 5 sample makanan tradisional, berkunjung ke UMKM lokal, dan mendapatkan goodie bag produk UMKM. Durasi 6 jam dengan harga Rp 180.000.`;
      
      } else if (lowerCaseInput.includes("premium") || lowerCaseInput.includes("lengkap") || lowerCaseInput.includes("2 hari")) {
        return `Paket Premium 2 Hari 1 Malam menawarkan pengalaman komprehensif Wukirsari. Termasuk akomodasi, semua aktivitas budaya & alam, makan lengkap, dan workshop eksklusif. Harga Rp 850.000 dengan rating 4.9/5 dari pengunjung sebelumnya.`;
      
      } else {
        return `Wukirsari menawarkan berbagai paket wisata yang dapat disesuaikan dengan kebutuhan Anda:\n\n• Paket Wisata Budaya Lengkap (1 Hari - Rp 350.000)\n• Paket Eksplorasi Alam (1 Hari - Rp 250.000)\n• Paket Wisata Kuliner & Belanja (6 Jam - Rp 180.000)\n• Paket Premium 2 Hari 1 Malam (Rp 850.000)\n\nPaket mana yang paling menarik minat Anda?`;
      }
    
    } else if (lowerCaseInput.includes("budaya") || lowerCaseInput.includes("tradisi") || lowerCaseInput.includes("seni")) {
      return `Untuk pengalaman budaya yang mendalam di Wukirsari, saya merekomendasikan Paket Wisata Budaya Lengkap. Kunjungi sentra Batik Giriloyo untuk workshop membatik, sanggar Wayang Kulit Pucung, dan nikmati kuliner lokal. Jangan lewatkan produk batik dari Paguyuban Batik Giriloyo dan Wayang Kulit dari Ituk Wayang sebagai oleh-oleh. Paket ini termasuk workshop, makan siang, dan souvenir dengan harga Rp 350.000.`;
    
    } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan") || lowerCaseInput.includes("minum")) {
      return `Wisata kuliner Wukirsari menawarkan pengalaman yang tak terlupakan melalui Paket Wisata Kuliner & Belanja. Coba Wedang Uwuh Bu Endang yang menghangatkan, Thiwul Mbak Iswati, dan berbagai kuliner lokal lainnya. Paket 6 jam dengan harga Rp 180.000 termasuk 5 sample makanan, goodie bag, dan diskon belanja UMKM.`;
    
    } else if (lowerCaseInput.includes("alam") || lowerCaseInput.includes("pemandangan") || lowerCaseInput.includes("outdoor")) {
      return `Untuk menikmati keindahan alam Wukirsari, Paket Eksplorasi Alam sangat recommended. Nikmati sunset spektakuler di Watu Gagak, bersantai di Embung Wukirsari, dan trekking ringan. Paket 1 hari dengan harga Rp 250.000 termasuk transportasi, pemandu, dan dokumentasi foto.`;
    
    } else if (lowerCaseInput.includes("kreatif") || lowerCaseInput.includes("kerajinan") || lowerCaseInput.includes("souvenir")) {
      const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);
      return `Wukirsari memiliki ${totalUmkm}+ UMKM dengan beragam produk unggulan. Saya sarankan Paket Wisata Budaya Lengkap yang termasuk workshop batik. Produk rekomendasi: Batik Sungsang (Rp900.000), Handmade Batik (Rp700.000-800.000), Kipas Tangan (Rp25.000), dan berbagai kuliner khas. Semua produk dibuat langsung oleh pengrajin lokal.`;
    
    } else if (lowerCaseInput.includes("1 hari") || lowerCaseInput.includes("sehari")) {
      return `Untuk kunjungan 1 hari, saya rekomendasikan Paket Wisata Budaya Lengkap dengan itinerary:\n\nPAGI: Workshop batik di Batik Giriloyo\nSIANG: Makan siang kuliner lokal + beli Wedang Uwuh\nSORE: Kunjungi sanggar Wayang Kulit Pucung\nMALAM: Sunset di Watu Gagak\n\nHarga paket: Rp 350.000 termasuk semua aktivitas dan makan.`;
    
    } else if (lowerCaseInput.includes("2 hari") || lowerCaseInput.includes("weekend")) {
      return `Paket Premium 2 Hari 1 Malam sempurna untuk weekend getaway:\n\nHARI 1:\n- Pagi: Workshop Batik Giriloyo\n- Siang: Wisata kuliner & beli oleh-oleh\n- Sore: Eksplor Embung Wukirsari\n- Malam: Sunset di Watu Gagak\n\nHARI 2:\n- Pagi: Kunjungi sanggar Wayang Kulit\n- Siang: Belanja produk UMKM lokal\n- Sore: Aktivitas alam atau budaya pilihan\n\nHarga: Rp 850.000 termasuk penginapan dan semua aktivitas.`;
    
    } else {
      // Default response dengan informasi umum dan paket
      const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);
      return `Selamat datang di Perencana Perjalanan Wukirsari! Berdasarkan permintaan Anda, berikut rekomendasi terbaik:\n\nWukirsari memiliki ${totalUmkm}+ UMKM dengan fokus pada kerajinan (45 unit) dan kuliner (35 unit). Kami menawarkan berbagai paket wisata:\n\n• Paket Budaya Lengkap (Rp 350.000) - Workshop batik & wayang\n• Paket Eksplorasi Alam (Rp 250.000) - Watu Gagak & Embung\n• Paket Kuliner (Rp 180.000) - 5 sample makanan tradisional\n• Paket Premium 2 Hari (Rp 850.000) - Pengalaman komprehensif\n\nPaket mana yang ingin Anda eksplorasi lebih lanjut?`;
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
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setAiInput(suggestion);
  };

  return (
    <section id="ai-planner" className="h-screen flex flex-col bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-6 flex flex-col flex-grow max-w-6xl">
        <motion.div 
          ref={containerRef}
          className="relative bg-card/80 backdrop-blur-xl border border-primary/20 rounded-3xl flex flex-col flex-grow overflow-hidden shadow-2xl shadow-primary/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Background Effects */}
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-400"></div>
          
          <div className="relative z-10 flex flex-col flex-grow p-6">
            {/* Header */}
            <motion.div 
              className="flex-shrink-0 text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4 border border-primary/20 shadow-lg">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">AI Travel Planner</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Dapatkan rekomendasi perjalanan personal untuk Wukirsari
              </p>
            </motion.div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aiResponse ? 'response' : 'prompt'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow flex flex-col"
                >
                  {aiResponse ? (
                    <AiResponseVisualizer response={aiResponse} />
                  ) : (
                    <motion.div 
                      className="flex-grow flex flex-col items-center justify-center text-center space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="space-y-4 max-w-lg">
                        {/* <p className="text-lg text-muted-foreground leading-relaxed">
                          Jelajahi Wukirsari dengan panduan AI kami. Dapatkan rekomendasi paket wisata, itinerary personal, 
                          dan produk UMKM terbaik yang disesuaikan dengan preferensi Anda.
                        </p> */}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                          {tourPackages.slice(0, 3).map((pkg) => (
                            <div key={pkg.id} className="bg-secondary/30 border border-border/20 rounded-lg p-3 text-center">
                              <h4 className="font-semibold text-foreground text-sm mb-1">{pkg.name}</h4>
                              <p className="text-primary font-bold">{pkg.price}</p>
                              <p className="text-xs text-muted-foreground">{pkg.duration}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <QuickSuggestions onSuggestionClick={handleSuggestionClick} /> */}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Input Form - Fixed at Bottom */}
            <motion.div 
              className="flex-shrink-0 pt-4 mt-4 border-t border-border/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleAiSubmit} className="w-full">
                <div className="relative">
                  <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Tanyakan tentang paket wisata, aktivitas, atau produk UMKM..."
                    className="flex-grow h-12 pl-10 pr-24 bg-background/70 border-border/40 focus:ring-primary/50 text-sm placeholder:text-muted-foreground/70"
                    disabled={isAiLoading}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4" 
                    disabled={isAiLoading || !aiInput.trim()}
                  >
                    {isAiLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Memproses
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiPlannerSection;