"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

interface CountyMapCardProps {
  county?: string;
  coordinates?: string;
  yieldForecast?: string;
  className?: string;
}

export function CountyMapCard({
  county = "Boone County, IA",
  coordinates = "42.04° N, 93.93° W",
  yieldForecast = "211 bu/ac forecast",
  className,
}: CountyMapCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [8, -8]);
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); setIsHovered(false); }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-md"
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        animate={{ width: isExpanded ? 320 : 220, height: isExpanded ? 260 : 130 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-transparent to-gray-50/40" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-green-50" />
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* Field grid lines */}
                {[25, 50, 75].map((y, i) => (
                  <motion.line key={`h-${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="#16a34a" strokeOpacity={0.15} strokeWidth="1.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} />
                ))}
                {[20, 40, 60, 80].map((x, i) => (
                  <motion.line key={`v-${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke="#16a34a" strokeOpacity={0.15} strokeWidth="1.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} />
                ))}
                {/* Field parcels */}
                {[[10,15,25,30],[40,10,20,25],[60,40,28,22],[15,55,22,28],[70,15,18,20]].map(([x,y,w,h], i) => (
                  <motion.rect key={i} x={`${x}%`} y={`${y}%`} width={`${w}%`} height={`${h}%`}
                    fill="#16a34a" fillOpacity={0.18} rx={2}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }} />
                ))}
              </svg>

              {/* Pin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  style={{ filter: "drop-shadow(0 0 8px rgba(22,163,74,0.6))" }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#16a34a" />
                  <circle cx="12" cy="9" r="2.5" fill="white" />
                </svg>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern when collapsed */}
        <motion.div className="absolute inset-0 opacity-[0.03]" animate={{ opacity: isExpanded ? 0 : 0.03 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="county-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#county-grid)" />
          </svg>
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          <div className="flex items-start justify-between">
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" className="text-green-600"
              animate={{ opacity: isExpanded ? 0 : 1 }}>
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </motion.svg>
            <motion.div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200"
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-medium text-green-700 uppercase tracking-wide">Live</span>
            </motion.div>
          </div>

          <div className="space-y-0.5">
            <motion.h3 className="text-gray-900 font-semibold text-sm" animate={{ x: isHovered ? 3 : 0 }} transition={{ type: "spring", stiffness: 400 }}>
              {county}
            </motion.h3>
            <AnimatePresence>
              {isExpanded && (
                <motion.p className="text-gray-500 text-xs font-mono"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-green-700 text-xs font-semibold">{yieldForecast}</p>
            <motion.div className="h-px bg-gradient-to-r from-green-500/50 via-green-400/30 to-transparent"
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              style={{ originX: 0 }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </motion.div>

      <motion.p className="absolute -bottom-5 left-1/2 text-[10px] text-gray-400 whitespace-nowrap"
        style={{ x: "-50%" }}
        animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered ? 0 : 4 }}>
        Click to expand
      </motion.p>
    </motion.div>
  );
}
