"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Data ────────────────────────────────────────────────────────────────────
const STATES = ["Iowa", "Nebraska", "Wisconsin", "Missouri", "Colorado"];
const STATE_CODES = ["IA", "NE", "WI", "MO", "CO"];
// Rows displayed top→bottom: October first (most recent/final forecast) to May (early season)
const MONTHS = ["Oct", "Sep", "Aug", "Jul", "Jun", "May"];

// Yield-signal intensity 0–30 (NDVI + GDD + VPD composite; 30 = optimal)
// Columns = states (IA, NE, WI, MO, CO), rows = months (Oct…May)
const SIGNAL_BY_YEAR: Record<string, number[][]> = {
  "2025 Season": [
    // IA   NE   WI   MO   CO
    [  28,  25,  22,  19,  24 ],  // Oct
    [  26,  23,  20,  17,  22 ],  // Sep
    [  30,  28,  25,  22,  27 ],  // Aug
    [  24,  21,  18,  15,  22 ],  // Jul
    [  15,  13,  14,  11,  10 ],  // Jun
    [   8,   7,   9,   6,   5 ],  // May
  ],
  "2024 Season": [
    [  26,  23,  20,  16,  21 ],  // Oct
    [  24,  21,  18,  14,  20 ],  // Sep
    [  27,  25,  22,  18,  24 ],  // Aug
    [  21,  19,  16,  12,  19 ],  // Jul
    [  13,  11,  12,   9,   9 ],  // Jun
    [   7,   6,   8,   5,   4 ],  // May
  ],
  "2023 Season": [
    [  22,  20,  17,  13,  18 ],  // Oct
    [  20,  18,  15,  11,  17 ],  // Sep
    [  24,  22,  19,  15,  21 ],  // Aug
    [  18,  16,  13,  10,  16 ],  // Jul
    [  11,  10,  10,   8,   8 ],  // Jun
    [   6,   5,   7,   4,   4 ],  // May
  ],
};

const MAX_SIGNAL = 30;

function signalColor(v: number): string {
  const t = v / MAX_SIGNAL;
  if (t < 0.2) return "#713f12";   // very low — brown
  if (t < 0.38) return "#ca8a04";  // low — amber-600
  if (t < 0.55) return "#eab308";  // medium-low — yellow-500
  if (t < 0.72) return "#a3e635";  // medium-high — lime-400
  if (t < 0.88) return "#22c55e";  // high — green-500
  return "#16a34a";                 // peak — green-700
}

// ── Hex geometry (pointy-top) ─────────────────────────────────────────────
const R = 19;                          // vertex radius
const HW = Math.sqrt(3) * R;          // hex width ≈ 32.9
const HH = 2 * R;                     // hex height = 38
const COL_GAP = HW + 2;               // horizontal column spacing
const ROW_GAP = HH * 0.75 + 1;        // vertical row spacing for pointy-top tiling

const COLS = STATES.length;           // 5
const ROWS = MONTHS.length;           // 6
const ODD_OFFSET = HH * 0.5;         // stagger odd columns down

const MARGIN_X = R + 4;
const MARGIN_Y = R + 4;

const SVG_W = (COLS - 1) * COL_GAP + HW + MARGIN_X * 2;
const SVG_H = (ROWS - 1) * ROW_GAP + ODD_OFFSET + HH + MARGIN_Y * 2;

function hexPoints(cx: number, cy: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 + 30) * (Math.PI / 180); // pointy-top: first vertex at 30°
    return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function hexCenter(col: number, row: number): [number, number] {
  const x = MARGIN_X + col * COL_GAP + HW / 2;
  const y = MARGIN_Y + row * ROW_GAP + R + (col % 2 === 1 ? ODD_OFFSET : 0);
  return [x, y];
}

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ end, duration = 1.8 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.round(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <>{val.toLocaleString()}</>;
}

const YEAR_STATS: Record<string, { peakCounties: number; peakChange: string; peakNote: string; r2: string; mae: string }> = {
  "2025 Season": { peakCounties: 312, peakChange: "↑ 8%", peakNote: "vs 289 counties in 2024", r2: "0.724", mae: "9.2 bu/ac" },
  "2024 Season": { peakCounties: 289, peakChange: "↑ 4%", peakNote: "vs 277 counties in 2023", r2: "0.701", mae: "10.1 bu/ac" },
  "2023 Season": { peakCounties: 277, peakChange: "↓ 2%", peakNote: "vs 283 counties in 2022", r2: "0.688", mae: "11.4 bu/ac" },
};

// ── Main component ─────────────────────────────────────────────────────────
export default function HexagonYieldHeatmap() {
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(null);
  const [timeRange, setTimeRange] = useState("2025 Season");

  const SIGNAL = SIGNAL_BY_YEAR[timeRange] ?? SIGNAL_BY_YEAR["2025 Season"];
  const ystats = YEAR_STATS[timeRange] ?? YEAR_STATS["2025 Season"];

  const metrics = [
    { label: "Model R² Score",      value: ystats.r2,  up: true  },
    { label: "Mean Absolute Error", value: `${ystats.mae}`, up: false },
    { label: "Counties Analyzed",   value: "847",       up: true  },
  ];

  return (
    <div className="flex flex-col justify-between bg-gray-900 rounded-2xl overflow-hidden text-white w-full max-w-[600px]"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>

      {/* Header */}
      <div className="flex justify-between items-center px-7 pt-6 pb-4">
        <h3 className="text-2xl font-bold">Yield Signal Heatmap</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-sm focus:outline-none border border-gray-700"
        >
          <option>2025 Season</option>
          <option>2024 Season</option>
          <option>2023 Season</option>
        </select>
      </div>

      {/* Hex grid */}
      <div className="px-4 pb-2">
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: "block" }}>
          {/* X-axis labels (states) */}
          {STATES.map((s, col) => {
            const [cx] = hexCenter(col, 0);
            return (
              <text key={s} x={cx} y={14} textAnchor="middle" fontSize={9}
                fontWeight="600" fill="#9ca3af" fontFamily="system-ui">
                {STATE_CODES[col]}
              </text>
            );
          })}

          {/* Y-axis labels (months) */}
          {MONTHS.map((m, row) => {
            const [, cy] = hexCenter(0, row);
            return (
              <text key={m} x={8} y={cy + 3.5} textAnchor="middle" fontSize={9}
                fontWeight="600" fill="#9ca3af" fontFamily="system-ui">
                {m}
              </text>
            );
          })}

          {/* Hexagons */}
          {SIGNAL.map((rowData, row) =>
            rowData.map((val, col) => {
              const [cx, cy] = hexCenter(col, row);
              const isHovered = hovered?.col === col && hovered?.row === row;
              const color = signalColor(val);
              return (
                <g key={`${col}-${row}`}
                  onMouseEnter={() => setHovered({ col, row })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  <motion.polygon
                    points={hexPoints(cx, cy)}
                    fill={color}
                    stroke="#111827"
                    strokeWidth={1.5}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: isHovered ? 1.12 : 1,
                      filter: isHovered ? `drop-shadow(0 0 6px ${color})` : "none",
                    }}
                    transition={{ delay: (col * ROWS + row) * 0.03, duration: 0.35 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                  {/* Signal value label */}
                  <motion.text
                    x={cx} y={cy + 3.5}
                    textAnchor="middle" fontSize={8} fontWeight="700"
                    fill="rgba(0,0,0,0.55)" fontFamily="monospace"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: (col * ROWS + row) * 0.03 + 0.2 }}
                  >
                    {val}
                  </motion.text>
                </g>
              );
            })
          )}
        </svg>

        {/* Hover tooltip */}
        <div className="h-6 text-xs text-gray-400 text-center">
          {hovered ? (
            <span>
              <span className="text-white font-semibold">{STATES[hovered.col]}</span>
              {" · "}{MONTHS[hovered.row]}
              {" · signal "}
              <span className="text-green-400 font-bold">{SIGNAL[hovered.row]?.[hovered.col]}</span>
              <span className="text-gray-500">/30</span>
              {" ("}
              {["emergence","vegetative","silking","peak grain fill","maturity","harvest reconciliation"][5 - hovered.row]}
              {")"}
            </span>
          ) : (
            <span>Hover a cell for details · higher = stronger yield signal</span>
          )}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-2 justify-center mt-1 mb-3">
          {[5, 10, 15, 20, 25, 30].map((v) => (
            <div key={v} className="flex flex-col items-center gap-0.5">
              <div className="w-4 h-4 rounded-sm" style={{ background: signalColor(v) }} />
              <span className="text-[9px] text-gray-500">{v}</span>
            </div>
          ))}
          <span className="text-[9px] text-gray-500 ml-1">signal</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex px-7 pb-2 pt-4 border-t border-gray-800 gap-6">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-gray-400 text-sm">Peak-Signal Counties</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-3xl font-bold">
              <Counter end={ystats.peakCounties} />
            </span>
            <span className="text-[11px] bg-green-900/60 text-green-400 border border-green-700 rounded-full px-2 py-0.5 font-semibold">
              {ystats.peakChange}
            </span>
          </div>
          <span className="text-gray-500 text-xs">{ystats.peakNote}</span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-gray-400 text-sm">Total Counties Analyzed</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-3xl font-bold">
              <Counter end={847} duration={2.2} />
            </span>
            <span className="text-[11px] bg-blue-900/60 text-blue-400 border border-blue-700 rounded-full px-2 py-0.5 font-semibold">
              ↓ 4% err
            </span>
          </div>
          <span className="text-gray-500 text-xs">across 5 corn belt states</span>
        </div>
      </div>

      {/* Metric rows */}
      <div className="flex flex-col divide-y divide-gray-800 px-7 pb-5">
        {metrics.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-400 font-mono">{m.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{m.value}</span>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${m.up ? "bg-green-900/60 text-green-400" : "bg-amber-900/60 text-amber-400"}`}>
                {m.up ? "↑" : "↓"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
