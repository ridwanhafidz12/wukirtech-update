import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import MotionCard from '@/components/MotionCard';

const AboutSection = () => {
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
  };

  return (
    <section id="tentang" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <MotionCard>
            <div className="aspect-w-16 aspect-h-10">
              <img className="object-cover w-full h-full" alt="Tim WukirTech berdiskusi dengan pelaku UMKM di Wukirsari" src="https://images.unsplash.com/photo-1494171639056-44b7fcf5a767" />
            </div>
          </MotionCard>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Pelopor Digitalisasi Desa Wisata</h2>
            <p className="text-muted-foreground mb-4">WukirTech lahir sebagai solusi untuk mengangkat potensi Desa Wisata Wukirsari ke panggung dunia. Kami bukan hanya media promosi, tetapi sebuah pasar digital khusus yang menjembatani wisatawan dengan kekayaan desa.</p>
            <p className="text-muted-foreground mb-8">Dengan kemitraan strategis bersama Pemerintah Desa Wukirsari dan lebih dari 100 UMKM, kami berkomitmen mendorong transformasi digital dan pertumbuhan ekonomi lokal secara masif dan terstruktur.</p>
            <div className="flex items-center gap-4">
              <Button onClick={handleActionClick}>Pelajari Lebih Lanjut</Button>
              <Button onClick={handleActionClick} variant="ghost">Hubungi Kami <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;