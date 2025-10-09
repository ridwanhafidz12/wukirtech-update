import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ShoppingCart, MessageCircle, QrCode, Landmark } from 'lucide-react';
import MotionCard from '@/components/MotionCard';

const products = [
  {
    imageAlt: "Wedang Uwuh hangat disajikan dalam gelas",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/c5d974fef9745b481acaeabddaaf850f.jpg",
    name: "Wedang Uwuh",
    category: "Kuliner",
    umkm: "UMKM Wukirsari",
    price: "Rp10.000"
  },
  {
    imageAlt: "Sekelompok orang sedang trekking di jalan setapak",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/384f9e37f69035bbf97e42de5e38f93c.jpg",
    name: "Treking Desa",
    category: "Petualangan",
    umkm: "Wukir Adventure",
    price: "Rp25.000 / Orang"
  },
  {
    imageAlt: "Orang-orang bermain sepak bola di sawah berlumpur",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/8b1733b5cd3ffb9f3a57ea0565785dd3.jpg",
    name: "Sepak Bola Sawah",
    category: "Petualangan",
    umkm: "Wukir Adventure",
    price: "Rp15.000 / Orang"
  },
  {
    imageAlt: "Batik tulis Giriloyo dengan motif klasik",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg",
    name: "Batik Tulis Klasik",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp45.000 - Rp300.000"
  },
  {
    imageAlt: "Wayang kulit dari Pucung",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/221621015694410387c80ee2c25d3f31.jpg",
    name: "Wayang Kulit Arjuna",
    category: "Seni Pertunjukan",
    umkm: "Sanggar Wayang Pucung",
    price: "Rp100.000 - Rp500.000",
    isNew: true
  },
  {
    imageAlt: "Kipas bambu dengan motif batik",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/468ad95c1e5f9498d4cf538f23e8fc92.jpg",
    name: "Kipas Bambu Cantik",
    category: "Kerajinan Tangan",
    umkm: "Pengrajin Bambu Wukir",
    price: "Rp25.000",
    isNew: true
  },
];

const ProductCard = ({ product, onOrder }) => (
  <MotionCard whileHover={{ scale: 1.03, transition: { duration: 0.2 } }} className="group">
    <div className="relative">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500" alt={product.imageAlt} src={product.imageUrl} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      {product.isNew && <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">BARU</div>}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-sm text-primary font-semibold mb-1">{product.category}</p>
      <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
      <p className="text-sm text-muted-foreground">Oleh {product.umkm}</p>
      {product.price && <p className="text-base font-semibold text-foreground mt-2">{product.price}</p>}
      <div className="mt-auto pt-4">
        <Button onClick={() => onOrder(product)} className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" /> Pesan Sekarang
        </Button>
      </div>
    </div>
  </MotionCard>
);

const PaymentModal = ({ product, open, onOpenChange }) => {
  const { toast } = useToast();

  const handleWhatsAppOrder = () => {
    const phoneNumber = "628816413617";
    const message = encodeURIComponent(`Halo, saya tertarik untuk memesan produk "${product.name}" dari WukirTech.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fitur pembayaran ini belum tersedia",
      description: "Kami sedang mengembangkannya. Untuk saat ini, silakan pesan melalui WhatsApp. 🙏",
      duration: 5000,
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
          <DialogDescription>
            Anda akan memesan <span className="font-bold text-primary">{product.name}</span>. Silakan pilih cara pembayaran yang Anda inginkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleWhatsAppOrder} size="lg" className="w-full justify-start">
            <MessageCircle className="w-5 h-5 mr-4" /> Pesan via WhatsApp
          </Button>
          <Button onClick={handleNotImplemented} variant="secondary" size="lg" className="w-full justify-start">
            <QrCode className="w-5 h-5 mr-4" /> Bayar dengan QRIS
          </Button>
          <Button onClick={handleNotImplemented} variant="secondary" size="lg" className="w-full justify-start">
            <Landmark className="w-5 h-5 mr-4" /> Transfer Bank
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const ProductsSection = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
  };

  const handleOrder = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <section id="produk" className="py-20 md:py-32 bg-background relative section-bg-gradient overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Produk & Pengalaman Unggulan</h2>
            <p className="text-lg text-muted-foreground">Dari mahakarya budaya hingga petualangan seru, temukan dan dukung karya terbaik dari para pengrajin dan pemandu lokal.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} onOrder={handleOrder} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button onClick={handleActionClick} variant="outline" size="lg">Lihat Semua Produk <ArrowRight className="w-5 h-5 ml-2" /></Button>
          </div>
        </div>
      </section>
      <PaymentModal product={selectedProduct} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default ProductsSection;