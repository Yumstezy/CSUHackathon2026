"use client";

import { modelPerformance } from "../lib/data";

const MAX_MAE = 20;

export default function ModelPerformanceChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Model Iterations</h2>
      <p className="text-sm text-gray-500 mb-5">
        Higher R² and lower MAE = better · LOCO-CV validation
      </p>

      <div className="space-y-5">
        {modelPerformance.map((m, i) => {
          const label = m.model.replace(/\n/g, " ");
          const r2pct  = Math.round(m.r2 * 100);
          const maePct = Math.round((1 - m.mae / MAX_MAE) * 100);
          const isBest = i === modelPerformance.length - 1;
          return (
            <div key={label} className={`rounded-lg p-3 ${isBest ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isBest ? "text-green-800" : "text-gray-600"}`}>
                  {isBest && <span className="mr-1">★</span>}{label}
                </span>
                <div className="flex gap-2 text-xs font-mono">
                  <span className={isBest ? "text-green-700 font-bold" : "text-gray-500"}>R² {m.r2.toFixed(3)}</span>
                  <span className="text-gray-300">·</span>
                  <span className={isBest ? "text-green-700 font-bold" : "text-gray-500"}>{m.mae} bu/ac</span>
                </div>
              </div>
              {/* R² bar */}
              <div className="mb-1.5">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                  <span>R²</span><span>{r2pct}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isBest ? "bg-green-500" : "bg-gray-400"}`}
                    style={{ width: `${r2pct}%` }}
                  />
                </div>
              </div>
              {/* MAE bar (inverted — lower is better) */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                  <span>Accuracy (100 − MAE/20)</span><span>{maePct}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isBest ? "bg-blue-500" : "bg-blue-300"}`}
                    style={{ width: `${maePct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mt-4 text-center">
        Final model: XGBoost · 35 features · LOCO-CV R² 0.789 · MAE 12.5 bu/ac
      </p>
    </div>
  );
}
