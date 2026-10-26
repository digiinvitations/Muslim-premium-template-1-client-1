import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { HeartDivider } from "./HeartDivider";
import { EventDetails, VenueDetails, WeddingData } from "../types";
import { Calendar, Clock, MapPin, CalendarHeart, Sparkles, Utensils, Heart, ExternalLink, CalendarPlus } from "lucide-react";

interface TimelineProps {
  events?: EventDetails[];
  venue?: VenueDetails;
  data?: WeddingData;
}

// Custom Blooming Lotus SVG Component with customizable theme color
function LotusGlyph({ className = "w-5 h-5", color = "#8F1736" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Petals */}
      <path d="M50 20 C42 35 30 55 15 65 C30 70 42 66 50 60 Z" fill={color} opacity="0.75" />
      <path d="M50 20 C58 35 70 55 85 65 C70 70 58 66 50 60 Z" fill={color} opacity="0.75" />
      {/* Mid Petals */}
      <path d="M50 15 C44 32 35 52 24 62 C38 65 46 62 50 56 Z" fill={color} opacity="0.88" />
      <path d="M50 15 C56 32 65 52 76 62 C62 65 54 62 50 56 Z" fill={color} opacity="0.88" />
      {/* Center Petal */}
      <path d="M50 8 C43 25 43 45 50 62 C57 45 57 25 50 8 Z" fill={color} />
      {/* Base */}
      <path d="M22 68 C35 74 65 74 78 68 C72 73 50 76 22 68 Z" fill={color} opacity="0.9" />
      <circle cx="50" cy="58" r="3" fill="#FFF9F8" />
    </svg>
  );
}

// Color palettes for systematic timeline milestones
const COLOR_THEMES = [
  {
    name: "emerald",
    primary: "#047857", // Emerald 700
    primaryDark: "#064E3B",
    badgeBg: "bg-emerald-700",
    badgeText: "text-white",
    cardBg: "bg-gradient-to-br from-emerald-50/95 via-white to-emerald-50/40",
    border: "border-emerald-300",
    shadow: "shadow-[0_4px_20px_rgba(4,120,87,0.12)]",
    pillBg: "bg-emerald-100/80",
    pillText: "text-emerald-900",
    pillBorder: "border-emerald-300",
    tagBg: "bg-emerald-700 text-white",
    iconBg: "bg-emerald-600 text-white",
    accentLight: "#ECFDF5",
    accentColor: "#059669",
    mapBtnBg: "bg-emerald-700 hover:bg-emerald-800 text-white",
    glyphColor: "#047857",
  },
  {
    name: "amber",
    primary: "#B45309", // Amber 700
    primaryDark: "#78350F",
    badgeBg: "bg-amber-600",
    badgeText: "text-white",
    cardBg: "bg-gradient-to-br from-amber-50/95 via-white to-amber-50/40",
    border: "border-amber-300",
    shadow: "shadow-[0_4px_20px_rgba(180,83,9,0.14)]",
    pillBg: "bg-amber-100/80",
    pillText: "text-amber-950",
    pillBorder: "border-amber-300",
    tagBg: "bg-amber-600 text-white",
    iconBg: "bg-amber-600 text-white",
    accentLight: "#FFFBEB",
    accentColor: "#D97706",
    mapBtnBg: "bg-amber-700 hover:bg-amber-800 text-white",
    glyphColor: "#B45309",
  },
  {
    name: "burgundy",
    primary: "#8F1736", // Velvet Burgundy
    primaryDark: "#5A0C1E",
    badgeBg: "bg-[#8F1736]",
    badgeText: "text-white",
    cardBg: "bg-gradient-to-br from-pink-50/95 via-white to-rose-50/40",
    border: "border-pink-300",
    shadow: "shadow-[0_4px_20px_rgba(143,23,54,0.14)]",
    pillBg: "bg-pink-100/80",
    pillText: "text-[#5A0C1E]",
    pillBorder: "border-pink-300",
    tagBg: "bg-[#8F1736] text-white",
    iconBg: "bg-[#8F1736] text-white",
    accentLight: "#FDF2F8",
    accentColor: "#8F1736",
    mapBtnBg: "bg-[#8F1736] hover:bg-[#70102A] text-white",
    glyphColor: "#8F1736",
  },
  {
    name: "sapphire",
    primary: "#1D4ED8", // Sapphire Blue
    primaryDark: "#1E3A8A",
    badgeBg: "bg-blue-700",
    badgeText: "text-white",
    cardBg: "bg-gradient-to-br from-blue-50/95 via-white to-sky-50/40",
    border: "border-blue-300",
    shadow: "shadow-[0_4px_20px_rgba(29,78,216,0.12)]",
    pillBg: "bg-blue-100/80",
    pillText: "text-blue-950",
    pillBorder: "border-blue-300",
    tagBg: "bg-blue-700 text-white",
    iconBg: "bg-blue-600 text-white",
    accentLight: "#EFF6FF",
    accentColor: "#2563EB",
    mapBtnBg: "bg-blue-700 hover:bg-blue-800 text-white",
    glyphColor: "#1D4ED8",
  }
];

interface MilestoneItem {
  id: string;
  stepNumber: string;
  category: string;
  title: string;
  time: string;
  date: string;
  location: string;
  description: string;
  mapUrl?: string;
  iconType: "arrival" | "dinner" | "blessings" | "general";
}

export function Timeline({ events = [], venue, data }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the timeline section for the sliding lotus
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"]
  });

  // Smooth physics for fluid lotus sliding down the central line
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 18,
    restDelta: 0.001
  });

  // Calculate sliding lotus vertical position along the central vertical line (0% to ~96%)
  const lotusTop = useTransform(smoothProgress, [0, 1], ["0%", "96%"]);
  const filledLineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Resolve venue location & map link
  const defaultVenueName = venue?.name || "AN garden function hall";
  const defaultAddress = venue?.addressLine1 ? `${venue.name}, ${venue.addressLine1}` : "AN garden function hall, Bodhan road, Nizamabad";
  const defaultMapUrl = venue?.mapUrl || "https://maps.app.goo.gl/9Huqs6AgPSZnkMQf9";
  const defaultDate = data?.weddingDateFormatted || "15 Nov 2026, 4th Jamadi us Sani 1448 Hijri";
  const defaultDay = data?.weddingDayFormatted || "Sunday";

  // Build systematic milestones
  let milestones: MilestoneItem[] = [];

  // If only 1 general event (or no events), generate the 3 systematic Islamic Valima / Reception milestones
  if (events.length <= 1) {
    milestones = [
      {
        id: "m1",
        stepNumber: "01",
        category: "Welcoming • Istiqbaal",
        title: "Guest Arrival & Reception Gathering",
        time: "9:00 PM",
        date: `${defaultDay}, ${defaultDate}`,
        location: defaultAddress,
        description: "Warm and cordial welcome of honored guests and families celebrating the blessed union from the Groom's side.",
        mapUrl: defaultMapUrl,
        iconType: "arrival"
      },
      {
        id: "m2",
        stepNumber: "02",
        category: "Auspicious Feast • Dawat-e-Valima",
        title: "Grand Valima Dinner Feast",
        time: "9:30 PM Onwards",
        date: `${defaultDay}, ${defaultDate}`,
        location: `${defaultVenueName} (Main Dining Area)`,
        description: "Sumptuous and traditional Valima dinner feast serving celebratory royal delicacies in honor of our esteemed guests.",
        mapUrl: defaultMapUrl,
        iconType: "dinner"
      },
      {
        id: "m3",
        stepNumber: "03",
        category: "Dua & Blessings • Mubarakbaad",
        title: "Meet the Groom & Heartfelt Prayers",
        time: "10:30 PM",
        date: `${defaultDay}, ${defaultDate}`,
        location: `${defaultVenueName} (Reception Stage)`,
        description: "Stage gathering for heartfelt duas, congratulatory Mubarakbaad greetings, and photos with Mohammed Azeez uddin Ansari.",
        mapUrl: defaultMapUrl,
        iconType: "blessings"
      }
    ];
  } else {
    // If user has customized multiple events in Admin, map each systematically with colorful themes
    milestones = events.map((ev, idx) => {
      const stepNum = String(idx + 1).padStart(2, "0");
      let iconType: MilestoneItem["iconType"] = "general";
      const lowerTitle = (ev.title || "").toLowerCase();
      if (lowerTitle.includes("arrival") || lowerTitle.includes("welcome") || lowerTitle.includes("gathering")) {
        iconType = "arrival";
      } else if (lowerTitle.includes("dinner") || lowerTitle.includes("feast") || lowerTitle.includes("valima") || lowerTitle.includes("lunch")) {
        iconType = "dinner";
      } else if (lowerTitle.includes("dua") || lowerTitle.includes("blessing") || lowerTitle.includes("meet") || lowerTitle.includes("nikah")) {
        iconType = "blessings";
      }

      return {
        id: ev.id || `ev-${idx}`,
        stepNumber: stepNum,
        category: `Phase ${stepNum}`,
        title: ev.title || "Wedding Program",
        time: ev.time || "9:00 PM",
        date: ev.date || defaultDate,
        location: ev.location || defaultAddress,
        description: ev.description || "Celebrating this auspicious milestone together.",
        mapUrl: ev.mapUrl || defaultMapUrl,
        iconType
      };
    });
  }

  const renderIcon = (type: MilestoneItem["iconType"], colorClass: string) => {
    switch (type) {
      case "arrival":
        return <Sparkles className="w-4 h-4 text-white" />;
      case "dinner":
        return <Utensils className="w-4 h-4 text-white" />;
      case "blessings":
        return <Heart className="w-4 h-4 text-white" fill="currentColor" />;
      default:
        return <CalendarHeart className="w-4 h-4 text-white" />;
    }
  };

  return (
    <section 
      ref={containerRef}
      className="py-16 px-3 sm:px-6 bg-gradient-to-b from-[#FCF5F6] via-[#FAF0F3] to-[#FCF5F6] flex flex-col items-center overflow-hidden relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl flex flex-col items-center"
      >
        {/* Systematic Program Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-pink-border/80 shadow-xs mb-3">
          <CalendarHeart className="w-3.5 h-3.5 text-[#8F1736]" />
          <span className="font-serif text-[11px] font-bold uppercase tracking-widest text-[#8F1736]">
            Systematic Schedule
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-script text-4xl sm:text-5xl text-[#5A0C1E] text-center drop-shadow-xs">
          Program Timeline
        </h2>
        <p className="font-serif text-xs text-[#5A0C1E]/75 tracking-wider uppercase mt-1 mb-2">
          Valima / Reception Ceremony Milestones
        </p>
        
        <HeartDivider />

        {/* TIMELINE CONTAINER */}
        <div className="w-full mt-10 relative">
          
          {/* Central Stem Line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D1E7DD] via-[#FDE68A] to-[#FCEBED] rounded-full transform sm:-translate-x-1/2 z-0 shadow-inner" />
          
          {/* Active Progress Fill on Central Line with Dynamic Gradient */}
          <motion.div 
            style={{ height: filledLineHeight }}
            className="absolute left-6 sm:left-1/2 top-0 w-1 bg-gradient-to-b from-[#047857] via-[#B45309] to-[#8F1736] rounded-full transform sm:-translate-x-1/2 origin-top z-0 shadow-[0_0_12px_rgba(180,83,9,0.5)]"
          />

          {/* SLIDING LOTUS: Slides smoothly along the timeline while user scrolls */}
          <motion.div
            style={{ top: lotusTop }}
            className="absolute left-6 sm:left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.12, 1],
                rotate: [0, 4, -4, 0]
              }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-white border-2 border-[#8F1736] shadow-[0_0_16px_rgba(143,23,54,0.45)] flex items-center justify-center p-1.5"
            >
              <LotusGlyph className="w-full h-full" color="#8F1736" />
            </motion.div>
          </motion.div>

          {/* MILESTONE CARDS */}
          <div className="flex flex-col gap-10">
            {milestones.map((item, index) => {
              const theme = COLOR_THEMES[index % COLOR_THEMES.length];
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, delay: index * 0.12, type: "spring", bounce: 0.2 }}
                  className="relative w-full flex items-start pl-14 sm:pl-0"
                >
                  {/* Spine Node Marker with Theme Color Glow */}
                  <div 
                    className="absolute left-6 sm:left-1/2 top-6 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 shadow-md z-10 transition-transform duration-300 hover:scale-110"
                    style={{ borderColor: theme.primary }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {renderIcon(item.iconType, "")}
                    </div>
                  </div>
                  
                  {/* Systematic Milestone Card */}
                  <div className={`w-full sm:w-[46%] ${isEven ? 'sm:mr-auto sm:pr-4' : 'sm:ml-auto sm:pl-4'}`}>
                    <div className={`${theme.cardBg} ${theme.border} border-2 rounded-2xl p-4 sm:p-5 ${theme.shadow} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden backdrop-blur-xs`}>
                      
                      {/* Top Header Row: Step Pill + Category */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/5">
                        <div className="flex items-center gap-1.5">
                          <span className={`${theme.badgeBg} ${theme.badgeText} text-[10px] sm:text-[11px] font-sans font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs`}>
                            Step {item.stepNumber}
                          </span>
                          <span 
                            className="font-serif text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{ color: theme.primary, backgroundColor: theme.accentLight }}
                          >
                            {item.category}
                          </span>
                        </div>

                        {/* Bold Time Badge */}
                        <div 
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans tracking-wide shadow-2xs"
                          style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                        >
                          <Clock className="w-3 h-3 text-white" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="font-serif font-bold text-base sm:text-lg mt-3 mb-2 leading-snug tracking-wide"
                        style={{ color: theme.primaryDark }}
                      >
                        {item.title}
                      </h3>

                      {/* Systematic Metadata Pills (Date & Location) */}
                      <div className="flex flex-col gap-2 my-3 font-serif text-xs">
                        
                        {/* Date Pill */}
                        <div className={`flex items-center gap-2 ${theme.pillBg} ${theme.pillBorder} border px-2.5 py-1.5 rounded-lg shadow-2xs`}>
                          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                          <span className={`font-bold text-[11.5px] sm:text-xs ${theme.pillText} tracking-wide`}>
                            {item.date}
                          </span>
                        </div>

                        {/* Location Pill */}
                        <div className={`flex items-start gap-2 bg-white/80 border border-black/10 px-2.5 py-1.5 rounded-lg shadow-2xs`}>
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.primary }} />
                          <span className="font-semibold text-[11px] sm:text-xs text-stone-800 leading-tight">
                            {item.location}
                          </span>
                        </div>

                      </div>

                      {/* Description / Significance */}
                      {item.description && (
                        <p className="text-[11.5px] sm:text-xs text-stone-700 font-serif leading-relaxed italic bg-white/60 p-2.5 rounded-lg border border-black/5 mt-2">
                          "{item.description}"
                        </p>
                      )}

                      {/* Quick Interactive Actions */}
                      <div className="mt-3.5 pt-2.5 border-t border-black/5 flex items-center gap-2">
                        {item.mapUrl && (
                          <a
                            href={item.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-serif text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs ${theme.mapBtnBg} flex-1`}
                          >
                            <MapPin className="w-3 h-3" />
                            <span>View Location Map</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                          </a>
                        )}

                        <a
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.title)}&details=${encodeURIComponent(item.description)}&location=${encodeURIComponent(item.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg font-serif text-[11px] font-bold uppercase tracking-wider bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 transition-colors shadow-2xs"
                          title="Save to Google Calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-stone-600" />
                          <span>Remind</span>
                        </a>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Systematic Summary Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 w-full p-4 rounded-xl bg-white/95 border border-[#D9A6B2]/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8F1736] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarHeart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#5A0C1E]">
                Valima / Reception Gathering from Groom's Side
              </h4>
              <p className="font-serif text-[11px] text-[#5A0C1E]/75">
                Sunday, 15 Nov 2026 • AN garden function hall, Nizamabad
              </p>
            </div>
          </div>
          <a
            href={defaultMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#8F1736] hover:bg-[#70102A] text-white text-[11px] font-serif font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
}
