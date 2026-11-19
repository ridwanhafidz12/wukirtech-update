import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Calendar,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

const WUKIRSARI_CENTER = [-7.9105, 110.4155];

const createMiniPinIcon = (isActive) =>
  new L.divIcon({
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:${isActive ? 36 : 28}px;height:${isActive ? 36 : 28}px;cursor:pointer;">
        <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background-color:#d97706;opacity:${isActive ? '0.4' : '0.2'};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="position:relative;width:${isActive ? 28 : 22}px;height:${isActive ? 28 : 22}px;border-radius:9999px;background-color:${isActive ? '#d97706' : '#7c3aed'};border:2px solid white;box-shadow:0 6px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [isActive ? 36 : 28, isActive ? 36 : 28],
    iconAnchor: [isActive ? 18 : 14, isActive ? 18 : 14],
    popupAnchor: [0, -16],
  });

const FlyToVenue = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 15, { duration: 1.0 });
    }
  }, [coords, map]);
  return null;
};

const AgendaBudayaSection = () => {
  const { events } = useData();
  const featuredEvents = events.slice(0, 4);
  const [selectedEvent, setSelectedEvent] = useState(featuredEvents[0] || null);

  if (!featuredEvents.length) return null;

  const current = selectedEvent || featuredEvents[0];

  return (
    <section id="agenda-budaya" className="py-12 md:py-20 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Kalender &amp; Lokasi Acara</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Agenda Budaya <span className="text-primary">&amp; Peta Acara</span>
            </h2>
          </div>

          <Link to="/agenda">
            <Button variant="outline" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-bold text-xs md:text-sm">
              Lihat Semua {events.length} Agenda &amp; Kalender <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Event Cards List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {featuredEvents.map((evt) => {
              const isSelected = current?.id === evt.id;
              return (
                <motion.button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  whileHover={{ x: 3 }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-card border-primary shadow-xl ring-1 ring-primary/30'
                      : 'bg-card/70 hover:bg-card border-border/40'
                  }`}
                >
                  <img
                    src={evt.image || '/batik.jpg'}
                    alt={evt.title}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0 border border-border/30"
                    onError={(e) => {
                      e.target.src = '/batik.jpg';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        {evt.dateDisplay || evt.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Selected Event Details + Live Location Map (7 cols) */}
          <div className="lg:col-span-7 bg-card/85 border border-border/40 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Event Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                    {current.status || 'Agenda Budaya'}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {current.category}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-extrabold text-foreground leading-snug">
                  {current.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {current.description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-border/20 text-xs">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">
                        {current.dateDisplay || current.date}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-primary" /> {current.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">{current.location}</span>
                      {current.venueDetail && (
                        <span className="text-muted-foreground text-[11px] block mt-0.5 line-clamp-2">
                          {current.venueDetail}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Leaflet Venue Map */}
              <div className="flex flex-col gap-3 h-full">
                <div className="relative h-[220px] sm:h-[250px] w-full rounded-2xl overflow-hidden border border-border/30 shadow-inner">
                  <MapContainer
                    center={current.coordinates || WUKIRSARI_CENTER}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                      attribution="&copy; Esri &mdash; Wukirsari"
                    />
                    <FlyToVenue coords={current.coordinates || WUKIRSARI_CENTER} />
                    {featuredEvents.map((evt) => (
                      <Marker
                        key={evt.id}
                        position={evt.coordinates || WUKIRSARI_CENTER}
                        icon={createMiniPinIcon(evt.id === current.id)}
                        eventHandlers={{
                          click: () => setSelectedEvent(evt),
                        }}
                      >
                        <Popup>
                          <div className="text-xs font-bold">{evt.title}</div>
                          <div className="text-[11px] text-muted-foreground">{evt.location}</div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={
                      current.googleMapsUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${(current.coordinates || WUKIRSARI_CENTER).join(',')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full rounded-xl text-xs font-bold">
                      <Navigation className="w-3.5 h-3.5 mr-1.5" /> Buka Google Maps
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                  <Link to="/agenda">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs border-border/40">
                      Detail di Halaman Agenda
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaBudayaSection;
