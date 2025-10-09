import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MotionCard from '@/components/MotionCard';

const customMarkerIcon = new L.divIcon({
  html: `<div class="map-marker"><div class="map-marker-pulse"></div><div class="map-marker-dot"></div></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const AnimatedPopupContent = ({ loc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-1"
    >
      <div className="font-bold text-base text-foreground">{loc.name}</div>
      <div className="text-xs text-primary font-semibold mb-1">{loc.type}</div>
      <div className="text-sm text-muted-foreground">{loc.desc}</div>
    </motion.div>
  );
};

const InteractiveMap = () => {
  const position = [-7.9015, 110.4244]; // Center of Wukirsari
  const locations = [
      { pos: [-7.9155, 110.4280], name: "Batik Tulis Giriloyo", type: "Kerajinan", desc: "Pusat batik tulis legendaris." },
      { pos: [-7.8990, 110.4201], name: "Wayang Kulit Pucung", type: "Kerajinan", desc: "Lihat pembuatan wayang kulit." },
      { pos: [-7.9080, 110.4355], name: "Wisata Watu Gagak", type: "Alam", desc: "Nikmati pemandangan matahari terbenam." },
      { pos: [-7.8951, 110.4299], name: "Embung Wukirsari", type: "Alam", desc: "Danau buatan yang asri untuk bersantai." }
  ];
  return (
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {locations.map(loc => (
              <Marker key={loc.name} position={loc.pos} icon={customMarkerIcon}>
                  <Popup>
                     <AnimatedPopupContent loc={loc} />
                  </Popup>
              </Marker>
          ))}
      </MapContainer>
  );
}

const InteractiveMapSection = () => {
  return (
    <section id="destinasi" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Jelajahi Peta Interaktif Wukirsari</h2>
          <p className="text-lg text-muted-foreground">Rencanakan perjalanan Anda dengan mudah. Temukan lokasi destinasi unggulan dan pusat kerajinan lokal secara langsung di peta.</p>
        </div>
        <MotionCard className="h-[60vh] p-4">
          <InteractiveMap />
        </MotionCard>
      </div>
    </section>
  );
};

export default InteractiveMapSection;