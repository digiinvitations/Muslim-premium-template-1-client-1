import { motion } from "motion/react";
import { WeddingData } from "../types";

interface InvitationMessageProps {
  message?: string;
  data?: WeddingData;
  isHeroEnded?: boolean;
}

export function InvitationMessage({ message, data, isHeroEnded }: InvitationMessageProps) {
  const quranicArabic = data?.quranicVerse?.arabic || "وَخَلَقْنَـٰكُمْ\nأَزْوَٰجًۭا";
  const quranicTranslation = data?.quranicVerse?.translation || "And We created you in pairs";
  const rawCustomText = data?.customText || "";
  const customText = (!rawCustomText || rawCustomText === "(JM)" || rawCustomText.includes("JM")) ? "A & S" : rawCustomText;
  const invitationMsg = message || data?.invitationMessage || "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ\nMay Allah bless this union with love, barakah, and happiness.\nWe cordially invite you and your family to grace the auspicious occasion of the Walima / Reception dinner from the Groom's side.";

  // Separate Arabic and English in invitation message if newline separated
  const lines = invitationMsg.split("\n");
  const arabicLine = lines[0] || "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ";
  const englishLine = lines.slice(1).join("\n") || "May Allah bless this union with love, barakah, and happiness.\nWe cordially invite you to celebrate the Walima / Reception dinner from the Groom's side.";

  return (
    <section className="relative px-6 pt-28 pb-20 bg-[#FCF5F6] flex flex-col items-center text-center">
      <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/70 via-[#FAF0F3]/30 to-transparent pointer-events-none transition-opacity duration-1000 z-0 ${isHeroEnded ? 'opacity-100' : 'opacity-0'}`} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-md mx-auto flex flex-col items-center relative z-10 w-full"
      >
        {/* Top Decorative Motif */}
        <div className="flex items-center justify-center w-full gap-4 mb-6">
          <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D9A6B2]" />
          <span className="text-[#8F1736] text-xs font-serif tracking-widest opacity-80">﷽</span>
          <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D9A6B2]" />
        </div>

        {/* 1. QURANIC VERSE */}
        <div className="flex flex-col items-center mb-8 px-4">
          <p 
            dir="rtl" 
            className="font-serif text-2xl md:text-3xl text-[#8F1736] font-bold leading-relaxed whitespace-pre-line tracking-wide drop-shadow-xs"
            style={{ fontFamily: "'Amiri', 'Cormorant Garamond', serif" }}
          >
            {quranicArabic}
          </p>
          <p className="font-serif italic text-base md:text-lg text-[#8F1736]/90 mt-2 tracking-wide font-medium">
            "{quranicTranslation}"
          </p>
          <span className="text-[10px] uppercase font-serif tracking-[0.25em] text-[#8F1736]/60 mt-1">
            Surah An-Naba • 78:8
          </span>
        </div>

        {/* 2. CUSTOM A & S MONOGRAM EMBLEM */}
        <div className="flex items-center justify-center my-6">
          {data?.jmLogoUrl && data.jmLogoUrl.trim() !== "" ? (
            <div className="relative flex items-center justify-center p-2 group w-full">
              <img 
                src={data.jmLogoUrl} 
                alt="A&S Monogram Logo" 
                style={{
                  height: `${data.logoSize || 240}px`,
                  maxHeight: `${data.logoSize || 240}px`,
                  maxWidth: "100%",
                  width: "auto"
                }}
                className="object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-105" 
              />
            </div>
          ) : (
            <div className="relative px-8 py-5 rounded-3xl border-2 border-[#D9A6B2] bg-gradient-to-b from-white/95 to-[#FAF0F3]/90 shadow-md flex flex-col items-center justify-center">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold tracking-[0.25em] text-[#8F1736] pl-2">
                {customText}
              </span>
              <span className="text-[10px] uppercase font-serif tracking-[0.3em] text-[#8F1736]/70 mt-1 font-semibold">
                Walima • Reception
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center w-full gap-4 my-6">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D9A6B2]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8F1736]/60" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D9A6B2]" />
        </div>

        {/* 3. WEDDING INVITATION MESSAGE */}
        <div className="flex flex-col items-center px-4">
          <p 
            dir="rtl" 
            className="font-serif text-xl md:text-2xl text-[#8F1736] font-bold leading-relaxed tracking-wide mb-3"
            style={{ fontFamily: "'Amiri', 'Cormorant Garamond', serif" }}
          >
            {arabicLine}
          </p>
          <p className="font-serif text-base md:text-lg text-[#8F1736] leading-relaxed italic opacity-95 max-w-sm whitespace-pre-line">
            {englishLine}
          </p>
        </div>

        {/* Bottom Decorative Motif */}
        <div className="flex items-center justify-center w-full gap-4 mt-8">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D9A6B2]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8F1736]/60" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D9A6B2]" />
        </div>
      </motion.div>
    </section>
  );
}
