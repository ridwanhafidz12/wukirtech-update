import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot } from 'lucide-react';

const AnimatedTyping = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, 20);
    return () => clearInterval(intervalId);
  }, [text]);

  return <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-left">{displayedText}<span className="animate-ping">|</span></p>;
};

const AiPlannerSection = () => {
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiResponse('');

    setTimeout(() => {
      let response = "Tentu! Berdasarkan permintaan Anda, berikut adalah rekomendasi perjalanan yang sempurna di Wukirsari: Kunjungi sentra Batik Giriloyo di pagi hari, nikmati makan siang dengan kuliner lokal, lalu lanjutkan dengan belajar membuat Wayang Kulit di Pucung. Akhiri hari Anda dengan pemandangan matahari terbenam di Watu Gagak. Selamat menikmati!";
      
      const lowerCaseInput = aiInput.toLowerCase();
      if (lowerCaseInput.includes("budaya")) {
        response = "Untuk pengalaman budaya yang mendalam, saya sarankan Anda mengikuti workshop membatik di Giriloyo, kemudian mengunjungi sanggar Wayang Kulit Pucung untuk melihat proses pembuatannya dari dekat. Ini akan menjadi perjalanan yang tak terlupakan!";
      } else if (lowerCaseInput.includes("kuliner") || lowerCaseInput.includes("makan")) {
        response = "Pecinta kuliner wajib mencoba Sate Klathak yang legendaris di sekitar Wukirsari! Selain itu, jangan lewatkan jajanan pasar tradisional yang bisa Anda temukan di pagi hari. Untuk oleh-oleh, madu asli Wukirsari adalah pilihan terbaik.";
      } else if (lowerCaseInput.includes("alam")) {
        response = "Jika Anda mencari keindahan alam, mulailah dengan trekking ringan ke Watu Gagak untuk melihat pemandangan dari atas. Setelah itu, bersantailah di tepi Embung Wukirsari yang tenang. Udara segar dan pemandangan hijau akan memanjakan mata Anda.";
      }

      setAiResponse(response);
      setIsAiLoading(false);
    }, 2500);
  };

  return (
    <section id="ai-planner" className="py-20 md:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="relative bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-16 text-center shadow-2xl shadow-primary/10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-8 border border-primary/20 shadow-lg">
              <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perencana Perjalanan Cerdas</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={aiResponse ? 'response' : 'prompt'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {aiResponse ? (
                  <div className="flex items-start gap-4 max-w-2xl mx-auto mb-8">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <AnimatedTyping text={aiResponse} />
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Bingung mau mulai dari mana? Tanyakan pada AI kami! Dapatkan rekomendasi personal untuk itinerary, kuliner, dan aktivitas unik di Wukirsari.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            
            <form onSubmit={handleAiSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Contoh: 'Rekomendasikan wisata budaya untuk 2 hari'"
                  className="flex-grow h-12 bg-background/50 border-border/30 focus:ring-primary/50"
                  disabled={isAiLoading}
                />
                <Button type="submit" size="lg" className="h-12" disabled={isAiLoading}>
                  {isAiLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" /> Tanya AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiPlannerSection;