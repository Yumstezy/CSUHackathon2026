"use client";
import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Milestone {
  id: number;
  name: string;
  status: "complete" | "in-progress" | "pending";
  position: { top?: string; left?: string; right?: string; bottom?: string };
}

interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  milestones: Milestone[];
}

const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
  const colors = {
    complete:    "bg-green-500 border-green-600",
    "in-progress": "bg-blue-500 border-blue-600",
    pending:     "bg-gray-300 border-gray-400",
  };
  const labels = {
    complete:    "text-green-700 bg-green-50  border-green-200",
    "in-progress": "text-blue-700  bg-blue-50   border-blue-200",
    pending:     "text-gray-500  bg-gray-50   border-gray-200",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: milestone.id * 0.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.8 }}
      className="absolute flex items-center gap-3"
      style={milestone.position}
    >
      <div className="relative flex h-7 w-7 items-center justify-center shrink-0">
        <div className={cn("absolute h-3 w-3 rounded-full border-2", colors[milestone.status],
          milestone.status === "in-progress" && "animate-pulse")} />
        <div className="absolute h-full w-full rounded-full bg-green-500/10" />
      </div>
      <div className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm whitespace-nowrap", labels[milestone.status])}>
        {milestone.name}
      </div>
    </motion.div>
  );
};

export const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
  ({ className, milestones, ...props }, _ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
    const rawLength = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);
    const pathLength = useSpring(rawLength, { stiffness: 400, damping: 80 });

    return (
      <div ref={targetRef} className={cn("relative w-full mx-auto", className)} {...props}>
        <div className="relative h-[320px] sm:h-[380px]">
          <svg width="100%" height="100%" viewBox="0 0 800 380" preserveAspectRatio="none"
            className="absolute top-0 left-0">
            {/* Ghost path */}
            <path d="M 40 320 C 180 60 320 300 480 140 S 680 60 760 120"
              fill="none" stroke="#e5e7eb" strokeWidth="2.5" strokeDasharray="8 5" strokeLinecap="round" />
            {/* Animated path */}
            <motion.path d="M 40 320 C 180 60 320 300 480 140 S 680 60 760 120"
              fill="none" stroke="#16a34a" strokeWidth="3"
              strokeDasharray="8 5" strokeLinecap="round"
              style={{ pathLength }} />
          </svg>
          {milestones.map((m) => <MilestoneMarker key={m.id} milestone={m} />)}
        </div>
      </div>
    );
  }
);
AnimatedRoadmap.displayName = "AnimatedRoadmap";
