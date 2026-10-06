import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  MessageCircle,
  Search,
  Tag,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/DataContext';
import { ProductCard, PaymentModal } from '@/components/common/ProductCard';

const ProdukPage = () => {
  const { products, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleWhatsAppContact = (topic = 'Konsultasi Produk') => {
    const phoneNumber = '628816413617';
    const message = encodeURIComponent(`Halo WukirTech, saya ingin konsultasi mengenai: ${topic}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = products.filter((item) => {
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.umkm?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <>
      <Helmet>
        <title>Galeri Produk & UMKM - Desa Wisata Wukirsari</title>
        <meta
          name="description"
          content="Jelajahi semua produk unggulan, batik tulis Giriloyo, wayang kulit Pucung, kuliner khas, dan kerajinan tangan dari UMKM di Desa Wukirsari."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/15 to-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Katalog Resmi UMKM Wukirsari</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Galeri Produk <span className="text-primary">Wukirsari</span>
            </h1>
          </motion.div>

          {/* Compact Professional Search & Dropdown Filter Toolbar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-card/80 p-2 sm:p-2.5 rounded-2xl border border-border/30 backdrop-blur-xl shadow-sm">
              {/* Search Input */}
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari batik, wayang, wedang uwuh, kuliner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 h-10 text-xs md:text-sm bg-background/60 border-border/30 rounded-xl focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground p-0.5"
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Dropdown Filter */}
              <div className="relative w-full sm:w-56 flex-shrink-0">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 text-xs md:text-sm rounded-xl border border-border/30 bg-background/60 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium transition-colors"
                >
                  <option value="Semua">Semua Kategori ({products.length})</option>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} ({count})
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-44 flex-shrink-0">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 text-xs md:text-sm rounded-xl border border-border/30 bg-background/60 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium transition-colors"
                >
                  <option value="default">Urutkan: Bawaan</option>
                  <option value="price-asc">Harga: Termurah</option>
                  <option value="price-desc">Harga: Termahal</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Reset Filter Button */}
              {(selectedCategory !== 'Semua' || searchQuery || sortBy !== 'default') && (
                <Button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl flex-shrink-0"
                  title="Reset Filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between text-xs text-muted-foreground px-2">
            <div>
              Menampilkan <strong className="text-foreground">{filteredProducts.length}</strong> dari{' '}
              <strong className="text-foreground">{products.length}</strong> total produk
              {selectedCategory !== 'Semua' && (
                <> dalam kategori <span className="text-primary font-medium">{selectedCategory}</span></>
              )}
            </div>

            {(selectedCategory !== 'Semua' || searchQuery || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className="text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-card/40 rounded-3xl border border-dashed border-border/50 max-w-lg mx-auto">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-foreground mb-1">
                  Tidak Ada Produk yang Cocok
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Coba ganti kata kunci atau pilih kategori lain.
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Lihat Semua Produk
                </Button>
              </div>
            )}
          </div>

          {/* Help & Consultation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-20 max-w-3xl mx-auto p-8 bg-card/60 rounded-3xl border border-border/30 backdrop-blur-md"
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              Butuh Pesanan Khusus atau Bantuan?
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-6">
              Tim WukirTech dan pengurus paguyuban siap membantu pesanan seragam batik, souvenir dalam jumlah besar,
              ataupun paket workshop edukasi budaya.
            </p>
            <Button
              onClick={() => handleWhatsAppContact('Pesanan Khusus / Souvenir UMKM')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl px-6"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Konsultasi via WhatsApp Resmi
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Payment / Ordering Modal */}
      <PaymentModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProdukPage;