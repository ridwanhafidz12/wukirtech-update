import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Bot, Wand2, Mountain, Utensils, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';


const aiResponseItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const aiResponseItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const AiResponseVisualizer = ({ response }) => {
  const [parsedResponse, setParsedResponse] = useState(null);

  useEffect(() => {
    // A simple parser to structure the AI's text response
    const activities = [];
    if (response.includes("Batik Giriloyo")) activities.push({ title: "Workshop Batik", icon: Palette, text: "Belajar membatik di sentra Batik Tulis Giriloyo." });
    if (response.includes("Wayang Kulit")) activities.push({ title: "Sanggar Wayang", icon: Palette, text: "Melihat pembuatan Wayang Kulit di Pucung." });
    if (response.includes("Watu Gagak")) activities.push({ title: "Sunset di Watu Gagak", icon: Mountain, text: "Menikmati matahari terbenam yang memukau." });
    if (response.includes("kuliner") || response.includes("Sate Klathak")) activities.push({ title: "Wisata Kuliner", icon: Utensils, text: "Mencicipi Sate Klathak dan jajanan pasar." });
    if (response.includes("alam") || response.includes("Embung")) activities.push({ title: "Menjelajah Alam", icon: Mountain, text: "Bersantai di Embung Wukirsari dan trekking." });

    if(activities.length > 0) {
      setParsedResponse({
        intro: "Tentu! Berikut rekomendasi perjalanan yang telah saya siapkan untuk Anda:",
        activities: activities
      });
    } else {
        setParsedResponse({ intro: response, activities: [] });
    }
  }, [response]);

  if (!parsedResponse) return null;

  return (
    <motion.div 
      className="text-left max-w-3xl mx-auto"
      variants={aiResponseItems}
      initial="hidden"
      animate="visible"
    >
      <motion.p className="text-lg text-muted-foreground mb-6 flex items-start gap-4" variants={aiResponseItem}>
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-1"><Bot className="w-6 h-6" /></span>
        {parsedResponse.intro}
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {parsedResponse.activities.map((activity, index) => (
          <motion.div key={index} className="bg-secondary/50 border border-border/30 rounded-lg p-4 flex items-center gap-4" variants={aiResponseItem}>
            <activity.icon className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">{activity.title}</h4>
              <p className="text-sm text-muted-foreground">{activity.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
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
    <section id="ai-planner" className="py-20 md:py-32 ai-planner-bg">
      <div className="container mx-auto px-6">
        <motion.div 
          className="relative bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-primary/10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-400"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-8 border border-primary/20 shadow-lg">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perencana Perjalanan Cerdas</h2>
            <div className="min-h-[180px] my-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aiResponse ? 'response' : 'prompt'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {aiResponse ? (
                    <AiResponseVisualizer response={aiResponse} />
                  ) : (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Bingung mau mulai dari mana? Tanyakan pada AI kami! Dapatkan rekomendasi personal untuk itinerary, kuliner, dan aktivitas unik di Wukirsari.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <form onSubmit={handleAiSubmit} className="max-w-xl mx-auto">
              <div className="relative">
                <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Contoh: 'Rekomendasikan wisata budaya untuk 2 hari'"
                  className="flex-grow h-14 pl-12 pr-32 bg-background/50 border-border/30 focus:ring-primary/50 text-base"
                  disabled={isAiLoading}
                />
                <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4" disabled={isAiLoading}>
                  {isAiLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Memproses
                    </>
                  ) : (
                    <>
                      Tanya AI
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