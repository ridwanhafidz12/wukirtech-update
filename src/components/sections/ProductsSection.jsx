import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ShoppingCart, MessageCircle, QrCode, Banknote } from 'lucide-react';
import MotionCard from '@/components/common/MotionCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const products = [
  {
    name: "Wedang Uwuh Bu Endang",
    category: "Kuliner",
    umkm: "UMKM Wukirsari",
    price: "Rp20.000 / 10pcs",
    imageAlt: "Tiga gelas wedang uwuh hangat disajikan di atas meja",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/831f4e5dfdf72e4880aa6b7ee71b46b8.jpg",
    isNew: false,
  },
  {
    name: "Handmade Batik",
    category: "Kerajinan Tangan",
    umkm: "Handmade batik",
    price: "Rp700.000 - Rp800.000",
    imageAlt: "Batik tulis Giriloyo dengan motif klasik",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg",
    isNew: false,
  },
  {
    name: "Wayang Kulit Arjuna",
    category: "Seni Pertunjukan",
    umkm: "Ituk Wayang",
    price: "Rp600.000",
    imageAlt: "Wayang kulit dari Pucung",
    imageUrl: "wayang.jpeg",
    isNew: true,
  },
  {
    name: "Kipas Tangan Zainal",
    category: "Kerajinan Tangan",
    umkm: "Zainal",
    price: "Rp25.000",
    imageAlt: "Kipas bambu dengan motif batik",
    imageUrl: "kipas.jpg",
    isNew: true,
  },
  {
    name: "Thiwul Mbak Iswati",
    category: "Kuliner",
    umkm: "Mbak Iswati",
    price: "Rp15.000 / porsi",
    imageAlt: "Thiwul instan disajikan dengan kelapa parut",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/1af69d4a5467c90cf617e50609d8d0cb.jpg",
    isNew: true,
  },
  {
    name: "Batik Sungsang",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000",
    imageAlt: "Batik Sungsang dengan motif abstrak dan warna cerah",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/5fc39e8d401246d025cbe6ff72389b49.jpg",
    isNew: true,
  },
  {
    name: "Tatik Batik",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000 - Rp. 1.500.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik-1.jpg",
    isNew: true,
  },
  {
    name: "Kampung Batik Giriloyo",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000 - Rp. 2.0000.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik.jpg",
    isNew: true,
  },
  {
    name: "Wedang Uwuh",
    category: "Kerajinan Tangan",
    umkm: "Wedang Uwuh HJ. Jazimah",
    price: "Rp20.000 / pcs",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "uwuh.jpg",
    isNew: true,
  },
  {
    name: "Shalsabila Batik",
    category: "Kerajinan Tangan",
    umkm: "Shalsabila Batik",
    price: "Rp900.000 - 1.500.000",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "batik-2.png",
    isNew: true,
  },
];

const ProductCard = ({ product, onOrder }) => (
  <MotionCard whileHover={{ scale: 1.03, transition: { duration: 0.2 } }} className="group">
    <div className="relative">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img  class="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500" alt={product.imageAlt} src={product.imageUrl} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      {/* {product.isNew && <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">BARU</div>} */}
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

const PaymentModal = ({ product, onWhatsAppOrder }) => {
  if (!product) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pesan: {product.name}</DialogTitle>
        <DialogDescription>
          Pilih metode pembayaran atau hubungi kami via WhatsApp untuk menyelesaikan pesanan Anda.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="whatsapp" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</TabsTrigger>
          <TabsTrigger value="qris"><QrCode className="w-4 h-4 mr-2" />QRIS</TabsTrigger>
        </TabsList>
        <TabsContent value="whatsapp" className="mt-4 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">Klik tombol di bawah untuk mengirim pesan pesanan Anda langsung ke penjual.</p>
          <Button onClick={() => onWhatsAppOrder(product.name)} className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" /> Lanjutkan ke WhatsApp
          </Button>
        </TabsContent>
        <TabsContent value="qris" className="mt-4 p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-4">Pindai kode QR di bawah ini menggunakan aplikasi pembayaran favorit Anda.</p>
          <div className="flex justify-center">
            <img  class="w-48 h-48 bg-gray-300 rounded-md" alt="Contoh kode QRIS untuk pembayaran" src="gqris.jpg" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Total: {product.price}</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleWhatsAppOrder = (productName) => {
    const phoneNumber = "628816413617";
    const message = encodeURIComponent(`Halo, saya tertarik untuk memesan produk "${productName}" dari WukirTech.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsModalOpen(false);
  };

  return (
    <section id="produk" className="py-20 md:py-32 products-bg">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Produk & Pengalaman Unggulan</h2>
          <p className="text-lg text-muted-foreground">Dari mahakarya budaya hingga petualangan seru, temukan dan dukung karya terbaik dari para pengrajin dan pemandu lokal.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <DialogTrigger key={product.name} asChild>
                <div onClick={() => handleOrderClick(product)}>
                  <ProductCard product={product} onOrder={() => {}} />
                </div>
              </DialogTrigger>
            ))}
          </div>
          <DialogContent>
            <PaymentModal product={selectedProduct} onWhatsAppOrder={handleWhatsAppOrder} />
          </DialogContent>
        </Dialog>

        <div className="text-center mt-16">
          <Link to="/produk">
            <Button variant="outline" size="lg">Lihat Semua Produk <ArrowRight className="w-5 h-5 ml-2" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;