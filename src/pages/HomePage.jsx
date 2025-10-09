import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/sections/Hero';
import DashboardSection from '@/components/sections/DashboardSection';
import InteractiveMapSection from '@/components/sections/InteractiveMapSection';
import AiPlannerSection from '@/components/sections/AiPlannerSection';
import ProductsSection from '@/components/sections/ProductsSection';
import AboutSection from '@/components/sections/AboutSection';
import FallingParticles from '@/components/common/FallingParticles';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>WukirTech - Jelajahi Keajaiban Desa Wisata Wukirsari</title>
        <meta name="description" content="WukirTech adalah platform digital pariwisata terpadu untuk Desa Wisata Wukirsari. Temukan destinasi, produk UMKM, dan pengalaman budaya otentik." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>
      <FallingParticles />
      <Hero />
      <DashboardSection />
      <InteractiveMapSection />
      <AiPlannerSection />
      <ProductsSection />
      <AboutSection />
    </>
  );
};

export default HomePage;