import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const AgendaPage = () => {
  const { events } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Map dynamic events by formatted date string
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

  // Filtered upcoming events list
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

  return (
    <>
      <Helmet>
        <title>Agenda & Kalender Budaya - WukirTech</title>
        <meta
          name="description"
          content="Kalender acara dinamis, festival kebudayaan, upacara adat, dan jadwal kegiatan Desa Wisata Wukirsari."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/15 to-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Jadwal Kegiatan & Tradisi Lokal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Agenda Desa <span className="text-primary">Wukirsari</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Ikuti setiap momen dan perayaan budaya yang menjadikan desa kami istimewa.
              Semua agenda diperbarui secara dinamis oleh pengelola desa.
            </p>
          </motion.div>

          {/* Calendar and Day Details Grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Calendar */}
            <motion.div
              className="lg:col-span-2 bg-card/80 backdrop-blur-md border border-border/30 rounded-3xl shadow-xl p-6 md:p-8"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: id })}
                  </h2>
                  <span className="text-xs text-muted-foreground">Pilih tanggal untuk melihat jadwal acara</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-xl">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-xl">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
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
                        'py-1 flex justify-center'
                      )}
                    >
                      <button
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl text-sm transition-all duration-200',
                          !inCurrentMonth && 'text-muted-foreground/40',
                          isSelected && 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-105',
                          !isSelected && inCurrentMonth && 'hover:bg-secondary/70 text-foreground',
                          hasEvents && !isSelected && 'font-bold border border-primary/40 bg-primary/5'
                        )}
                      >
                        <time dateTime={dateStr}>{format(day, 'd')}</time>
                        {hasEvents && (
                          <div
                            className={cn(
                              'absolute bottom-1.5 h-1.5 w-1.5 rounded-full',
                              isSelected ? 'bg-black' : 'bg-primary'
                            )}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Selected Day Event List */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-card/80 backdrop-blur-md border border-border/30 rounded-3xl shadow-xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="pb-4 mb-4 border-b border-border/20">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                      Jadwal Kegiatan
                    </span>
                    <h3 className="font-bold text-lg text-foreground mt-0.5">
                      {format(selectedDay, 'EEEE, d MMMM yyyy', { locale: id })}
                    </h3>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedDay.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {selectedDayEvents.length > 0 ? (
                        <div className="space-y-4">
                          {selectedDayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="bg-secondary/40 border border-border/30 p-4 rounded-2xl space-y-2 hover:border-primary/40 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary">
                                  {event.category || 'Budaya'}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  {event.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                              <div className="pt-2 border-t border-border/20 space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-primary" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                          <p className="text-xs">Tidak ada kegiatan di tanggal ini.</p>
                          <p className="text-[11px] text-muted-foreground/70 mt-1">
                            Pilih tanggal yang memiliki tanda titik untuk melihat acara.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* <div className="pt-6 mt-6 border-t border-border/20 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total: {events.length} Agenda</span>
                  <Link
                    to="/admin"
                    className="text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    + Kelola Agenda di Admin
                  </Link>
                </div> */}
              </div>
            </motion.div>
          </div>

          {/* Full List of Village Events */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Daftar Lengkap Agenda Desa</h3>
                <p className="text-xs text-muted-foreground">Semua perayaan dan festival yang akan berlangsung</p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {eventCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-card/80 border border-border/30 rounded-2xl p-5 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {evt.category || 'Budaya'}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {evt.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground mb-2">{evt.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/20 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgendaPage;