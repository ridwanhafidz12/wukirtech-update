import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, MessageCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { ProductCard, PaymentModal } from '@/components/common/ProductCard';

const ProductsSection = () => {
  const { products, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const displayedProducts = products
    .filter((p) => selectedCategory === 'Semua' || p.category === selectedCategory)
    .slice(0, 8);

  const handleWhatsAppContact = () => {
    const phoneNumber = '628816413617';
    const message = encodeURIComponent('Halo WukirTech, saya ingin konsultasi mengenai produk UMKM Wukirsari.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="produk" className="py-12 md:py-20 bg-gradient-to-b from-background via-secondary/15 to-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Karya UMKM Wukirsari</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2.5">
            Produk Unggulan <span className="text-primary">UMKM Desa</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Batik tulis Giriloyo, wayang kulit Pucung, kuliner khas, dan paket wisata langsung dari pengrajin lokal.
          </p>

          {/* Dynamic Category Chips */}
          <div className="flex items-center sm:justify-center gap-2 mt-5 overflow-x-auto pb-1 sm:flex-wrap">
            <button
              onClick={() => setSelectedCategory('Semua')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${
                selectedCategory === 'Semua'
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground border-border/30'
              }`}
            >
              Semua ({products.length})
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card/70 hover:bg-secondary text-muted-foreground border-border/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {displayedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/produk">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-xl">
              Lihat Semua Katalog ({products.length}) <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/cari">
            <Button size="lg" variant="outline" className="px-6 rounded-xl border-border/50">
              <Search className="w-4 h-4 mr-2 text-primary" /> Cari Spesifik
            </Button>
          </Link>
        </div>
      </div>

      <PaymentModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default ProductsSection;