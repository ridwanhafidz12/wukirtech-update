import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, QrCode, Sparkles, Store, Tag, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotionCard from '@/components/common/MotionCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export const PaymentModal = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  const handleWhatsAppOrder = () => {
    const phoneNumber = product.phone || '628816413617';
    const message = encodeURIComponent(
      `Halo WukirTech / ${product.umkm}, saya ingin memesan:\n\n*${product.name}*\nHarga: ${product.price}\n\nMohon info ketersediaan stok & pengirimannya. Terima kasih!`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 border-border/40 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
              {product.category}
            </span>
            {product.isNew && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300">
                Baru
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Dikelola oleh <strong className="text-foreground">{product.umkm}</strong>
            {product.price && <span className="block mt-1 font-semibold text-primary">{product.price}</span>}
          </DialogDescription>
        </DialogHeader>

        {product.description && (
          <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/20">
            {product.description}
          </p>
        )}

        <Tabs defaultValue="whatsapp" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="whatsapp" className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="qris" className="flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              QRIS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="mt-4 p-4 bg-secondary/40 rounded-xl border border-border/20">
            <p className="text-sm text-muted-foreground mb-4">
              Pesan langsung ke penjual via WhatsApp resmi untuk konsultasi custom, ongkos kirim, dan konfirmasi ketersediaan.
            </p>
            <Button onClick={handleWhatsAppOrder} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
              <MessageCircle className="w-4 h-4 mr-2" /> Hubungi via WhatsApp
            </Button>
          </TabsContent>

          <TabsContent value="qris" className="mt-4 p-4 bg-secondary/40 rounded-xl border border-border/20 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Pindai kode QRIS di bawah ini dengan aplikasi perbankan atau e-wallet (BCA, Mandiri, GoPay, OVO, ShopeePay, Dana).
            </p>
            <div className="flex justify-center p-2 bg-white rounded-xl inline-block mx-auto shadow-inner">
              <img
                className="w-44 h-44 object-contain rounded-md"
                alt="QRIS WukirTech"
                src="/qris.jpg"
                onError={(e) => {
                  e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=WUKIRTECH-ORDER';
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Total Pembayaran: <strong className="text-foreground">{product.price}</strong>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Setelah pembayaran, harap kirim bukti transfer ke penjual via WhatsApp.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const ProductCard = ({ product, onSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleOpen = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setModalOpen(true);
    }
  };

  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : ['/batik.jpg']);

  const displayImage = imageList[0] || product.imageUrl || '/batik.jpg';
  const formattedImage = displayImage.startsWith('/') || displayImage.startsWith('http')
    ? displayImage
    : `/${displayImage}`;

  return (
    <>
      <MotionCard
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="group h-full flex flex-col overflow-hidden bg-card/80 border border-border/30 hover:border-primary/50 shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl"
      >
        <Link to={`/produk/${product.id}`} className="relative aspect-[16/10] overflow-hidden bg-secondary/30 block">
          {!imgError && product.imageUrl ? (
            <img
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              alt={product.imageAlt || product.name}
              src={formattedImage}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground p-4">
              <Store className="w-10 h-10 mb-2 text-primary/40" />
              <span className="text-xs font-medium text-center">{product.name}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground font-bold px-2.5 py-0.5 text-xs rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> BARU
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-foreground/90 border border-white/10 px-2 py-0.5 text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>

          {imageList.length > 1 && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 border border-white/10">
              <ImageIcon className="w-3 h-3" /> {imageList.length} Foto
            </div>
          )}
        </Link>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-primary font-medium flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> {product.category}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Store className="w-3 h-3" /> {product.umkm}
            </span>
          </div>

          <Link to={`/produk/${product.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">
              {product.description}
            </p>
          )}

          <div className="pt-3 border-t border-border/20 flex items-center justify-between gap-2 mt-auto">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Harga</span>
              <span className="text-sm md:text-base font-bold text-primary">
                {product.price || 'Hubungi Penjual'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link to={`/produk/${product.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs rounded-xl border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  title="Lihat Detail Produk"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                </Button>
              </Link>
              <Button
                onClick={handleOpen}
                size="sm"
                className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 text-xs rounded-xl shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Pesan
              </Button>
            </div>
          </div>
        </div>
      </MotionCard>

      {!onSelect && (
        <PaymentModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
