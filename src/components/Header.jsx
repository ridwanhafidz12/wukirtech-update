import React from 'react';
import { Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 5000,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Feather className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Wukir<span className="text-primary">Tech</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#destinasi" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Destinasi</a>
          <a href="#produk" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Produk Lokal</a>
          <a href="#ai-planner" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">AI Planner</a>
          <a href="#tentang" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a>
        </nav>
        <Button onClick={handleActionClick} className="hidden md:flex">Mulai Jelajah</Button>
      </div>
    </header>
  );
};

export default Header;