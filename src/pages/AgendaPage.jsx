import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, addMonths, subMonths, isSameMonth, isSameDay, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const villageEvents = {
  // Hardcoded events for the current year
  // Format: 'YYYY-MM-DD'
  [format(new Date(), 'yyyy-07-20')]: [{ title: 'Festival Layang-layang', location: 'Lapangan Wukirsari', time: '14:00 - Selesai', description: 'Kompetisi layang-layang hias tradisional dan modern untuk semua umur.' }],
  [format(new Date(), 'yyyy-08-17')]: [{ title: 'Ulang Tahun Desa', location: 'Balai Desa Wukirsari', time: '09:00 - Selesai', description: 'Perayaan hari jadi Desa Wukirsari dengan berbagai pertunjukan seni dan budaya.' }],
  [format(new Date(), 'yyyy-10-05')]: [{ title: 'Merti Desa', location: 'Lapangan Desa', time: '13:00 - 17:00', description: 'Upacara adat sebagai wujud syukur atas hasil bumi, dimeriahkan dengan kirab budaya.' }],
  [format(new Date(), 'yyyy-12-22')]: [{ title: 'Sedekah Alam', location: 'Watu Gagak', time: '07:00 - 10:00', description: 'Ritual tahunan sebagai bentuk terima kasih kepada alam semesta.' }],
  [format(new Date(), 'yyyy-12-31')]: [{ title: 'Pentas Seni Akhir Tahun', location: 'Panggung Terbuka Embung', time: '19:00 - Selesai', description: 'Pertunjukan musik, tari, dan teater oleh para pemuda desa untuk menyambut tahun baru.' }],
};

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectedDayEvents = villageEvents[format(selectedDay, 'yyyy-MM-dd')] || [];

  return (
    <>
      <Helmet>
        <title>Agenda Desa - WukirTech</title>
        <meta name="description" content="Kalender acara dan kegiatan di Desa Wisata Wukirsari. Jangan lewatkan perayaan budaya, upacara adat, dan festival lokal." />
      </Helmet>
      <div className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Agenda Desa Wukirsari</h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Ikuti setiap momen dan perayaan budaya yang menjadikan desa kami istimewa.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div 
            className="lg:col-span-2 bg-card/70 backdrop-blur-sm border border-border/20 rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: id })}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Bulan sebelumnya">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Bulan berikutnya">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground mb-4">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'py-1'
                  )}
                >
                  <button
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      'mx-auto flex h-12 w-12 items-center justify-center rounded-full text-base transition-colors duration-200',
                      !isSameMonth(day, currentMonth) && 'text-muted-foreground/50',
                      isSameDay(day, selectedDay) && 'bg-primary text-primary-foreground font-bold',
                      !isSameDay(day, selectedDay) && 'hover:bg-accent',
                      villageEvents[format(day, 'yyyy-MM-dd')] && 'font-bold relative'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                    {villageEvents[format(day, 'yyyy-MM-dd')] && (
                      <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-card/70 backdrop-blur-sm border border-border/20 rounded-2xl shadow-lg p-6 h-full">
              <h3 className="font-bold text-lg mb-4 text-foreground">
                Acara pada <span className="text-primary">{format(selectedDay, 'd MMMM yyyy', { locale: id })}</span>
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedDayEvents.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedDayEvents.map((event, index) => (
                        <li key={index} className="bg-secondary/50 p-4 rounded-lg">
                          <p className="font-bold text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary/80"/>{event.location}</p>
                            <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary/80"/>{event.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-10">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">Tidak ada acara terjadwal.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AgendaPage;