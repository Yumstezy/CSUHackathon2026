"use client";

import { motion } from "framer-motion";

const ORBS = [
  { left: "-5%",  top: "-30%", size: 380, opacity: 0.06, delay: 0,   dur: 9  },
  { left: "55%",  top: "-20%", size: 260, opacity: 0.05, delay: 1.8, dur: 11 },
  { left: "78%",  top: "45%",  size: 220, opacity: 0.05, delay: 3.5, dur: 8  },
  { left: "15%",  top: "65%",  size: 190, opacity: 0.04, delay: 2.2, dur: 10 },
];

const DOTS = [
  { left: "8%",  top: "18%", size: 3,   delay: 0,   dur: 7  },
  { left: "22%", top: "72%", size: 2,   delay: 1.1, dur: 9  },
  { left: "38%", top: "38%", size: 2.5, delay: 2.4, dur: 6  },
  { left: "52%", top: "12%", size: 2,   delay: 0.6, dur: 8  },
  { left: "67%", top: "62%", size: 3,   delay: 1.7, dur: 7  },
  { left: "82%", top: "28%", size: 2,   delay: 3.1, dur: 9  },
  { left: "91%", top: "78%", size: 1.5, delay: 0.9, dur: 6  },
  { left: "4%",  top: "52%", size: 2,   delay: 2.8, dur: 8  },
  { left: "48%", top: "88%", size: 2.5, delay: 1.3, dur: 7  },
  { left: "73%", top: "8%",  size: 2,   delay: 0.4, dur: 10 },
  { left: "30%", top: "22%", size: 1.5, delay: 2.0, dur: 8  },
  { left: "60%", top: "48%", size: 2,   delay: 0.7, dur: 9  },
];

export default function AnimatedHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `rgba(255,255,255,${orb.opacity})`,
          }}
          animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
          transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {DOTS.map((dot, i) => (
        <motion.div
          key={`d${i}`}
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -14, 0] }}
          transition={{ duration: dot.dur, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
