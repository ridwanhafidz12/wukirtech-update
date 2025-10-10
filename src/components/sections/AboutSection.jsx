import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MotionCard from '@/components/common/MotionCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, X } from 'lucide-react';

const AboutSection = () => {
  const { toast } = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePelajariClick = () => {
    setIsPopupOpen(true);
  };

  const handleHubungiClick = () => {
    const phoneNumber = '+628816413617';
    const message = 'Halo, saya tertarik dengan layanan WukirTech. Bisa beri informasi lebih lanjut?';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section id="tentang" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <MotionCard>
            <div className="aspect-w-16 aspect-h-10">
              <img className="object-cover w-full h-full" alt="Tim WukirTech berdiskusi dengan pelaku UMKM di Wukirsari" src="sawah.jpg" />
            </div>
          </MotionCard>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Pelopor Digitalisasi Desa Wisata</h2>
            <p className="text-muted-foreground mb-4">WukirTech lahir sebagai solusi untuk mengangkat potensi Desa Wisata Wukirsari ke panggung dunia. Kami bukan hanya media promosi, tetapi sebuah pasar digital khusus yang menjembatani wisatawan dengan kekayaan desa.</p>
            <p className="text-muted-foreground mb-8">Dengan kemitraan strategis bersama Pemerintah Desa Wukirsari dan lebih dari 100 UMKM, kami berkomitmen mendorong transformasi digital dan pertumbuhan ekonomi lokal secara masif dan terstruktur.</p>
            <div className="flex items-center gap-4">
              <Button onClick={handlePelajariClick}>Pelajari Lebih Lanjut</Button>
              <Button onClick={handleHubungiClick} variant="ghost">Hubungi Kami <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-foreground">Tentang WukirTech</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClosePopup}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Visi & Misi</h4>
                <p className="text-muted-foreground">
                  WukirTech hadir sebagai platform digital yang mengintegrasikan seluruh potensi Desa Wisata Wukirsari, 
                  mulai dari wisata, kuliner, kerajinan tangan, hingga homestay dalam satu ekosistem digital yang terpadu.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Layanan Kami</h4>
                <ul className="text-muted-foreground list-disc list-inside space-y-2">
                  <li>Platform pemesanan tiket dan paket wisata</li>
                  <li>Marketplace produk UMKM lokal</li>
                  <li>Sistem reservasi homestay dan penginapan</li>
                  <li>Digitalisasi proses bisnis UMKM</li>
                  <li>Pelatihan dan pendampingan teknologi</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Pencapaian</h4>
                <ul className="text-muted-foreground list-disc list-inside space-y-2">
                  <li>100+ UMKM mitra terdaftar</li>
                  <li>Kemitraan strategis dengan Pemerintah Desa</li>
                  <li>Peningkatan omzet UMKM rata-rata 40%</li>
                  <li>Digitalisasi 15 homestay tradisional</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Keunggulan</h4>
                <p className="text-muted-foreground">
                  Kami menggunakan teknologi terkini untuk memastikan pengalaman yang mulus bagi wisatawan 
                  dan kemudahan berbisnis bagi pelaku UMKM. Sistem kami dirancang khusus untuk mengakomodasi 
                  karakteristik unik desa wisata.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleClosePopup}>
                Tutup
              </Button>
              <Button onClick={handleHubungiClick}>
                Hubungi Kami Sekarang
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;