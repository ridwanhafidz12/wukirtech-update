import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  QrCode,
  Star,
  Sparkles,
  ShieldCheck,
  Store,
  Tag,
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  Layers,
  ZoomIn,
  Truck,
  Heart,
  Pencil,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import { ProductCard, PaymentModal } from '@/components/common/ProductCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById } = useData();
  const { toast } = useToast();

  const product = getProductById ? getProductById(id) : products.find((p) => p.id === id || String(p.id) === String(id));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('deskripsi'); // deskripsi | spesifikasi | umkm | panduan
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center px-4">
        <Helmet>
          <title>Produk Tidak Ditemukan - WukirTech</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-card/70 border border-border/40 p-8 rounded-3xl backdrop-blur-xl shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Produk yang Anda cari mungkin telah diperbarui, dipindahkan, atau telah habis terjual.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/produk">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" /> Lihat Semua Produk
              </Button>
            </Link>
            <Link to="/cari">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-border/40">
                Pencarian Produk
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sanitasi daftar gambar produk
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : (product.imageUrl ? [product.imageUrl] : ['/batik.jpg']);

  const images = rawImages.map((img) =>
    img.startsWith('/') || img.startsWith('http') ? img : `/${img}`
  );

  const currentImage = images[activeImageIndex] || images[0] || '/batik.jpg';

  // Rekomendasi produk terkait
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.umkm === product.umkm))
    .slice(0, 4);

  // Estimasi harga subtotal
  const unitPriceNum =
    product.priceNum ||
    parseInt(String(product.price || '').replace(/[^0-9]/g, ''), 10) ||
    0;
  const totalPriceNum = unitPriceNum * quantity;
  const formattedSubtotal =
    totalPriceNum > 0
      ? `Rp${totalPriceNum.toLocaleString('id-ID')}`
      : product.price || 'Hubungi Penjual';

  // Handler WhatsApp Order
  const handleWhatsAppOrder = () => {
    const phoneNumber = product.phone || '628816413617';
    const currentUrl = window.location.href;
    const message = encodeURIComponent(
      `Halo WukirTech / ${product.umkm},\n\nSaya ingin memesan produk:\n📦 *${product.name}*\n🏷️ *Kategori:* ${product.category}\n🔢 *Jumlah:* ${quantity} item\n💰 *Harga Satuan:* ${product.price}\n💵 *Estimasi Total:* ${formattedSubtotal}\n\n🔗 *Tautan Produk:* ${currentUrl}\n\nMohon info ketersediaan stok, ongkos kirim, dan rekening pembayarannya ya. Terima kasih!`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Handler Salin Tautan
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: 'Tautan Berhasil Disalin! 📋',
        description: 'Tautan produk ini siap dibagikan ke teman atau keluarga Anda.',
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} — Karya UMKM Desa Wukirsari`}</title>
        <meta
          name="description"
          content={product.description || `Beli ${product.name} karya pengrajin UMKM Desa Wukirsari secara langsung.`}
        />
        <meta property="og:title" content={`${product.name} — WukirTech`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={currentImage} />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumbs & Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-2">
            <div className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <Link to="/produk" className="hover:text-primary transition-colors">
                Produk UMKM
              </Link>
              <span>/</span>
              <Link
                to={`/produk?cat=${encodeURIComponent(product.category)}`}
                className="text-primary font-medium hover:underline"
              >
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold line-clamp-1 max-w-[200px] md:max-w-xs">
                {product.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 px-3 text-xs rounded-xl border-border/40 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali
              </Button>
            </div>
          </div>

          {/* Main Product Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            {/* LEFT COLUMN: MULTI-IMAGE GALLERY (7 COLS ON LARGE) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Image Frame */}
              <div className="relative aspect-[4/3] md:aspect-[16/11] rounded-3xl overflow-hidden bg-card/60 border border-border/40 shadow-xl group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={`${product.name} - Foto ${activeImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
                    onClick={() => setIsLightboxOpen(true)}
                    onError={(e) => {
                      e.target.src = '/batik.jpg';
                    }}
                  />
                </AnimatePresence>

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  {product.isNew && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-md flex items-center gap-1 backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" /> BARU
                    </span>
                  )}
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {product.stockStatus || 'Tersedia'}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/60 text-white/90 backdrop-blur-md border border-white/20">
                    {product.category}
                  </span>
                </div>

                {/* Right Action Icons: Zoom & Like */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-black/50 hover:bg-black/70 text-white'
                    }`}
                    title="Simpan ke Favorit"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all"
                    title="Perbesar Pratinjau Foto"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Prev / Next Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                      title="Foto Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                      title="Foto Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Bottom Image Index Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-primary ring-2 ring-primary/40 shadow-lg scale-105'
                          : 'border-border/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/batik.jpg';
                        }}
                      />
                      {activeImageIndex === idx && (
                        <div className="absolute inset-0 bg-primary/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PRODUCT INFO & ORDER ACTIONS (5 COLS ON LARGE) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Merchant & Rating Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
                    <Store className="w-3.5 h-3.5" />
                    <span>{product.umkm}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="UMKM Terverifikasi Wukirsari" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-muted-foreground font-normal">(48 ulasan)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-3">
                  {product.name}
                </h1>

                {/* Short Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Price Display Box */}
                <div className="p-5 rounded-2xl bg-card/80 border border-border/40 shadow-sm mb-6">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                    Harga Resmi Pengrajin
                  </span>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                      {product.price || 'Hubungi Penjual'}
                    </span>
                    {product.weight && (
                      <span className="text-xs text-muted-foreground bg-secondary/60 px-2.5 py-0.5 rounded-lg border border-border/20">
                        Berat: {product.weight}
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-500 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Produk Otentik Asli Desa Wukirsari</span>
                  </div>
                </div>

                {/* Product Highlights Pills */}
                {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <span className="text-xs font-semibold text-foreground block">Keunggulan Utama:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border/20 text-xs text-foreground/90"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper & Subtotal Box */}
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/20 mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">Jumlah Pesanan:</span>
                      <span className="text-[11px] text-muted-foreground">Minimal pemesanan: 1 item</span>
                    </div>

                    <div className="flex items-center gap-2 bg-card rounded-xl p-1 border border-border/30">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-secondary/60 hover:bg-secondary flex items-center justify-center text-sm font-bold text-foreground transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-foreground">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg bg-secondary/60 hover:bg-secondary flex items-center justify-center text-sm font-bold text-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {quantity > 1 && totalPriceNum > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Estimasi Total ({quantity} item):</span>
                      <span className="font-extrabold text-primary text-sm">{formattedSubtotal}</span>
                    </div>
                  )}
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleWhatsAppOrder}
                    size="lg"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Pesan Langsung via WhatsApp
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setIsPaymentModalOpen(true)}
                      variant="outline"
                      size="lg"
                      className="h-11 rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      Bayar via QRIS
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="lg"
                      className="h-11 rounded-xl border-border/40 text-muted-foreground hover:text-foreground font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" /> Bagikan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/20 text-center">
                <div className="p-2.5 rounded-xl bg-card/50 border border-border/20">
                  <ShieldCheck className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-foreground block">100% Asli</span>
                  <span className="text-[10px] text-muted-foreground">Karya Pengrajin</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card/50 border border-border/20">
                  <Truck className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-foreground block">Kirim Cepat</span>
                  <span className="text-[10px] text-muted-foreground">Seluruh Indonesia</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card/50 border border-border/20">
                  <Store className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-foreground block">Bina UMKM</span>
                  <span className="text-[10px] text-muted-foreground">Ekonomi Desa</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABBED INFORMATION SECTION (STORYTELLING, SPECS, UMKM, HOW TO BUY) */}
          <div className="mb-20">
            {/* Tab Buttons */}
            <div className="flex items-center gap-2 border-b border-border/30 pb-3 overflow-x-auto scrollbar-none mb-8">
              {[
                { id: 'deskripsi', label: 'Cerita & Filosofi Produk', icon: Sparkles },
                { id: 'spesifikasi', label: 'Spesifikasi Lengkap', icon: Layers },
                { id: 'umkm', label: 'Profil Pengrajin / UMKM', icon: Store },
                { id: 'panduan', label: 'Cara Order & Pengiriman', icon: Truck },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-card/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="bg-card/70 border border-border/40 rounded-3xl p-6 md:p-10 shadow-lg backdrop-blur-md">
              {/* TAB 1: DESKRIPSI & CERITA */}
              {activeTab === 'deskripsi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-4xl"
                >
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      Tentang {product.name}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.fullDescription || product.description}
                    </p>
                  </div>

                  {/* Warisan Budaya Highlight */}
                  <div className="p-5 rounded-2xl bg-secondary/30 border border-border/30 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-xs md:text-sm text-muted-foreground">
                      <strong className="text-foreground block mb-1">Dukungan Nyata untuk Kebudayaan Lokal:</strong>
                      Setiap produk yang Anda beli di WukirTech langsung mendukung kelangsungan seni tradisi para ibu pembatik,
                      seniman tatah sungging, dan pelaku kuliner tradisional di Desa Wisata Wukirsari yang diakui UNWTO sebagai
                      Desa Wisata Terbaik Dunia.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SPESIFIKASI */}
              {activeTab === 'spesifikasi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                    Spesifikasi & Detail Produk
                  </h3>

                  {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                    <div className="divide-y divide-border/20 border border-border/30 rounded-2xl overflow-hidden bg-background/50">
                      {product.specifications.map((spec, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs md:text-sm hover:bg-secondary/20 transition-colors"
                        >
                          <span className="font-semibold text-muted-foreground">{spec.label}</span>
                          <span className="sm:col-span-2 font-medium text-foreground mt-1 sm:mt-0">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      Spesifikasi dasar: Kategori {product.category}, Dibuat oleh {product.umkm}, Status Stok {product.stockStatus || 'Tersedia'}.
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: PROFIL UMKM */}
              {activeTab === 'umkm' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Store className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {product.umkm}
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Desa Wisata Wukirsari, Imogiri, Bantul, D.I. Yogyakarta
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unit usaha mikro binaan Paguyuban UMKM WukirTech berkomitmen melestarikan keaslian warisan budaya
                    dan menjaga standar mutu produk demi kepuasan pelanggan di seluruh nusantara dan mancanegara.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleWhatsAppOrder}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> Chat Pengurus UMKM
                    </Button>
                    <Link to={`/cari?q=${encodeURIComponent(product.umkm)}`}>
                      <Button variant="ghost" size="sm" className="rounded-xl text-primary">
                        Lihat Produk Lain dari {product.umkm} →
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CARA ORDER & PENGIRIMAN */}
              {activeTab === 'panduan' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Panduan Pemesanan & Pengiriman
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        step: '01',
                        title: 'Pilih & Hubungi',
                        desc: 'Klik tombol WhatsApp untuk langsung terhubung dengan penjual resmi.',
                      },
                      {
                        step: '02',
                        title: 'Konfirmasi Pesanan',
                        desc: 'Penjual memverifikasi jumlah stok, varian, dan ongkos kirim ke alamat Anda.',
                      },
                      {
                        step: '03',
                        title: 'Pembayaran Mudah',
                        desc: 'Lakukan pembayaran melalui QRIS desa atau transfer antar-bank resmi.',
                      },
                      {
                        step: '04',
                        title: 'Dikemas & Dikirim',
                        desc: 'Barang dikemas secara aman dan dikirim langsung dari Desa Wukirsari.',
                      },
                    ].map((item) => (
                      <div key={item.step} className="p-4 rounded-2xl bg-secondary/30 border border-border/20">
                        <span className="text-xl font-extrabold text-primary block mb-2">{item.step}</span>
                        <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS RECOMMENDATION */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-border/30 pt-12">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-foreground">
                    Produk Rekomendasi Terkait
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Temukan karya lain yang serupa dari pengrajin Desa Wukirsari
                  </p>
                </div>
                <Link to="/produk">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary font-semibold text-xs">
                    Lihat Semua Katalog →
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 border-t border-border/40 backdrop-blur-xl p-3 md:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-border/30"
          />
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-foreground truncate block">{product.name}</span>
            <span className="text-xs font-extrabold text-primary">{formattedSubtotal}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => setIsPaymentModalOpen(true)}
            size="sm"
            variant="outline"
            className="h-10 px-3 rounded-xl border-primary/30 text-primary text-xs"
          >
            <QrCode className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleWhatsAppOrder}
            size="sm"
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> Pesan
          </Button>
        </div>
      </div>

      {/* LIGHTBOX MODAL (FULLSCREEN IMAGE PREVIEW) */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-none text-white">
          <div className="relative flex flex-col items-center justify-center p-2">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
            {images.length > 1 && (
              <div className="flex items-center justify-between w-full mt-3 px-4 text-xs text-white/80">
                <Button variant="ghost" size="sm" onClick={prevImage} className="text-white hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                </Button>
                <span>
                  Foto {activeImageIndex + 1} dari {images.length}
                </span>
                <Button variant="ghost" size="sm" onClick={nextImage} className="text-white hover:bg-white/10">
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QUICK PAYMENT / QRIS MODAL */}
      <PaymentModal
        product={product}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </>
  );
};

export default ProductDetailPage;
