import { motion } from "motion/react";
import { Users, User, Sparkles } from "lucide-react";
import { WeddingData } from "../types";
import { HeartDivider } from "./HeartDivider";

interface FamilyDetailsProps {
  data: WeddingData;
}

export function FamilyDetails({ data }: FamilyDetailsProps) {
  const family = data.familyDetails;
  if (!family) return null;

  return (
    <section className="py-16 px-4 sm:px-5 bg-blush-main flex flex-col items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <Users className="w-6 h-6 text-[#78132B] mb-2.5" strokeWidth={1.8} />
        
        <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-widest text-[#5A0C1E] text-center drop-shadow-xs font-bold">
          Family Details
        </h2>
        
        <p className="font-serif italic text-xs text-[#2A161C] mt-1 font-semibold">
          With the love, prayers &amp; blessings of Ansari' Family Reception
        </p>

        <HeartDivider />

        <div className="w-full flex flex-col gap-6 mt-8">
          
          {/* ======================================================== */}
          {/* 1. GROOM'S FAMILY (SYSTEMATIC FORMAT)                     */}
          {/* ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-pink-border/80 shadow-sm text-left relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-1 bg-[#5A0C1E]" />

            {/* Systematic Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-border/50">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FCEBED] text-[#5A0C1E] border border-[#E8C7CD]">
                Groom's Family
              </span>
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#78132B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#78132B]" />
                Blessings
              </span>
            </div>

            {/* Systematic Parents Section */}
            <div className="mb-2">
              <h4 className="text-[10px] font-sans uppercase font-bold tracking-[0.18em] text-[#2A161C] mb-2.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#78132B]" />
                Parents' Details
              </h4>
              
              <div className="bg-[#FAF0F3] p-4 rounded-xl border border-pink-border/60">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#78132B] block mb-1">
                  Father &amp; Mother
                </span>
                <p className="font-serif font-bold text-base sm:text-lg text-[#5A0C1E] leading-snug">
                  {data.groom.parents || "Mrs. Late Mohammed Shakeel uddin Ansari"}
                </p>
                <p className="text-xs text-[#78132B] font-semibold mt-1">
                  {data.groom.education}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* 2. BRIDE'S FAMILY / REFERENCE SECTION                     */}
          {/* ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white/90 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-pink-border/80 shadow-sm text-left relative overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-1 bg-[#5A0C1E]" />

            {/* Systematic Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-border/50">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FCEBED] text-[#5A0C1E] border border-[#E8C7CD]">
                Bride's Side Reference
              </span>
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#78132B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#78132B]" />
                Blessings
              </span>
            </div>

            {/* Systematic Reference Section */}
            <div>
              <h4 className="text-[10px] font-sans uppercase font-bold tracking-[0.18em] text-[#2A161C] mb-2.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#78132B]" />
                Reference Details
              </h4>
              
              <div className="bg-[#FAF0F3] p-4 rounded-xl border border-pink-border/60">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#78132B] block mb-1">
                  Designation / Institution
                </span>
                <p className="font-serif font-bold text-base sm:text-lg text-[#5A0C1E] leading-snug">
                  Sr. Asst. GG college, Nizamabad
                </p>
                <p className="text-xs text-[#78132B] font-semibold mt-1">
                  Ansari' Family Reception
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
