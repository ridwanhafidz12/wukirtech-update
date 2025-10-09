import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingBag, Wrench } from 'lucide-react';

const ProdukPage = () => {
  return (
    <>
      <Helmet>
        <title>Semua Produk - Desa Wukirsari</title>
        <meta name="description" content="Jelajahi semua produk unggulan dan kerajinan tangan dari UMKM di Desa Wukirsari." />
      </Helmet>
      <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          <div className="inline-block p-6 bg-primary/10 rounded-full mb-8">
            <ShoppingBag className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Galeri Produk Kami
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Halaman ini sedang dalam pengembangan. Segera, Anda akan dapat menjelajahi semua produk dan kerajinan tangan luar biasa dari Desa Wukirsari di sini.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Wrench className="w-5 h-5" />
            <span>Nantikan pembaruan selanjutnya!</span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProdukPage;