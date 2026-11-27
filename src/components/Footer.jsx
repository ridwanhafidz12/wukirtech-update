import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} WukirTech. Didukung oleh Pemdes Wukirsari. Dibuat untuk Masyarakat Desa Wisata Budaya Wukirsari.</p>
      </div>
    </footer>
  );
};

export default Footer;