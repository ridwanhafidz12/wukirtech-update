import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, Search, Sparkles, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/cari?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/cari');
    }
  };

  const scrollToMap = () => {
    document.getElementById('destinasi')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover scale-105"
          alt="Pemandangan Desa Wukirsari dari ketinggian dengan sentuhan artistik"
          src="https://images.unsplash.com/photo-1695544938494-09eaba7dfe79"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50"></div>
        <div className="absolute inset-0 bg-background/40"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full text-center w-full">
        <motion.div
          className="container mx-auto px-4 md:px-6 max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary px-4 py-2 rounded-full mb-6 text-xs md:text-sm font-semibold backdrop-blur-md shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>Desa Wisata Terbaik Dunia oleh UNWTO</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight tracking-tight"
          >
            Jelajahi Pesona Magis <br />
            <span className="text-primary brightness-110">Desa Wukirsari</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground mb-8"
          >
            Platform digital terpadu untuk menemukan keindahan alam, kekayaan budaya, dan karya produk UMKM otentik dari Wukirsari.
          </motion.p>

          {/* Hero Quick Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari batik, wedang uwuh, wayang, kuliner..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="pl-12 pr-28 h-14 text-sm md:text-base rounded-2xl bg-card/90 border-border/50 text-foreground backdrop-blur-xl focus-visible:ring-primary shadow-inner"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 rounded-xl text-xs md:text-sm"
              >
                Cari
              </Button>
            </form>

            {/* Quick keyword chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-primary" /> Cepat:
              </span>
              {['Batik Tulis', 'Wedang Uwuh', 'Wayang Kulit', 'Kuliner'].map((item) => (
                <Link
                  key={item}
                  to={`/cari?q=${encodeURIComponent(item)}`}
                  className="px-2.5 py-1 rounded-lg bg-background/60 hover:bg-primary/20 hover:text-primary transition-colors border border-border/30 text-xs backdrop-blur-md"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex justify-center items-center flex-wrap gap-4">
            <Button onClick={scrollToMap} size="lg" className="h-12 px-6 font-bold text-sm md:text-base rounded-xl shadow-lg shadow-primary/10">
              Mulai Petualangan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/produk">
              <Button size="lg" variant="outline" className="h-12 px-6 font-bold text-sm md:text-base rounded-xl border-border/50 bg-background/40 backdrop-blur-md">
                <ShoppingBag className="w-4 h-4 mr-2 text-primary" /> Galeri Produk
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;