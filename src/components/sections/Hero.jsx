import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Award, ArrowRight, Mouse } from 'lucide-react';

const Hero = () => {
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
         <img  class="w-full h-full object-cover scale-110" alt="Pemandangan Desa Wukirsari dari ketinggian dengan sentuhan artistik" src="https://images.unsplash.com/photo-1695544938494-09eaba7dfe79" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-background/50"></div>
      </div>
      <div className="relative z-10 flex items-center justify-center h-full text-center">
        <motion.div
          className="container mx-auto px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <Award className="w-5 h-5" />
            <span>Desa Wisata Terbaik Dunia oleh UNWTO</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight tracking-tighter">
            Jelajahi Pesona Magis <br/> <span className="text-primary brightness-110">Desa Wukirsari</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Platform digital terpadu untuk menemukan keindahan alam, kekayaan budaya, dan produk UMKM otentik dari Wukirsari.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-4">
            <Button onClick={scrollToMap} size="lg" className="text-lg py-7 px-8 font-bold">
              Mulai Petualangan <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button onClick={handleActionClick} size="lg" variant="outline" className="text-lg py-7 px-8 font-bold">
              Produk Lokal
            </Button>
          </motion.div>
        </motion.div>
      </div>
       <motion.div 
         className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.5, duration: 1 }}
       >
         <Mouse className="w-6 h-6 text-muted-foreground" />
         <span className="text-xs text-muted-foreground">Scroll untuk menjelajah</span>
         <div className="w-px h-8 bg-muted-foreground/30 mt-1"></div>
       </motion.div>
    </section>
  );
};

export default Hero;