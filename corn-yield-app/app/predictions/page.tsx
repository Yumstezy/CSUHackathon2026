import Link from "next/link";
import PredictionsTable from "../components/PredictionsTable";
import StateForecast2025 from "../components/StateForecast2025";
import { stateForecasts2025, STATES, STATE_COLORS } from "../lib/data";

export default function PredictionsPage() {
  const forecasts = STATES.map((s) => stateForecasts2025[s]).filter(Boolean);
  const totalCounties = forecasts.reduce((s, f) => s + f.countyCount, 0);
  const avgForecast   = Math.round(forecasts.reduce((s, f) => s + f.predicted, 0) / forecasts.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Dashboard</Link>
            <span className="text-gray-200">|</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Aurum — 2025 Yield Forecasts</h1>
              <p className="text-[11px] text-gray-400">XGBoost model8 · {totalCounties} counties · 5 states</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live Model
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Hero summary banner */}
        <div className="rounded-xl bg-gradient-to-br from-green-800 via-green-700 to-emerald-900 text-white p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">2025 Season Forecast</p>
          <h2 className="text-3xl font-black mb-2">County-Level Corn Yield Predictions</h2>
          <p className="text-green-200 text-sm max-w-xl">
            XGBoost model trained on 20 years of USDA NASS, gridMET climate, NASA HLS satellite imagery,
            USDA Drought Monitor, and gSSURGO soils — issued 4–8 weeks before USDA official estimates.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: "Counties forecast", value: totalCounties },
              { label: "States covered", value: 5 },
              { label: "5-state avg", value: `${avgForecast} bu/ac` },
              { label: "Lead time", value: "4–8 wks" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center min-w-[100px]">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-green-300 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* State cards */}
        <StateForecast2025 />

        {/* State comparison bar */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">2025 vs 2024 USDA — State Comparison</h2>
          <p className="text-xs text-gray-400 mb-5">Model state-mean vs USDA 2024 final estimate · bu/acre</p>
          <div className="space-y-3">
            {forecasts.sort((a, b) => b.predicted - a.predicted).map((f) => {
              const color  = STATE_COLORS[f.state];
              const maxVal = 220;
              const pred2025Pct = (f.predicted / maxVal) * 100;
              const usda2024Pct = (f.usda2024 / maxVal) * 100;
              const delta  = f.delta;
              return (
                <div key={f.state}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-semibold text-gray-700">{f.state}</span>
                    <span className={`font-mono font-bold ${delta >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {delta >= 0 ? "+" : ""}{delta} bu/ac vs 2024
                    </span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {/* 2025 forecast bar */}
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pred2025Pct}%`, background: color, opacity: 0.85 }}
                      />
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] font-bold text-gray-600">
                        {f.predicted}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center mt-0.5">
                    {/* 2024 USDA bar */}
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gray-300"
                        style={{ width: `${usda2024Pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 mt-0.5 px-0.5">
                    <span>2025 forecast (model)</span>
                    <span>USDA 2024: {f.usda2024}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-green-600 opacity-85" /> 2025 Forecast (model)</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-gray-300" /> USDA 2024 Actual</div>
          </div>
        </div>

        {/* Full county table */}
        <PredictionsTable />

        <footer className="text-center text-[10px] text-gray-400 pb-8">
          Aurum · CSU Hackathon 2026 · XGBoost model8 · R² 0.789 · MAE 12.5 bu/ac
        </footer>
      </main>
    </div>
  );
}
