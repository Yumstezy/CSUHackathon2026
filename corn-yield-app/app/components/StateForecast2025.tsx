"use client";

import { STATES, STATE_COLORS, stateForecasts2025 } from "../lib/data";

export default function StateForecast2025() {
  const forecasts = STATES.map((s) => stateForecasts2025[s]).filter(Boolean);
  if (!forecasts.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">2025 State Yield Forecasts</h2>
          <p className="text-xs text-gray-400 mt-0.5">XGBoost county-level aggregated · vs USDA 2024 actual</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
          Live Model
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {forecasts.map((f) => {
          const color = STATE_COLORS[f.state];
          const up    = f.delta >= 0;
          return (
            <div
              key={f.state}
              className="rounded-xl border p-4 flex flex-col gap-1"
              style={{ borderColor: `${color}40`, background: `${color}08` }}
            >
              {/* State name */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color }}>{f.state}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${up ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"}`}>
                  {up ? "↑" : "↓"} {Math.abs(f.delta)} bu/ac
                </span>
              </div>

              {/* Big prediction */}
              <p className="text-3xl font-black text-gray-900 leading-none mt-1">
                {f.predicted}
                <span className="text-sm font-normal text-gray-400 ml-1">bu/ac</span>
              </p>

              {/* vs 2024 */}
              <p className="text-[11px] text-gray-400">
                USDA 2024: <span className="font-semibold text-gray-600">{f.usda2024}</span>
              </p>
              {f.xgbForecast && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  XGB {f.xgbForecast} · KNN {f.knnForecast}
                </p>
              )}

              <div className="border-t mt-2 pt-2" style={{ borderColor: `${color}30` }}>
                {/* Top county */}
                <p className="text-[10px] text-gray-500 leading-tight">
                  <span className="font-semibold text-gray-700">Top county:</span> {f.topCounty}
                </p>
                <p className="text-[10px] text-gray-500">{f.topYield} bu/ac predicted</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {f.countyCount} counties · {f.risingCounties} rising
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Colorado note */}
      <p className="text-[10px] text-gray-400 mt-3 text-center">
        Colorado range reflects irrigated (Delta 206) vs dryland (eastern plains 66–88) county variation — both are valid predictions
      </p>
    </div>
  );
}
