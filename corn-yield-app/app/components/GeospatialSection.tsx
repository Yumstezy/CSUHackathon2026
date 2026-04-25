"use client";

import dynamic from "next/dynamic";
import { CountyMapCard } from "@/components/ui/expand-map";

const STATE_DATA = [
  { label: "IA", name: "Iowa",      yield: 208, ci: "203–213", trend: "+3%", color: "#16a34a" },
  { label: "NE", name: "Nebraska",  yield: 190, ci: "185–195", trend: "+2%", color: "#2563eb" },
  { label: "WI", name: "Wisconsin", yield: 182, ci: "177–187", trend: "+4%", color: "#7c3aed" },
  { label: "MO", name: "Missouri",  yield: 166, ci: "161–171", trend: "+1%", color: "#dc2626" },
  { label: "CO", name: "Colorado",  yield: 192, ci: "187–197", trend: "+5%", color: "#d97706" },
];

const CornYieldMap = dynamic(
  () => import("@/components/ui/interactive-map").then((m) => m.CornYieldMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ minHeight: 420 }}>
        <p className="text-gray-400 text-sm">Loading map...</p>
      </div>
    ),
  }
);

const SAMPLE_COUNTIES = [
  { county: "Boone County, IA",  coordinates: "42.04° N, 93.93° W", yieldForecast: "211 bu/ac forecast" },
  { county: "Platte County, NE", coordinates: "41.57° N, 97.38° W", yieldForecast: "208 bu/ac forecast" },
  { county: "Kewaunee Co., WI",  coordinates: "44.49° N, 87.80° W", yieldForecast: "196 bu/ac forecast" },
];

export default function GeospatialSection() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Geospatial Intelligence Layer</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          County-level predictions mapped across the US corn belt — 847 counties, 5 states
        </p>
      </div>

      {/* State forecast cards + interactive map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* State forecast cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">2025 State Forecasts</h3>
            <p className="text-xs text-gray-400 mt-0.5">90% confidence intervals · Random Forest</p>
          </div>
          {STATE_DATA.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
            >
              {/* Color dot + state abbr */}
              <div
                className="w-9 h-9 min-w-[2.25rem] rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ background: s.color }}
              >
                {s.label}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">{s.name}</span>
                  <span className="text-xs font-bold text-gray-900">{s.yield} bu/ac</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400">90% CI: {s.ci}</span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    {s.trend} vs 2024
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">County Prediction Map</h3>
          <p className="text-xs text-gray-400 mb-4">
            Circle = state coverage zone · Numbered pins = predicted yield (bu/ac) · Click for details
          </p>
          <CornYieldMap className="w-full" />
        </div>
      </div>

      {/* County expand cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">County Field Locator</h3>
        <p className="text-xs text-gray-400 mb-6">Click any card to expand satellite field view</p>
        <div className="flex flex-wrap gap-12">
          {SAMPLE_COUNTIES.map((c) => (
            <CountyMapCard key={c.county} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
