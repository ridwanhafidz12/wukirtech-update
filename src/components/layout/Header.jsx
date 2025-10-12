import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
  };

  const navLinkClasses = ({ isActive }) =>
    cn(
      "text-sm font-semibold tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors duration-300",
      isActive && "text-primary"
    );

  const NavLinks = () => (
    <>
      <NavLink to="/" className={navLinkClasses} end>Beranda</NavLink>
      <NavLink to="/agenda" className={navLinkClasses}>Agenda</NavLink>
      <NavLink to="/produk" className={navLinkClasses}>Produk</NavLink>
      {/* <NavLink to="/planner" className={navLinkClasses}>AI Planner</NavLink> */}
    </>
  );

  return (
    <>
<header className={cn(
  "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
  scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/20 shadow-md" : "bg-transparent border-b border-transparent"
)}>
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <NavLink to="/" className="flex items-center gap-3">
      <img 
        src="/WUKIRTECH.png" 
        alt="WukirTech Logo" 
        className="w-10 h-10 object-contain"  // ukuran diperbesar
      />
      <span className="text-2xl font-bold text-foreground">
        Wukir<span className="text-primary">Tech</span>
      </span>
    </NavLink>
    <nav className="hidden md:flex items-center gap-8">
      <NavLinks />
    </nav>
    {/* <div className="hidden md:flex">
       <Button onClick={handleActionClick} variant="outline">Mulai Jelajah</Button>
    </div> */}
    <div className="md:hidden">
      <Button onClick={() => setIsMenuOpen(true)} variant="ghost" size="icon">
        <Menu className="w-6 h-6" />
      </Button>
    </div>
  </div>
</header>


      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-16">
                 <NavLink to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                    <img 
                      src="/wukirtech.png" 
                      alt="WukirTech Logo" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-2xl font-bold text-foreground">Wukir<span className="text-primary">Tech</span></span>
                  </NavLink>
                  <Button onClick={() => setIsMenuOpen(false)} variant="ghost" size="icon">
                    <X className="w-6 h-6" />
                  </Button>
              </div>
              <nav className="flex flex-col items-center justify-center flex-grow gap-8">
                <NavLinks />
              </nav>
               <div className="py-8">
                 {/* <Button onClick={handleActionClick} variant="outline" className="w-full">Mulai Jelajah</Button> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;