import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  Layers,
  RotateCcw,
  CheckCircle2,
  Info,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  getDay,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const WUKIRSARI_CENTER = [-7.9105, 110.4155];

const TILE_PROVIDERS = [
  {
    id: 'esri-street',
    name: 'Peta Jalan (Esri)',
    badge: 'Jalan',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, USGS, TomTom',
    maxZoom: 19,
  },
  {
    id: 'osm-standard',
    name: 'OpenStreetMap',
    badge: 'OSM',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  {
    id: 'esri-satellite',
    name: 'Satelit Citra HD',
    badge: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    maxZoom: 19,
  },
];

const createEventMarkerIcon = (category, isActive) => {
  let color = '#d97706';
  if (category === 'Adat') color = '#7c3aed';
  if (category === 'Budaya') color = '#d97706';
  if (category === 'Wisata Alam') color = '#059669';
  if (category === 'Seni Pertunjukan') color = '#e11d48';

  const size = isActive ? 38 : 30;
  const innerSize = isActive ? 28 : 22;

  return new L.divIcon({
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;cursor:pointer;">
        <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background-color:${color};opacity:${isActive ? '0.4' : '0.2'};"></span>
        <div style="position:relative;width:${innerSize}px;height:${innerSize}px;border-radius:9999px;background-color:${color};border:2px solid white;box-shadow:0 6px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

const EventMapController = ({ targetEvent, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (targetEvent?.coordinates) {
      map.flyTo(targetEvent.coordinates, 16, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [targetEvent, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(WUKIRSARI_CENTER, 13, {
        duration: 0.9,
      });
    }
  }, [resetTrigger, map]);

  return null;
};

const AgendaPage = () => {
  const { events } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeEventOnMap, setActiveEventOnMap] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [activeProviderIndex, setActiveProviderIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  const mapSectionRef = useRef(null);
  const activeProvider = TILE_PROVIDERS[activeProviderIndex];

  useEffect(() => {
    if (!activeEventOnMap && events.length > 0) {
      setActiveEventOnMap(events[0]);
    }
  }, [events, activeEventOnMap]);

  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((evt) => {
      if (evt.date) {
        if (!map[evt.date]) map[evt.date] = [];
        map[evt.date].push(evt);
      }
    });
    return map;
  }, [events]);

  const selectedDateKey = format(selectedDay, 'yyyy-MM-dd');
  const selectedDayEvents = eventsByDate[selectedDateKey] || [];

  const upcomingEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedCategory === 'Semua') return true;
      return e.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [events, selectedCategory]);

  const eventCategories = useMemo(() => {
    const set = new Set();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ['Semua', ...Array.from(set)];
  }, [events]);

  const handleFocusOnMap = (evt) => {
    setActiveEventOnMap(evt);
    if (evt.date) {
      const parsedDate = new Date(`${evt.date}T00:00:00`);
      if (!Number.isNaN(parsedDate.getTime())) {
        setCurrentMonth(parsedDate);
        setSelectedDay(parsedDate);
      }
    }
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Agenda Budaya Wukirsari - WukirTech</title>
        <meta
          name="description"
          content="Jadwal tradisi adat, kirab budaya, dan kegiatan wisata beserta titik lokasi pelaksanaannya di Desa Wisata Wukirsari."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/15 to-background pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Header Halaman Ringkas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Kalender &amp; Lokasi Acara</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              Agenda Budaya <span className="text-primary">Wukirsari</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Jadwal tradisi adat, kirab budaya, dan kegiatan wisata beserta titik lokasi pelaksanaannya.
            </p>
          </motion.div>

          {/* 1. Bagian Peta Lokasi & Sorotan Acara */}
          <div ref={mapSectionRef} className="mb-12">
            <div className="bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
              {/* Top Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-foreground">
                    Peta Lokasi Pelaksanaan
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Pilih acara untuk melihat koordinat titik pelaksanaan di peta
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/30">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground ml-1.5 mr-0.5" />
                    {TILE_PROVIDERS.map((provider, idx) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setActiveProviderIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          activeProviderIndex === idx
                            ? 'bg-card text-primary shadow-sm font-bold'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {provider.badge}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResetCount((c) => c + 1)}
                    className="h-8 px-2.5 rounded-xl text-xs border-border/40 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Peta Leaflet + Bar Info Aktif (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                  <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full rounded-2xl overflow-hidden border border-border/30 shadow-inner">
                    <MapContainer
                      center={WUKIRSARI_CENTER}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        key={activeProvider.id}
                        url={activeProvider.url}
                        attribution={activeProvider.attribution}
                        maxZoom={activeProvider.maxZoom}
                      />

                      <EventMapController
                        targetEvent={activeEventOnMap}
                        resetTrigger={resetCount}
                      />

                      {events.map((evt) => (
                        <Marker
                          key={evt.id}
                          position={evt.coordinates || WUKIRSARI_CENTER}
                          icon={createEventMarkerIcon(evt.category, activeEventOnMap?.id === evt.id)}
                          eventHandlers={{
                            click: () => setActiveEventOnMap(evt),
                          }}
                        >
                          <Popup className="custom-leaflet-popup">
                            <div className="p-1 max-w-[210px]">
                              <h4 className="font-bold text-xs text-foreground mb-1 leading-snug">{evt.title}</h4>
                              <p className="text-[11px] text-primary font-semibold mb-1">
                                {evt.dateDisplay || evt.date} • {evt.time}
                              </p>
                              <p className="text-[11px] text-muted-foreground mb-2">
                                {evt.location}
                              </p>
                              <a
                                href={
                                  evt.googleMapsUrl ||
                                  `https://www.google.com/maps/search/?api=1&query=${(evt.coordinates || WUKIRSARI_CENTER).join(',')}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                              >
                                <Navigation className="w-3 h-3" /> Rute Google Maps
                              </a>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Bar Lokasi Aktif Ringkas */}
                  {activeEventOnMap && (
                    <div className="bg-secondary/40 border border-border/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                            {activeEventOnMap.category}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <CalendarIcon className="w-3 h-3 text-primary" />
                            {activeEventOnMap.dateDisplay || activeEventOnMap.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-primary" />
                            {activeEventOnMap.time}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-foreground truncate">
                          {activeEventOnMap.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{activeEventOnMap.location}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDetailEvent(activeEventOnMap)}
                          className="h-8 rounded-xl text-xs border-border/40"
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1" /> Detail
                        </Button>
                        <a
                          href={
                            activeEventOnMap.googleMapsUrl ||
                            `https://www.google.com/maps/search/?api=1&query=${(activeEventOnMap.coordinates || WUKIRSARI_CENTER).join(',')}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="h-8 rounded-xl text-xs font-semibold">
                            <Navigation className="w-3.5 h-3.5 mr-1" /> Rute Google Maps
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Daftar Pilih Cepat Lokasi Acara (4 cols) */}
                <div className="lg:col-span-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[340px] lg:max-h-[420px] overflow-y-auto pr-1">
                    {events.map((evt) => {
                      const isSelected = activeEventOnMap?.id === evt.id;
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => setActiveEventOnMap(evt)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-primary/10 border-primary shadow-sm'
                              : 'bg-background/60 hover:bg-secondary/60 border-border/30'
                          }`}
                        >
                          <img
                            src={evt.image || '/batik.jpg'}
                            alt={evt.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border/30"
                            onError={(e) => {
                              e.target.src = '/batik.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold text-primary block">
                              {evt.dateDisplay || evt.date}
                            </span>
                            <h4 className="text-xs font-bold text-foreground line-clamp-1">
                              {evt.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 line-clamp-1">
                              <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="truncate">{evt.location}</span>
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bagian Kalender & Daftar Agenda */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kalender Bulanan + Panel Tanggal Terpilih (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-card/80 backdrop-blur-md border border-border/30 rounded-2xl md:rounded-3xl shadow-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground capitalize">
                      {format(currentMonth, 'MMMM yyyy', { locale: id })}
                    </h2>
                    <span className="text-[11px] text-muted-foreground">
                      Tanggal bertanda titik memiliki jadwal acara
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-xl">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-xl">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground uppercase mb-2">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="py-1.5">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, dayIdx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const hasEvents = Boolean(eventsByDate[dateStr]?.length);
                    const isSelected = isSameDay(day, selectedDay);
                    const inCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                      <div
                        key={day.toString()}
                        className={cn(
                          dayIdx === 0 && colStartClasses[getDay(day)],
                          'py-0.5 flex justify-center'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={cn(
                            'relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-xs sm:text-sm transition-all',
                            !inCurrentMonth && 'text-muted-foreground/40',
                            isSelected && 'bg-primary text-primary-foreground font-bold shadow-sm',
                            !isSelected && inCurrentMonth && 'hover:bg-secondary/70 text-foreground',
                            hasEvents && !isSelected && 'font-bold border border-primary/40 bg-primary/5'
                          )}
                        >
                          <time dateTime={dateStr}>{format(day, 'd')}</time>
                          {hasEvents && (
                            <span
                              className={cn(
                                'absolute bottom-1 h-1.5 w-1.5 rounded-full',
                                isSelected ? 'bg-primary-foreground' : 'bg-primary'
                              )}
                            />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel Acara pada Tanggal Terpilih */}
              <div className="bg-card/80 backdrop-blur-md border border-border/30 rounded-2xl md:rounded-3xl shadow-lg p-5">
                <div className="pb-3 mb-3 border-b border-border/20">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Jadwal Tanggal Terpilih
                  </span>
                  <h3 className="font-bold text-base text-foreground mt-0.5">
                    {format(selectedDay, 'EEEE, d MMMM yyyy', { locale: id })}
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay.toString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedDayEvents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-secondary/40 border border-border/30 p-3.5 rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/15 text-primary">
                                {event.category || 'Budaya'}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {event.time}
                              </span>
                            </div>
                            <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="pt-1 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleFocusOnMap(event)}
                                className="h-8 text-xs rounded-xl flex-1"
                              >
                                <MapPin className="w-3.5 h-3.5 mr-1" /> Lihat Peta
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDetailEvent(event)}
                                className="h-8 text-xs rounded-xl border-border/40"
                              >
                                Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <CalendarIcon className="mx-auto h-9 w-9 text-muted-foreground/30 mb-2" />
                        <p className="text-xs">Belum ada agenda pada tanggal ini.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Daftar Agenda dengan Filter Kategori (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-3 mb-5">
                <h2 className="text-xl font-bold text-foreground">Daftar Agenda Desa</h2>

                {/* Filter Kategori scrollable di mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {eventCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card/70 hover:bg-secondary text-muted-foreground border-border/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-card/80 border border-border/30 rounded-2xl overflow-hidden hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40">
                        <img
                          src={evt.image || '/batik.jpg'}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/batik.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                          {evt.category || 'Budaya'}
                        </span>
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[11px] font-semibold flex items-center gap-1 text-amber-300">
                            <CalendarIcon className="w-3 h-3" />
                            {evt.dateDisplay || evt.date}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pb-2">
                        <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-1.5">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {evt.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2">
                      <div className="pt-2.5 border-t border-border/20 space-y-1 text-[11px] text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{evt.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleFocusOnMap(evt)}
                          className="flex-1 h-8 text-xs rounded-xl font-semibold"
                        >
                          <MapPin className="w-3.5 h-3.5 mr-1" /> Lihat Peta
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDetailEvent(evt)}
                          className="h-8 text-xs rounded-xl border-border/40"
                        >
                          Detail
                        </Button>
                        <a
                          href={
                            evt.googleMapsUrl ||
                            `https://www.google.com/maps/search/?api=1&query=${(evt.coordinates || WUKIRSARI_CENTER).join(',')}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Google Maps"
                        >
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-xl">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Acara */}
      <Dialog open={Boolean(detailEvent)} onOpenChange={(open) => !open && setDetailEvent(null)}>
        <DialogContent className="w-[94vw] max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border/40 bg-card">
          {detailEvent && (
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/40">
                <img
                  src={detailEvent.image || '/batik.jpg'}
                  alt={detailEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/batik.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold mb-1.5">
                    {detailEvent.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold leading-snug">
                    {detailEvent.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-secondary/40 border border-border/30 rounded-xl p-3.5 text-xs">
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">
                        {detailEvent.dateDisplay || detailEvent.date}
                      </strong>
                      <span className="text-muted-foreground">{detailEvent.time}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">{detailEvent.location}</strong>
                      {detailEvent.venueDetail && (
                        <span className="text-muted-foreground text-[11px] block">
                          {detailEvent.venueDetail}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {detailEvent.fullDescription || detailEvent.description}
                </p>

                {Array.isArray(detailEvent.highlights) && detailEvent.highlights.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-1.5">
                    <h4 className="text-xs font-bold text-primary">Rangkaian Acara</h4>
                    <ul className="space-y-1.5">
                      {detailEvent.highlights.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailEvent.tips && (
                  <div className="flex items-start gap-2 bg-secondary/40 border border-border/30 rounded-xl p-3 text-xs text-muted-foreground">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{detailEvent.tips}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-border/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const target = detailEvent;
                      setDetailEvent(null);
                      handleFocusOnMap(target);
                    }}
                    className="rounded-xl text-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1" /> Lihat di Peta
                  </Button>
                  <a
                    href={
                      detailEvent.googleMapsUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${(detailEvent.coordinates || WUKIRSARI_CENTER).join(',')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="rounded-xl text-xs font-semibold">
                      <Navigation className="w-3.5 h-3.5 mr-1" /> Rute Google Maps
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgendaPage;
