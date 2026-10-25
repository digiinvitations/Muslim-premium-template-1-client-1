import { motion } from "motion/react";
import { WeddingData } from "../types";

interface ClosingMessageProps {
  data: WeddingData;
}

export function ClosingMessage({ data }: ClosingMessageProps) {
  return (
    <section className="py-24 px-6 bg-[#F9E8EC] relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Top Decorative Wavy Line */}
      <div className="w-full max-w-sm mx-auto mb-10 flex justify-center opacity-80">
        <svg width="200" height="30" viewBox="0 0 200 30" preserveAspectRatio="none">
          <path d="M 0 15 Q 50 15 100 25 T 200 15" fill="none" stroke="#D995A5" strokeWidth="0.8" />
          <circle cx="100" cy="18" r="1.5" fill="#D995A5" />
          <circle cx="92" cy="22" r="1" fill="#D995A5" />
          <circle cx="108" cy="22" r="1" fill="#D995A5" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-md mx-auto flex flex-col items-center relative z-10"
      >
        <p className="font-serif text-lg md:text-xl text-[#9E263D] leading-relaxed drop-shadow-sm mb-8 whitespace-pre-line px-4">
          {data.closingMessage}
        </p>
        
        <h3 className="font-names text-3xl sm:text-4xl font-extrabold text-[#5A0C1E] mt-4 tracking-[0.25em] drop-shadow-sm">
          A &amp; S
        </h3>
        <p className="font-serif text-xs text-[#78132B] font-bold mt-1 tracking-widest uppercase">
          Walima / Reception
        </p>
      </motion.div>

      {/* Bottom Decorative Wavy Line */}
      <div className="w-full max-w-sm mx-auto mt-12 flex justify-center opacity-80">
        <svg width="200" height="30" viewBox="0 0 200 30" preserveAspectRatio="none">
          <path d="M 0 15 Q 50 15 100 5 T 200 15" fill="none" stroke="#D995A5" strokeWidth="0.8" />
          <circle cx="100" cy="12" r="1.5" fill="#D995A5" />
          <circle cx="92" cy="8" r="1" fill="#D995A5" />
          <circle cx="108" cy="8" r="1" fill="#D995A5" />
        </svg>
      </div>
    </section>
  );
}
