import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  X,
  Flame,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';
import { defaultNews } from '@/data/defaultData';

const NewsHeadlineSection = () => {
  const { news } = useData();
  const articles = Array.isArray(news) && news.length > 0 ? news : defaultNews;
  const [activeIndex, setActiveIndex] = useState(0);
  const [readingArticle, setReadingArticle] = useState(null);

  const featuredArticle = articles[activeIndex] || articles[0];

  return (
    <section id="berita" className="py-12 md:py-20 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2.5">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Warta Budaya Wukirsari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Headline Berita <span className="text-primary">&amp; Tradisi</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Dua perayaan adat utama di Kalurahan Wukirsari yang diwariskan lintas generasi.
          </p>
        </div>

        {/* Main Featured Headline & Side Switcher Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Big Featured Story (7 cols) */}
          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredArticle.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-card/85 border border-border/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between w-full group"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-secondary/40">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/batik.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-extrabold tracking-wide shadow-md">
                        {featuredArticle.tag}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/60 text-white border border-white/15 text-[11px] font-semibold backdrop-blur-md">
                        {featuredArticle.category}
                      </span>
                    </div>

                    {/* Bottom Meta on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/85 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {featuredArticle.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {featuredArticle.location}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold leading-snug">
                        {featuredArticle.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 md:p-7">
                    <p className="text-xs md:text-sm font-semibold text-primary mb-2.5">
                      {featuredArticle.subtitle}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {featuredArticle.summary}
                    </p>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 md:px-8 pb-6 pt-3 border-t border-border/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{featuredArticle.readTime}</span>
                    <span>•</span>
                    <span>Oleh <strong className="text-foreground">{featuredArticle.author}</strong></span>
                  </div>

                  <Button
                    onClick={() => setReadingArticle(featuredArticle)}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs md:text-sm px-5"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Baca Liputan Lengkap
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Dual Headline Cards & Quick Facts (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {articles.map((art, index) => {
              const isSelected = index === activeIndex;
              return (
                <div
                  key={art.id}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xl ring-1 ring-primary/40'
                      : 'bg-card/75 hover:bg-card border-border/40 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/20 text-primary">
                        Headline #{index + 1} • {art.category}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Sedang Ditampilkan
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 items-start">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-border/30"
                        onError={(e) => {
                          e.target.src = '/batik.jpg';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm md:text-base text-foreground leading-snug mb-1.5 line-clamp-2">
                          {art.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {art.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 truncate">
                      <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {art.date}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadingArticle(art);
                      }}
                      className="text-primary font-bold hover:underline flex items-center gap-1 flex-shrink-0"
                    >
                      Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Links */}
            <div className="bg-card/70 border border-border/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Lihat jadwal &amp; paket wisata budaya:
              </span>
              <div className="flex flex-wrap gap-2">
                <Link to="/agenda">
                  <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl border-primary/40 text-primary">
                    Kalender Budaya
                  </Button>
                </Link>
                <Link to="/produk?cat=Jasa%20%26%20Budaya">
                  <Button size="sm" className="h-8 text-xs rounded-xl">
                    Paket Wisata
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      <Dialog open={Boolean(readingArticle)} onOpenChange={() => setReadingArticle(null)}>
        <DialogContent className="w-[94vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 border-border/40 backdrop-blur-xl p-0 rounded-2xl">
          {readingArticle && (
            <div>
              <div className="relative aspect-[16/8] overflow-hidden">
                <img
                  src={readingArticle.image}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <button
                  onClick={() => setReadingArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider">
                    {readingArticle.tag}
                  </span>
                  <h2 className="text-xl md:text-3xl font-extrabold mt-2 leading-tight">
                    {readingArticle.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pb-4 border-b border-border/30">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {readingArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {readingArticle.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    {readingArticle.readTime}
                  </span>
                </div>

                <p className="text-sm md:text-base font-semibold text-primary leading-relaxed">
                  {readingArticle.subtitle}
                </p>

                <div className="space-y-4 text-sm md:text-base text-foreground/90 leading-relaxed">
                  {readingArticle.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="bg-secondary/40 border border-border/30 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Poin Penting Tradisi:
                  </h4>
                  {readingArticle.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                  <Link to="/agenda" onClick={() => setReadingArticle(null)}>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs">
                      Lihat di Kalender Agenda Desa
                    </Button>
                  </Link>
                  <Button onClick={() => setReadingArticle(null)} size="sm" className="rounded-xl text-xs">
                    Tutup Artikel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsHeadlineSection;

