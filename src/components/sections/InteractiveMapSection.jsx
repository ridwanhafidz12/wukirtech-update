import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Navigation,
  ExternalLink,
  Compass,
  Clock,
  Sparkles,
  Info,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Provider tile peta yang 100% stabil, aktif, dan tanpa memerlukan API key kadaluarsa
const TILE_PROVIDERS = [
  {
    id: 'esri-street',
    name: 'Peta Jalan (Esri)',
    badge: 'Jalan',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, USGS, TomTom &mdash; Desa Wukirsari',
    maxZoom: 19,
  },
  {
    id: 'osm-standard',
    name: 'OpenStreetMap',
    badge: 'OSM',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'esri-satellite',
    name: 'Satelit Citra HD',
    badge: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; GeoEye, Earthstar Geographics',
    maxZoom: 19,
  },
];

// Generator ikon marker modern berbasis SVG berwarna dinamis sesuai kategori destinasi
const createMarkerIcon = (category) => {
  let color = '#d97706'; // default amber (kerajinan)
  if (category === 'Alam') color = '#059669'; // emerald
  if (category === 'Kuliner') color = '#e11d48'; // rose
  if (category === 'Sejarah') color = '#7c3aed'; // purple

  return new L.divIcon({
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;cursor:pointer;">
        <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background-color:${color};opacity:0.35;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="position:relative;width:28px;height:28px;border-radius:9999px;background-color:${color};border:2.5px solid white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const WUKIRSARI_CENTER = [-7.9055, 110.4265];

const DESTINATIONS = [
  {
    id: 'giriloyo',
    pos: [-7.9155, 110.4280],
    name: 'Kampung Batik Giriloyo',
    category: 'Kerajinan',
    desc: 'Sentra batik tulis tradisional legendaris di kaki perbukitan Imogiri dengan ratusan pembatik perempuan yang melestarikan motif klasik Mataram.',
    operatingHours: '08:00 - 17:00 WIB',
    image: '/batik.jpg',
    gmapsQuery: 'Kampung Batik Giriloyo Wukirsari',
  },
  {
    id: 'pucung',
    pos: [-7.8990, 110.4201],
    name: 'Sentra Wayang Kulit Pucung',
    category: 'Kerajinan',
    desc: 'Pusat seni kriya tatah sungging wayang kulit pilihan kerbau halus karya para empu pengrajin Desa Wukirsari.',
    operatingHours: '09:00 - 16:30 WIB',
    image: '/wayang.jpeg',
    gmapsQuery: 'Sentra Wayang Kulit Pucung Wukirsari Imogiri',
  },
  {
    id: 'watu-gagak',
    pos: [-7.9080, 110.4355],
    name: 'Wisata Alam Watu Gagak',
    category: 'Alam',
    desc: 'Puncak perbukitan eksotis berhawa sejuk dengan pemandangan lanskap lembah Yogyakarta dan matahari terbenam yang memukau.',
    operatingHours: '06:00 - 18:00 WIB',
    image: '/sawah.jpg',
    gmapsQuery: 'Wisata Watu Gagak Wukirsari',
  },
  {
    id: 'embung',
    pos: [-7.8951, 110.4299],
    name: 'Embung Wukirsari',
    category: 'Alam',
    desc: 'Telaga buatan asri di kelilingi lanskap persawahan hijau, menjadi ruang terbuka publik yang tenang dan menyejukkan.',
    operatingHours: 'Buka Setiap Hari (24 Jam)',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    gmapsQuery: 'Embung Wukirsari Imogiri Bantul',
  },
  {
    id: 'makam-imogiri',
    pos: [-7.9198, 110.4308],
    name: 'Kompleks Makam Raja-Raja Imogiri',
    category: 'Sejarah',
    desc: 'Situs cagar budaya bersejarah Pajimatan Imogiri tempat peristirahatan para raja Mataram Islam dengan tangga seribu yang megah.',
    operatingHours: 'Ziarah: Senin, Jumat, & Minggu',
    image: '/batik-1.jpg',
    gmapsQuery: 'Makam Raja Imogiri Pajimatan',
  },
  {
    id: 'wedang-uwuh',
    pos: [-7.9120, 110.4250],
    name: 'Sentra Kuliner Wedang Uwuh & Rempah',
    category: 'Kuliner',
    desc: 'Pusat pengolahan minuman hangat alami khas Imogiri dan kuliner tempo dulu seperti olahan thiwul dan jajanan pasar.',
    operatingHours: '07:30 - 20:00 WIB',
    image: '/uwuh.jpg',
    gmapsQuery: 'Wedang Uwuh Wukirsari Imogiri',
  },
  {
    id: 'kipas-bambu',
    pos: [-7.9040, 110.4215],
    name: 'Sentra Kipas Bambu Karangtalun',
    category: 'Kerajinan',
    desc: 'Kerajinan ramah lingkungan perpaduan bilah bambu halus dan kain perca batik hasil karya tangan terampil warga desa.',
    operatingHours: '08:00 - 16:00 WIB',
    image: '/kipas.jpg',
    gmapsQuery: 'Sentra Kerajinan Kipas Bambu Wukirsari',
  },
];

// Komponen pengendali peta Leaflet untuk navigasi halus ke lokasi yang dipilih
function MapController({ targetLocation, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    if (targetLocation) {
      map.flyTo(targetLocation.pos, 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [targetLocation, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(WUKIRSARI_CENTER, 14, {
        duration: 1,
      });
    }
  }, [resetTrigger, map]);

  return null;
}

const InteractiveMapSection = () => {
  const [activeProviderIndex, setActiveProviderIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeLocation, setActiveLocation] = useState(null);
  const [resetCount, setResetCount] = useState(0);

  const activeProvider = TILE_PROVIDERS[activeProviderIndex];

  // Filter destinasi berdasarkan kategori
  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (selectedCategory === 'Semua') return true;
    return d.category === selectedCategory;
  });

  const categories = ['Semua', 'Kerajinan', 'Alam', 'Kuliner', 'Sejarah'];

  const handleOpenGoogleMaps = (loc) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.pos[0]},${loc.pos[1]}&destination_place_id=${encodeURIComponent(
      loc.gmapsQuery
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="destinasi" className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-3 backdrop-blur-md">
            <Compass className="w-4 h-4" />
            <span>Peta Digital Resmi Wisata Wukirsari</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Jelajahi Peta Interaktif <span className="text-primary">Desa Wukirsari</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Temukan titik sentra kerajinan batik tulis, wayang kulit, bukit pemandangan alam, dan kuliner tradisional
            otentik secara langsung dengan navigasi presisi.
          </p>
        </div>

        {/* Map Container & Control Card */}
        <div className="bg-card/80 border border-border/40 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl">
          {/* Top Toolbar: Category Chips & Layer Selector */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/20">
            {/* Category Filter Chips */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveLocation(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background/60 hover:bg-secondary text-muted-foreground border-border/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tile Layer Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/30">
                <Layers className="w-3.5 h-3.5 text-muted-foreground ml-1.5 mr-0.5" />
                {TILE_PROVIDERS.map((provider, idx) => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProviderIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeProviderIndex === idx
                        ? 'bg-card text-primary shadow-sm font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={provider.name}
                  >
                    {provider.badge}
                  </button>
                ))}
              </div>

              {/* Recenter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveLocation(null);
                  setResetCount((c) => c + 1);
                }}
                className="h-8 px-2.5 rounded-xl text-xs border-border/40 text-muted-foreground hover:text-foreground"
                title="Pusatkan Kembali Peta ke Desa Wukirsari"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* Leaflet Map Frame */}
          <div className="relative h-[55vh] md:h-[65vh] w-full rounded-2xl overflow-hidden border border-border/30 shadow-inner">
            <MapContainer
              center={WUKIRSARI_CENTER}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                key={activeProvider.id}
                url={activeProvider.url}
                attribution={activeProvider.attribution}
                maxZoom={activeProvider.maxZoom}
              />

              <MapController
                targetLocation={activeLocation}
                resetTrigger={resetCount}
              />

              {filteredDestinations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc.pos}
                  icon={createMarkerIcon(loc.category)}
                  eventHandlers={{
                    click: () => setActiveLocation(loc),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 max-w-[240px]">
                      {loc.image && (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-secondary/40">
                          <img
                            src={loc.image}
                            alt={loc.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/batik.jpg';
                            }}
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                            {loc.category}
                          </span>
                        </div>
                      )}
                      <h4 className="font-bold text-sm text-foreground mb-1 leading-snug">{loc.name}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                        {loc.desc}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2.5">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{loc.operatingHours}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenGoogleMaps(loc)}
                        className="w-full py-1.5 px-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm hover:opacity-95 transition-opacity"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Buka Rute Google Maps
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Info Overlay on Bottom Left */}
            <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-2 bg-background/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/40 text-[11px] text-muted-foreground shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Layer Aktif: <strong className="text-foreground">{activeProvider.name}</strong></span>
              <span className="text-muted-foreground/60">•</span>
              <span>{filteredDestinations.length} Destinasi Ditampilkan</span>
            </div>
          </div>

          {/* Bottom Destination Cards Bar */}
          <div className="mt-4 pt-4 border-t border-border/20">
            <span className="text-xs font-bold text-foreground block mb-2.5">
              Pilih Destinasi untuk Menyorot di Peta:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredDestinations.map((loc) => {
                const isSelected = activeLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-md ring-1 ring-primary/40'
                        : 'bg-background/60 hover:bg-secondary/70 border-border/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                          {loc.category}
                        </span>
                        {isSelected && <Sparkles className="w-3 h-3 text-primary animate-pulse" />}
                      </div>
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">{loc.name}</h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-2 block hover:underline text-primary flex items-center gap-1">
                      Lihat Titik Peta →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;