import { motion } from "motion/react";
import { Heart, ArrowDown, Sparkles } from "lucide-react";
import { WeddingData } from "../types";
import { useState, useRef, useEffect } from "react";

interface HeroProps {
  data: WeddingData;
  shouldPlayVideo?: boolean;
  onVideoEnd?: () => void;
}

export function Hero({ data, shouldPlayVideo = true, onVideoEnd }: HeroProps) {
  const [showText, setShowText] = useState(!data.heroVideoUrl);
  const [isEnded, setIsEnded] = useState(!data.heroVideoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [shouldPlayVideo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime } = videoRef.current;
      if (currentTime >= 2) {
        if (!showText) setShowText(true);
      }
    }
  };

  const handleEnded = () => {
    setIsEnded(true);
    setShowText(true);
    if (onVideoEnd) onVideoEnd();
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#FCF5F6]">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0 bg-[#FCF5F6]">
        {data.heroVideoUrl ? (
          <video
            ref={videoRef}
            src={data.heroVideoUrl}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
          />
        )}
        
        {/* Dynamic Light/White Shade Overlay */}
        <div className={`absolute inset-0 bg-white/25 transition-opacity duration-1000 ${data.heroVideoUrl && !showText ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Slightly white theme when ended */}
        {data.heroVideoUrl && (
          <div className={`absolute inset-0 bg-white/35 backdrop-blur-[0.5px] transition-opacity duration-1000 ${isEnded ? 'opacity-100' : 'opacity-0'}`} />
        )}

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#FCF5F6] to-transparent pointer-events-none z-10" />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-md mx-auto pt-12 pb-6 h-full min-h-[100svh] transition-opacity duration-1000 ${showText ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#8F1736] text-sm font-serif">﷽</span>
            </div>

            <p className="font-serif text-wine-dark text-[13px] sm:text-[14px] italic mb-3 max-w-[300px] leading-relaxed opacity-95 whitespace-pre-line font-medium drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              {data.heroMessage}
            </p>
            
            <div className="flex items-center justify-center gap-3 opacity-60 mb-5">
              <div className="h-[1px] w-12 bg-wine-dark/40"></div>
              <Heart className="w-3 h-3 text-burgundy fill-burgundy" />
              <div className="h-[1px] w-12 bg-wine-dark/40"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showText ? 1 : 0, scale: showText ? 1 : 0.95 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-col items-center justify-center w-full bg-white/70 backdrop-blur-xs p-6 rounded-3xl border border-pink-border/60 shadow-lg my-2"
          >
            {/* Monogram Initials Badge */}
            <div className="mb-3 px-5 py-1.5 rounded-full border border-pink-border bg-white shadow-2xs text-[#78132B] font-serif font-extrabold text-sm sm:text-base tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8F1736]" />
              <span>A &amp; S</span>
              <Sparkles className="w-3.5 h-3.5 text-[#8F1736]" />
            </div>

            {/* Groom Name with refined serif & calligraphy styling */}
            <h1 className="font-names text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#5A0C1E] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] leading-tight text-center">
              {data.groom.name}
            </h1>
            
            {/* Groom Details */}
            <div className="font-serif text-[12px] sm:text-[13px] text-[#2A161C] flex flex-col items-center gap-1 mt-2 mb-3 font-semibold drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              <p className="italic">{data.groom.parents}</p>
              <p className="font-bold text-[#78132B]">{data.groom.education}</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 my-1">
              <div className="h-[1px] w-8 bg-[#8F1736]/30"></div>
              <span className="font-names italic text-2xl sm:text-3xl text-[#78132B] font-bold">&amp;</span>
              <div className="h-[1px] w-8 bg-[#8F1736]/30"></div>
            </div>
            
            {/* Bride Details: Sr. Asst. GG college, Nizamabad with refined typography */}
            <div className="font-serif flex flex-col items-center gap-1 mt-2 font-semibold text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8F1736] font-bold">
                Bride's Family Reference
              </span>
              <p className="font-names font-extrabold text-2xl sm:text-3xl text-[#5A0C1E] tracking-wide mt-0.5 text-center">
                Sr. Asst. GG college, Nizamabad
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 0.8 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-4 flex flex-col items-center"
        >
          <span className="text-[10px] font-serif text-wine-dark uppercase tracking-[0.3em] mb-2 font-semibold">Scroll (A &amp; S)</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-wine-dark" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
