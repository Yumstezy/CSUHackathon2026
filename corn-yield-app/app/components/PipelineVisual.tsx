"use client";

import { Satellite, Thermometer, Database, GitMerge, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: <Satellite className="w-5 h-5" />,
    label: "MODIS + HLS",
    sub: "NASA satellite",
    detail: "NDVI/EVI · 4 stages",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    label: "gridMET + USDM",
    sub: "4km daily weather",
    detail: "GDD · VPD · Drought",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <Database className="w-5 h-5" />,
    label: "gSSURGO Soils",
    sub: "USDA NRCS",
    detail: "NCCPI · AWC · SOC",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fed7aa",
  },
  {
    icon: <GitMerge className="w-5 h-5" />,
    label: "Feature Fusion",
    sub: "merge_all.py",
    detail: "847 counties · 20 yrs",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "XGBoost + KNN",
    sub: "dual-model",
    detail: "Point est. + p10/p90 cone",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
];

export default function PipelineVisual() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Data Pipeline</h2>
      <p className="text-sm text-gray-500 mb-6">
        Five data streams fused into a dual-model forecast — issued 4–8 weeks before USDA official estimates
      </p>

      {/* Pipeline steps */}
      <div className="flex flex-col sm:flex-row items-stretch gap-0">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex sm:flex-col items-center flex-1">
            {/* Card */}
            <div
              className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 rounded-xl border p-3 sm:p-4 w-full text-left sm:text-center flex-1"
              style={{ background: step.bg, borderColor: step.border }}
            >
              <div className="w-10 h-10 min-w-[2.5rem] rounded-xl flex items-center justify-center"
                style={{ background: `${step.color}20`, color: step.color }}>
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{step.label}</p>
                <p className="text-[11px] text-gray-500">{step.sub}</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: step.color }}>{step.detail}</p>
              </div>
            </div>

            {/* Arrow connector (not after last) */}
            {i < STEPS.length - 1 && (
              <div className="flex items-center justify-center px-1 py-2 sm:py-0 sm:px-2 sm:rotate-0 text-gray-300 text-lg font-bold shrink-0">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Timing bar */}
      <div className="mt-5 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="flex-1 flex flex-wrap gap-1 items-center">
          <span className="font-semibold text-gray-700">Forecast timeline:</span>
          {["May: Planting", "Jun: Emergence", "Jul: Silking", "Aug 1: First forecast ↑", "Sep 1: Update", "Oct 1: Update", "USDA Final (Dec)"].map((t, i) => (
            <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${i === 3 ? "bg-green-100 text-green-700 font-bold" : "text-gray-400"}`}>
              {t}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-green-600 font-semibold bg-green-50 border border-green-200 rounded px-2 py-0.5">
          4–8 wk lead
        </span>
      </div>

      {/* Validation note */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
        <span className="font-semibold text-purple-700">Validation split:</span>
        <span>Train 2005–2022 · Val 2023 · Holdout 2024 — no temporal leakage (as-of rule enforced)</span>
      </div>
    </div>
  );
}
