import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot, Wand2, Mountain, Utensils, Palette, ShoppingBag, Users, MapPin, Calendar, Clock, Star, CheckCircle, Send, X, Minimize2, DollarSign, Navigation, Camera, Coffee, Home } from 'lucide-react';
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

// Data destinasi wisata yang diperbarui dengan informasi lengkap
const destinations = [
  {
    id: 1,
    name: "Batik Giriloyo",
    type: "Budaya & Kerajinan",
    description: "Sentra batik tulis tradisional dengan workshop untuk belajar membatik dari pengrajin lokal yang berpengalaman",
    activities: ["Workshop Batik", "Belajar Membatik", "Membeli Batik", "Foto Budaya"],
    price: "Rp 50.000 - Rp 150.000",
    duration: "2-3 jam",
    bestTime: "Pagi atau Sore",
    highlights: ["Batik Tulis Authentic", "Pengrajin Lokal", "Workshop Interaktif"],
    facilities: ["Area Workshop", "Showroom", "Toilet", "Parkir"],
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1554341117-2c084a55c8dc?w=400",
    location: "Desa Giriloyo, Wukirsari"
  },
  {
    id: 2,
    name: "Wayang Kulit Pucung",
    type: "Seni & Budaya",
    description: "Sanggar pembuatan wayang kulit tradisional dengan pertunjukan wayang yang memukau",
    activities: ["Melihat Proses Pembuatan", "Belajar Membuat Wayang", "Pertunjukan Wayang", "Foto Dokumentasi"],
    price: "Rp 75.000 - Rp 200.000",
    duration: "1-2 jam",
    bestTime: "Siang atau Malam (untuk pertunjukan)",
    highlights: ["Wayang Kulit Authentic", "Pertunjukan Live", "Proses Pembuatan Tradisional"],
    facilities: ["Auditorium", "Workshop Area", "Parkir", "Toilet"],
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1588072432907-cb61cbc3e4f9?w=400",
    location: "Desa Pucung, Wukirsari"
  },
  {
    id: 3,
    name: "Watu Gagak",
    type: "Alam & Pemandangan",
    description: "Spot sunset dengan pemandangan menakjubkan dan udara sejuk pegunungan",
    activities: ["Foto Sunset", "Trekking", "Camping", "Bird Watching", "Photography"],
    price: "Rp 10.000 - Rp 25.000",
    duration: "1-3 jam",
    bestTime: "Sore (16:00-18:00) untuk sunset",
    highlights: ["Pemandangan Sunset", "Udara Segar", "Spot Foto Instagramable"],
    facilities: ["Area Parkir", "Gazebo", "Toilet", "Warung Makan"],
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    location: "Puncak Wukirsari"
  },
  {
    id: 4,
    name: "Embung Wukirsari",
    type: "Alam & Rekreasi",
    description: "Waduk kecil dengan pemandangan alam yang tenang dan cocok untuk bersantai",
    activities: ["Bersantai", "Foto Alam", "Piknik", "Fishing", "Boating"],
    price: "Rp 5.000 - Rp 15.000",
    duration: "1-2 jam",
    bestTime: "Pagi atau Sore",
    highlights: ["Pemandangan Danau", "Udara Segar", "Area Piknik"],
    facilities: ["Area Piknik", "Perahu Sewa", "Warung Makan", "Toilet", "Parkir"],
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    location: "Pusat Desa Wukirsari"
  },
  {
    id: 5,
    name: "Kampung Kuliner Wukirsari",
    type: "Kuliner & Wisata Gastronomi",
    description: "Pusat kuliner tradisional dengan berbagai makanan dan minuman khas daerah",
    activities: ["Wisata Kuliner", "Demo Memasak", "Belajar Masak Tradisional", "Food Photography"],
    price: "Rp 20.000 - Rp 100.000",
    duration: "1-2 jam",
    bestTime: "Siang atau Malam",
    highlights: ["Makanan Tradisional", "Wedang Uwuh", "Thiwul Khas", "Atmosfer Tradisional"],
    facilities: ["Area Makan", "Demo Kitchen", "Toilet", "Parkir"],
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    location: "Jalan Utama Wukirsari"
  },
  {
    id: 6,
    name: "Agrowisata Kebun Teh",
    type: "Agrowisata & Perkebunan",
    description: "Perkebunan teh organik dengan pemandangan hijau dan aktivitas petik teh",
    activities: ["Tea Picking", "Tea Tasting", "Foto Landscape", "Edukasi Pertanian"],
    price: "Rp 30.000 - Rp 80.000",
    duration: "2-3 jam",
    bestTime: "Pagi Hari",
    highlights: ["Pemandangan Kebun Teh", "Tea Tasting", "Aktivitas Petik Teh"],
    facilities: ["Tea House", "Area Workshop", "Parkir", "Toilet"],
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    location: "Perbukitan Wukirsari"
  }
];

// Data paket wisata yang diperbarui
const tourPackages = [
  {
    id: 1,
    name: "Paket Wisata Budaya Lengkap",
    duration: "1 Hari",
    price: "Rp 350.000",
    originalPrice: "Rp 400.000",
    description: "Pengalaman lengkap seni dan budaya Wukirsari dengan akses ke semua workshop dan sanggar tradisional",
    highlights: [
      "Workshop Batik Giriloyo",
      "Kunjungan Sanggar Wayang Kulit",
      "Makan Siang Kuliner Lokal",
      "Pemandu Wisata Berpengalaman",
      "Souvenir Batik Kecil"
    ],
    includes: [
      "Akses ke semua lokasi wisata budaya",
      "Material workshop batik lengkap",
      "Makan siang tradisional 3 menu",
      "Air mineral dan snack tradisional",
      "Souvenir batik kecil",
      "Dokumentasi foto"
    ],
    excludes: [
      "Transportasi personal",
      "Pengeluaran pribadi",
      "Tip untuk pemandu"
    ],
    category: "budaya",
    rating: 4.8,
    reviewCount: 124,
    popular: true,
    durationDetail: "08:00 - 17:00 WIB",
    meetingPoint: "Pos Utama Wisata Wukirsari"
  },
  {
    id: 2,
    name: "Paket Eksplorasi Alam Premium",
    duration: "1 Hari",
    price: "Rp 250.000",
    originalPrice: "Rp 300.000",
    description: "Petualangan menyenangkan menikmati keindahan alam Wukirsari dengan pemandangan terbaik",
    highlights: [
      "Sunset di Watu Gagak",
      "Bersantai di Embung Wukirsari",
      "Trekking ringan berpemandu",
      "Foto landscape profesional",
      "Coffee break di alam"
    ],
    includes: [
      "Transportasi antar lokasi wisata",
      "Pemandu wisata alam profesional",
      "Air mineral dan snack sehat",
      "Dokumentasi foto profesional",
      "Asuransi perjalanan",
      "Coffee break tradisional"
    ],
    excludes: [
      "Makan siang",
      "Pengeluaran pribadi",
      "Tip untuk pemandu"
    ],
    category: "alam",
    rating: 4.6,
    reviewCount: 89,
    popular: false,
    durationDetail: "09:00 - 18:00 WIB",
    meetingPoint: "Pos Pendakian Watu Gagak"
  },
  {
    id: 3,
    name: "Paket Wisata Kuliner Eksklusif",
    duration: "6 Jam",
    price: "Rp 180.000",
    originalPrice: "Rp 220.000",
    description: "Jelajahi kuliner khas dan produk UMKM unggulan dengan taste experience terbaik",
    highlights: [
      "Wisata kuliner tradisional premium",
      "Kunjungan UMKM lokal terpilih",
      "Belanja produk kerajinan",
      "Demo memasak tradisional",
      "Goodie bag produk UMKM"
    ],
    includes: [
      "8 sample makanan tradisional premium",
      "Goodie bag produk UMKM senilai Rp 50.000",
      "Pemandu kuliner berpengalaman",
      "Buku resep tradisional",
      "Diskon belanja UMKM 15%",
      "Minuman tradisional unlimited"
    ],
    excludes: [
      "Belanja personal",
      "Transportasi antar UMKM",
      "Tip untuk pemandu"
    ],
    category: "kuliner",
    rating: 4.7,
    reviewCount: 156,
    popular: true,
    durationDetail: "10:00 - 16:00 WIB",
    meetingPoint: "Kampung Kuliner Wukirsari"
  },
  {
    id: 4,
    name: "Paket Premium 2 Hari 1 Malam",
    duration: "2 Hari 1 Malam",
    price: "Rp 850.000",
    originalPrice: "Rp 1.000.000",
    description: "Pengalaman komprehensif semua aspek wisata Wukirsari dengan akomodasi premium",
    highlights: [
      "Akomodasi penginapan lokal premium",
      "Semua aktivitas budaya & alam",
      "Makan lengkap 6x (3x sehari)",
      "Workshop eksklusif batik dan wayang",
      "Private tour guide"
    ],
    includes: [
      "Penginapan homestay premium 1 malam",
      "Semua tiket masuk lokasi wisata",
      "Makan tradisional lengkap 6x",
      "Pemandu pribadi selama tour",
      "Transportasi selama tour",
      "Souvenir premium (Batik atau Wayang)",
      "Welcome drink dan farewell dinner"
    ],
    excludes: [
      "Transportasi menuju Wukirsari",
      "Pengeluaran pribadi",
      "Tip untuk staff"
    ],
    category: "premium",
    rating: 4.9,
    reviewCount: 78,
    popular: true,
    durationDetail: "Day 1: 09:00 - Day 2: 17:00",
    meetingPoint: "Pos Utama Wisata Wukirsari"
  },
  {
    id: 5,
    name: "Paket Keluarga Hemat",
    duration: "1 Hari",
    price: "Rp 150.000",
    originalPrice: "Rp 180.000",
    description: "Paket ekonomis untuk keluarga dengan aktivitas menyenangkan dan terjangkau",
    highlights: [
      "Kunjungan Embung Wukirsari",
      "Wisata kuliner keluarga",
      "Aktivitas foto di spot instagramable",
      "Piknik santai",
      "Games tradisional"
    ],
    includes: [
      "Tiket masuk 3 lokasi wisata",
      "Pemandu wisata ramah keluarga",
      "Air mineral untuk keluarga",
      "Snack tradisional",
      "Dokumentasi foto keluarga",
      "Goodie bag kecil"
    ],
    excludes: [
      "Makan siang",
      "Transportasi",
      "Aktivitas tambahan"
    ],
    category: "keluarga",
    rating: 4.5,
    reviewCount: 203,
    popular: false,
    durationDetail: "08:00 - 16:00 WIB",
    meetingPoint: "Embung Wukirsari"
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

// Komponen Kartu Paket Wisata yang Diperbarui
const TourPackageCard = ({ pkg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={cn(
      "bg-card border border-border/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full flex flex-col",
      pkg.popular && "ring-2 ring-primary/20 relative"
    )}
  >
    {pkg.popular && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
          Populer
        </span>
      </div>
    )}
    
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-bold text-base text-foreground mb-1">{pkg.name}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {pkg.rating} ({pkg.reviewCount})
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{pkg.durationDetail}</p>
      </div>
    </div>

    <div className="mb-3">
      <div className="flex items-baseline gap-2">
        <div className="text-lg font-bold text-primary">{pkg.price}</div>
        {pkg.originalPrice && (
          <div className="text-xs text-muted-foreground line-through">{pkg.originalPrice}</div>
        )}
      </div>
      <div className="text-xs text-muted-foreground">/orang</div>
    </div>

    <p className="text-muted-foreground mb-3 text-xs flex-grow">{pkg.description}</p>

    <div className="space-y-2 mb-3">
      <h4 className="font-semibold text-foreground text-xs flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-primary" />
        Highlight Aktivitas
      </h4>
      <div className="space-y-1">
        {pkg.highlights.slice(0, 3).map((highlight, i) => (
          <div key={i} className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
            <span className="text-xs">{highlight}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Navigation className="w-3 h-3" />
        Meeting Point: {pkg.meetingPoint}
      </span>
    </div>

    <Button className="w-full mt-3" size="sm">
      Pesan Sekarang
    </Button>
  </motion.div>
);

// Komponen Kartu Destinasi yang Diperbarui
const DestinationCard = ({ destination, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-card border border-border/30 rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <h3 className="font-bold text-sm text-foreground mb-1">{destination.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {destination.type}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {destination.rating}
          </span>
        </div>
      </div>
    </div>

    <p className="text-muted-foreground mb-2 text-xs leading-relaxed">{destination.description}</p>

    <div className="space-y-2 mb-2">
      <div className="flex justify-between items-center text-xs">
        <span className="flex items-center gap-1 text-primary font-semibold">
          <DollarSign className="w-3 h-3" />
          Harga Tiket: {destination.price}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          {destination.duration}
        </span>
      </div>

      <div className="text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Waktu Terbaik: {destination.bestTime}
        </span>
      </div>
    </div>

    <div className="space-y-1 mb-2">
      <h4 className="font-semibold text-foreground text-xs">Fasilitas:</h4>
      <div className="flex flex-wrap gap-1">
        {destination.facilities.slice(0, 3).map((facility, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-secondary text-foreground text-xs rounded-full">
            {facility}
          </span>
        ))}
        {destination.facilities.length > 3 && (
          <span className="px-1.5 py-0.5 bg-secondary text-foreground text-xs rounded-full">
            +{destination.facilities.length - 3} more
          </span>
        )}
      </div>
    </div>

    <div className="flex flex-wrap gap-1">
      {destination.activities.slice(0, 2).map((activity, i) => (
        <span key={i} className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
          {activity}
        </span>
      ))}
    </div>
  </motion.div>
);

const QuickSuggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "Paket wisata budaya terbaik",
    "Wisata alam dengan harga terjangkau",
    "Tour kuliner lokal lengkap",
    "Paket keluarga hemat 1 hari",
    "Destinasi wisata populer"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center mt-3"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-2 py-1 bg-secondary/50 border border-border/30 rounded-full text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
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
      if (response.includes(dest.name) || response.toLowerCase().includes(dest.type.toLowerCase())) {
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

    // Parse aktivitas berdasarkan keyword dengan informasi lengkap
    if (response.includes("Batik") || response.includes("Giriloyo") || response.includes("kerajinan")) {
      activities.push({ 
        title: "Workshop Batik Giriloyo", 
        icon: Palette, 
        text: "Belajar membatik langsung dari pengrajin batik tulis tradisional dengan harga mulai Rp 50.000.",
        type: "budaya",
        price: "Rp 50.000 - Rp 150.000",
        duration: "2-3 jam"
      });
    }
    if (response.includes("Wayang") || response.includes("Pucung") || response.includes("seni")) {
      activities.push({ 
        title: "Sanggar Wayang Kulit", 
        icon: Users, 
        text: "Melihat proses pembuatan wayang kulit di sanggar tradisional dengan pertunjukan live.",
        type: "budaya",
        price: "Rp 75.000 - Rp 200.000",
        duration: "1-2 jam"
      });
    }
    if (response.includes("Watu Gagak") || response.includes("sunset") || response.includes("alam")) {
      activities.push({ 
        title: "Sunset di Watu Gagak", 
        icon: Mountain, 
        text: "Menikmati pemandangan matahari terbenam yang spektakuler dengan tiket masuk Rp 10.000-25.000.",
        type: "alam",
        price: "Rp 10.000 - Rp 25.000",
        duration: "1-3 jam"
      });
    }
    if (response.includes("kuliner") || response.includes("makan") || response.includes("Wedang") || response.includes("Thiwul")) {
      activities.push({ 
        title: "Wisata Kuliner Lokal", 
        icon: Utensils, 
        text: "Mencicipi kuliner khas Wukirsari seperti Wedang Uwuh (Rp 20.000) dan Thiwul (Rp 15.000).",
        type: "kuliner",
        price: "Rp 20.000 - Rp 100.000",
        duration: "1-2 jam"
      });
    }
    if (response.includes("Embung") || response.includes("rekreasi") || response.includes("keluarga")) {
      activities.push({ 
        title: "Embung Wukirsari", 
        icon: Home, 
        text: "Bersantai di waduk dengan pemandangan alam yang tenang, tiket masuk Rp 5.000-15.000.",
        type: "alam",
        price: "Rp 5.000 - Rp 15.000",
        duration: "1-2 jam"
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
    <div ref={responseRef} className="h-full overflow-y-auto pr-2">
      <motion.div 
        className="text-left space-y-4 pb-2"
        variants={aiResponseItems}
        initial="hidden"
        animate="visible"
      >
        {/* Intro Response */}
        <motion.div className="flex items-start gap-2" variants={aiResponseItem}>
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-0.5">
            <Bot className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">{parsedResponse.intro}</p>
          </div>
        </motion.div>

        {/* Paket Wisata yang Direkomendasikan */}
        {parsedResponse.packages.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-8">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              Paket Wisata Rekomendasi
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {parsedResponse.packages.slice(0, 3).map((pkg, index) => (
                <TourPackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Destinasi yang Direkomendasikan */}
        {parsedResponse.destinations.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-8">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              Destinasi Wisata
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {parsedResponse.destinations.slice(0, 3).map((dest, index) => (
                <DestinationCard key={dest.id} destination={dest} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Produk yang Direkomendasikan */}
        {parsedResponse.products.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-8">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Produk UMKM Unggulan
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {parsedResponse.products.slice(0, 3).map((product, index) => (
                <div key={index} className="bg-secondary/30 border border-border/20 rounded-lg p-2 transition-colors hover:bg-secondary/50">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-semibold text-foreground text-xs">{product.name}</h5>
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs">Baru</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Oleh {product.umkm}</p>
                  <p className="text-primary font-semibold text-xs">{product.price}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Aktivitas */}
        {parsedResponse.activities.length > 0 && (
          <motion.div variants={aiResponseItem} className="ml-8">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              Aktivitas & Pengalaman
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {parsedResponse.activities.slice(0, 3).map((activity, index) => (
                <div key={index} className="bg-secondary/50 border border-border/30 rounded-lg p-3 flex items-start gap-3 transition-colors hover:bg-secondary/70">
                  <activity.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-foreground text-sm mb-1">{activity.title}</h4>
                      <span className="text-xs font-semibold text-primary">{activity.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{activity.text}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Durasi: {activity.duration}</span>
                      <span className="capitalize">{activity.type}</span>
                    </div>
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
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef(null);

  const generateAIResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    
    // Response berdasarkan kategori input user
    if (lowerCaseInput.includes("paket") || lowerCaseInput.includes("tour") || lowerCaseInput.includes("package")) {
      if (lowerCaseInput.includes("budaya") || lowerCaseInput.includes("seni") || lowerCaseInput.includes("tradisi")) {
        return `Berdasarkan minat Anda pada wisata budaya, saya merekomendasikan Paket Wisata Budaya Lengkap dengan harga Rp 350.000. Paket ini menawarkan pengalaman mendalam seni tradisional Wukirsari termasuk workshop batik di Giriloyo (Rp 50.000-150.000), kunjungan sanggar wayang kulit Pucung (Rp 75.000-200.000), dan makan siang kuliner lokal.`;
      
      } else if (lowerCaseInput.includes("alam") || lowerCaseInput.includes("outdoor") || lowerCaseInput.includes("pemandangan")) {
        return `Untuk petualangan alam di Wukirsari, Paket Eksplorasi Alam Premium dengan harga Rp 250.000 sangat cocok. Anda akan menikmati sunset di Watu Gagak (tiket Rp 10.000-25.000), bersantai di Embung Wukirsari (tiket Rp 5.000-15.000), trekking ringan, dan coffee break di alam.`;
      
      } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan") || lowerCaseInput.includes("minum")) {
        return `Paket Wisata Kuliner Eksklusif dengan harga Rp 180.000 sempurna untuk menjelajahi kekayaan kuliner Wukirsari. Termasuk 8 sample makanan tradisional, goodie bag produk UMKM, demo memasak, dan minuman tradisional unlimited. Cicipi Wedang Uwuh (Rp 20.000) dan Thiwul (Rp 15.000) terbaik!`;
      
      } else if (lowerCaseInput.includes("premium") || lowerCaseInput.includes("lengkap") || lowerCaseInput.includes("2 hari")) {
        return `Paket Premium 2 Hari 1 Malam dengan harga Rp 850.000 menawarkan pengalaman komprehensif Wukirsari. Termasuk akomodasi homestay premium, semua aktivitas budaya & alam, makan lengkap 6x, workshop eksklusif, dan souvenir premium.`;
      
      } else if (lowerCaseInput.includes("keluarga") || lowerCaseInput.includes("hemat") || lowerCaseInput.includes("murah")) {
        return `Paket Keluarga Hemat dengan harga Rp 150.000 cocok untuk liburan keluarga yang terjangkau. Termasuk tiket masuk 3 lokasi wisata, pemandu wisata ramah keluarga, snack tradisional, dan dokumentasi foto keluarga.`;
      
      } else {
        return `Wukirsari menawarkan berbagai paket wisata dengan harga mulai dari Rp 150.000 hingga Rp 850.000. Paket mana yang paling sesuai dengan budget dan minat Anda? Saya bisa memberikan rekomendasi terbaik!`;
      }
    
    } else if (lowerCaseInput.includes("budaya") || lowerCaseInput.includes("tradisi") || lowerCaseInput.includes("seni")) {
      return `Untuk pengalaman budaya yang mendalam di Wukirsari, saya merekomendasikan:\n\n• Batik Giriloyo: Workshop batik tulis dengan harga Rp 50.000-150.000\n• Wayang Kulit Pucung: Sanggar tradisional dengan tiket Rp 75.000-200.000\n• Paket Wisata Budaya Lengkap: Rp 350.000 termasuk semua aktivitas budaya\n\nDestinasi budaya kami memiliki rating 4.7+ dari ratusan traveler!`;
    
    } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan") || lowerCaseInput.includes("minum")) {
      return `Wisata kuliner Wukirsari menawarkan pengalaman yang tak terlupakan:\n\n• Wedang Uwuh Bu Endang: Rp 20.000/10pcs\n• Thiwul Mbak Iswati: Rp 15.000/porsi\n• Paket Kuliner Eksklusif: Rp 180.000 termasuk 8 sample makanan\n• Kampung Kuliner: Berbagai makanan tradisional Rp 20.000-100.000\n\nSemua menggunakan bahan lokal dan resep turun-temurun!`;
    
    } else if (lowerCaseInput.includes("alam") || lowerCaseInput.includes("pemandangan") || lowerCaseInput.includes("outdoor")) {
      return `Untuk menikmati keindahan alam Wukirsari:\n\n• Watu Gagak: Sunset spot dengan tiket Rp 10.000-25.000\n• Embung Wukirsari: Waduk alam tiket Rp 5.000-15.000\n• Agrowisata Kebun Teh: Tea experience Rp 30.000-80.000\n• Paket Eksplorasi Alam: Rp 250.000 termasuk semua lokasi alam\n\nPemandangan terbaik dijamin memuaskan kamera Anda!`;
    
    } else if (lowerCaseInput.includes("harga") || lowerCaseInput.includes("murah") || lowerCaseInput.includes("budget")) {
      return `Berikut pilihan wisata Wukirsari berdasarkan budget:\n\n💰 Budget Rendah (Rp 5.000-50.000):\n- Embung Wukirsari: Rp 5.000-15.000\n- Watu Gagak: Rp 10.000-25.000\n- Kuliner street food: Rp 15.000-30.000\n\n💵 Budget Menengah (Rp 50.000-200.000):\n- Workshop Batik: Rp 50.000-150.000\n- Wayang Kulit: Rp 75.000-200.000\n- Paket Keluarga: Rp 150.000\n\n🌟 Budget Premium (Rp 200.000+):\n- Paket Kuliner: Rp 180.000\n- Paket Alam: Rp 250.000\n- Paket Budaya: Rp 350.000\n- Paket 2 Hari: Rp 850.000`;
    
    } else if (lowerCaseInput.includes("keluarga") || lowerCaseInput.includes("anak") || lowerCaseInput.includes("liburan")) {
      return `Rekomendasi wisata keluarga di Wukirsari:\n\n👨‍👩‍👧‍👦 Paket Keluarga Hemat: Rp 150.000/orang\n• Embung Wukirsari: Area piknik luas (Rp 5.000-15.000)\n• Kampung Kuliner: Makanan ramah anak (Rp 20.000-50.000)\n• Batik Giriloyo: Workshop keluarga (Rp 50.000-150.000)\n\nSemua destinasi memiliki fasilitas keluarga yang lengkap dan aman!`;
    
    } else {
      // Default response dengan informasi umum dan paket
      const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);
      return `Selamat datang di AI Travel Planner Wukirsari! 🎉\n\nKami memiliki ${destinations.length} destinasi wisata dan ${tourPackages.length} paket tour dengan harga mulai dari Rp 5.000 hingga Rp 850.000.\n\n💫 **Paket Populer:**\n• Wisata Budaya Lengkap: Rp 350.000\n• Eksplorasi Alam: Rp 250.000  \n• Wisata Kuliner: Rp 180.000\n• 2 Hari 1 Malam: Rp 850.000\n\n🏞️ **Destinasi Unggulan:**\n• Batik Giriloyo: Rp 50.000-150.000\n• Wayang Kulit: Rp 75.000-200.000\n• Watu Gagak: Rp 10.000-25.000\n• Embung Wukirsari: Rp 5.000-15.000\n\nAda yang bisa saya bantu untuk merencanakan perjalanan Anda?`;
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
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setAiInput(suggestion);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg cursor-pointer"
          onClick={toggleMinimize}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">AI Travel Planner</h3>
              <p className="text-xs text-muted-foreground">Wukirsari Tourism Assistant</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleMinimize}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setAiResponse('');
                setAiInput('');
                setIsMinimized(true);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={aiResponse ? 'response' : 'prompt'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {aiResponse ? (
              <AiResponseVisualizer response={aiResponse} />
            ) : (
              <motion.div 
                className="flex-grow flex flex-col items-center justify-center text-center space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hai! Saya AI Assistant Wukirsari. Saya bisa membantu Anda menemukan paket wisata terbaik, destinasi populer, dan informasi harga lengkap untuk perjalanan Anda.
                  </p>
                  
                  <QuickSuggestions onSuggestionClick={handleSuggestionClick} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 p-4 border-t border-border/20">
        <form onSubmit={handleAiSubmit} className="w-full">
          <div className="relative">
            <Input 
              type="text" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Tanya tentang paket wisata, harga, atau destinasi..."
              className="flex-grow h-10 pr-20 bg-background/70 border-border/40 focus:ring-primary/50 text-sm placeholder:text-muted-foreground/70"
              disabled={isAiLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 text-xs" 
              disabled={isAiLoading || !aiInput.trim()}
            >
              {isAiLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-3 h-3"
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AiPlannerSection;