import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Award, ArrowRight } from 'lucide-react';

const Hero = () => {
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
  };

  return (
    <section className="relative h-[80vh] md:h-screen overflow-hidden">
      <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
         <img className="w-full h-full object-cover" alt="Pemandangan Desa Wukirsari dari ketinggian" src="https://images.unsplash.com/photo-1695544938494-09eaba7dfe79" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </motion.div>
      <div className="relative z-10 flex items-center justify-center h-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container mx-auto px-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full mb-4">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Desa Wisata Terbaik Dunia oleh UNWTO</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Temukan Pesona Tersembunyi <br/> <span className="text-primary">Desa Wukirsari</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Platform digital untuk menjelajahi keindahan alam, kekayaan budaya, dan produk UMKM otentik dari Wukirsari.
          </p>
          <Button onClick={handleActionClick} size="lg">
            Mulai Petualangan Anda <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;