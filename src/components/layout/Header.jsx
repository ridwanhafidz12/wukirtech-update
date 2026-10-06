import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, ShieldCheck, ShoppingBag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }) =>
    cn(
      "text-xs md:text-sm font-semibold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1.5",
      isActive && "text-primary"
    );

  const NavLinks = () => (
    <>
      <NavLink to="/" className={navLinkClasses} end>
        Beranda
      </NavLink>
      <NavLink to="/produk" className={navLinkClasses}>
        Produk
      </NavLink>
      <NavLink to="/agenda" className={navLinkClasses}>
        Agenda
      </NavLink>
      <NavLink to="/cari" className={navLinkClasses}>
        <Search className="w-3.5 h-3.5" />
        Pencarian
      </NavLink>
    </>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-lg border-b border-border/30 shadow-md py-3"
            : "bg-transparent border-b border-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <img
              src="/WUKIRTECH.png"
              alt="WukirTech Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
              Wukir<span className="text-primary">Tech</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLinks />
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cari">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-secondary/60 rounded-xl"
                title="Cari Produk & Agenda"
              >
                <Search className="w-4 h-4" />
              </Button>
            </Link>

            {/* <Link to="/admin">
              <Button
                size="sm"
                className="bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-semibold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Button>
            </Link> */}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cari">
              <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground">
                <Search className="w-4 h-4" />
              </Button>
            </Link>
            <Button onClick={() => setIsMenuOpen(true)} variant="ghost" size="icon" className="w-9 h-9">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl md:hidden flex flex-col"
          >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-border/20">
              <NavLink
                to="/"
                className="flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <img
                  src="/WUKIRTECH.png"
                  alt="WukirTech Logo"
                  className="w-9 h-9 object-contain"
                />
                <span className="text-xl font-bold text-foreground">
                  Wukir<span className="text-primary">Tech</span>
                </span>
              </NavLink>
              <Button onClick={() => setIsMenuOpen(false)} variant="ghost" size="icon">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="flex flex-col items-center justify-center flex-grow gap-8 py-8">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
                end
              >
                Beranda
              </NavLink>
              <NavLink
                to="/agenda"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                Agenda Desa
              </NavLink>
              <NavLink
                to="/produk"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                Produk UMKM
              </NavLink>
              <NavLink
                to="/cari"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Pencarian
              </NavLink>
            </nav>

            <div className="p-6 border-t border-border/20 space-y-3">
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block">
                <Button className="w-full bg-primary text-primary-foreground font-semibold h-11 rounded-xl flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Masuk ke Panel Admin
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;