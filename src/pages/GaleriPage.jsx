import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  },
};

const GaleriPage = () => {
  return (
    <>
      <Helmet>
        <title>Galeri - WukirTech</title>
        <meta name="description" content="Jelajahi keindahan visual Desa Wisata Wukirsari melalui koleksi foto-foto menakjubkan dari alam, budaya, dan kehidupan masyarakatnya." />
      </Helmet>
      <div className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Galeri Wukirsari</h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Saksikan pesona Desa Wukirsari melalui lensa. Setiap gambar bercerita tentang keindahan alam, kehangatan budaya, dan denyut kehidupan kami.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg md:col-span-2" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Proses membatik oleh seorang pengrajin di Giriloyo" src="https://images.unsplash.com/photo-1666578296079-52024f45d962" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Proses membatik oleh seorang pengrajin di Giriloyo</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Anak-anak bermain layang-layang di sawah Wukirsari yang hijau" src="https://images.unsplash.com/photo-1619450473635-d1674ead3760" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Anak-anak bermain layang-layang di sawah Wukirsari yang hijau</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg md:row-span-2" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Detail ukiran wayang kulit yang rumit buatan Pucung" src="https://images.unsplash.com/photo-1701695328280-f4be018897f7" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Detail ukiran wayang kulit yang rumit buatan Pucung</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Pemandangan matahari terbenam yang dramatis di Watu Gagak" src="https://images.unsplash.com/photo-1681470137594-89eb46b9ddb8" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Pemandangan matahari terbenam yang dramatis di Watu Gagak</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg md:col-span-2" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Embung Wukirsari yang tenang di pagi hari" src="https://images.unsplash.com/photo-1577404765290-6a232e570c3f" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Embung Wukirsari yang tenang di pagi hari</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Seorang ibu menjual jajanan pasar tradisional" src="https://images.unsplash.com/photo-1639784391799-75b76e90f885" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Seorang ibu menjual jajanan pasar tradisional</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Close-up Wedang Uwuh dengan rempah-rempah alaminya" src="https://images.unsplash.com/photo-1513204820292-f8acdae393fc" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Close-up Wedang Uwuh dengan rempah-rempah alaminya</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Kelompok wisatawan sedang trekking menyusuri jalan setapak desa" src="https://images.unsplash.com/photo-1651327834882-8f2a6930116d" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Kelompok wisatawan sedang trekking menyusuri jalan setapak desa</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Pertunjukan tari tradisional saat Merti Desa" src="https://images.unsplash.com/photo-1572603896433-ca828a17e329" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Pertunjukan tari tradisional saat Merti Desa</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg md:row-span-2" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Detail tangan seorang pengrajin bambu" src="https://images.unsplash.com/photo-1699232708554-2f09a84c09c4" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Detail tangan seorang pengrajin bambu</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg md:col-span-2" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Sawah terasering yang subur di Wukirsari" src="https://images.unsplash.com/photo-1699012675633-851c33959342" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Sawah terasering yang subur di Wukirsari</p>
          </motion.div>
          <motion.div className="group relative overflow-hidden rounded-2xl shadow-lg" variants={itemVariants}>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
            <img  class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Senyum ramah seorang warga desa Wukirsari" src="https://images.unsplash.com/photo-1611412899804-7908a07aca44" />
            <p className="absolute bottom-4 left-4 z-20 text-sm font-semibold text-white/90">Senyum ramah seorang warga desa Wukirsari</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default GaleriPage;