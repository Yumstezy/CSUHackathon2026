"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle { id: number; x: number; y: number; size: number; delay: number; dur: number }

interface SparklesProps {
  className?: string;
  color?: string;
  density?: number;
}

export function Sparkles({ className = "", color = "#FFFFFF", density = 60 }: SparklesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: density }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.4,
        delay: Math.random() * 6,
        dur: Math.random() * 4 + 3,
      }))
    );
  }, [density]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: color }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
