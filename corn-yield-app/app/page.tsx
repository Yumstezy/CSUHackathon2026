import StatCard from "./components/StatCard";
import YieldTrendsChart from "./components/YieldTrendsChart";
import FeatureImportanceChart from "./components/FeatureImportanceChart";
import ModelPerformanceChart from "./components/ModelPerformanceChart";
import PredictionsTable from "./components/PredictionsTable";
import MethodologySection from "./components/MethodologySection";
import StateBreakdown from "./components/StateBreakdown";
import ConeOfUncertainty from "./components/ConeOfUncertainty";
import GrowthStageTimeline from "./components/GrowthStageTimeline";
import ImpactSection from "./components/ImpactSection";
import GeospatialSection from "./components/GeospatialSection";
import USDAComparison from "./components/USDAComparison";
import PipelineVisual from "./components/PipelineVisual";
import Link from "next/link";
import AnimatedHeroBg from "./components/AnimatedHeroBg";
import DownloadButton from "./components/DownloadButton";
import SponsorBar from "./components/SponsorBar";
import StateForecast2025 from "./components/StateForecast2025";
import ProjectRoadmap from "./components/ProjectRoadmap";
import CornDataOverview from "@/components/ui/combined-featured-section";
import HexagonYieldHeatmap from "@/components/ui/hexagon-yield-heatmap";
import { dataStats, isLive, predictions2025 } from "./lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Aurum</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Geospatial AI Crop Yield Forecasting — Iowa · Nebraska · Wisconsin · Missouri · Colorado
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/predictions"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 hover:bg-green-100 transition-colors"
            >
              2025 Forecasts →
            </Link>
            {isLive ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Live Model · 2025 Forecast
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                2025 Forecast
              </span>
            )}
            <span className="hidden sm:block text-xs text-gray-400 font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1">
              XGBoost + KNN Analog
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Hero */}
        <div className="rounded-xl bg-gradient-to-br from-green-800 via-green-700 to-emerald-900 text-white p-8 relative overflow-hidden">
          <AnimatedHeroBg />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
          />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500/30 border border-green-400/40 text-green-200 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Aurum · CSU Hackathon 2026 — Land Use & Sustainability
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
                  Aurum — AI Corn Yield<br />Forecasting at County Scale
                </h2>
                <p className="text-green-100 leading-relaxed text-sm sm:text-base">
                  Multi-source geospatial AI pipeline fusing NASA HLS satellite imagery,
                  PRISM climate grids, and USDA SSURGO soil surveys to issue 4-stage growing
                  season yield forecasts with calibrated uncertainty — delivered 4–8 weeks
                  before official USDA NASS estimates.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {["NASA HLS / Prithvi", "USDA NASS", "gridMET Climate", "gSSURGO Soils", "XGBoost + KNN"].map((tag) => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/90 text-xs px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <DownloadButton predictions={predictions2025} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                {[
                  { label: "Model R²",          value: dataStats.modelR2.toFixed(3) },
                  { label: "MAE",               value: `${dataStats.modelMAE} bu/ac` },
                  { label: "Training Records",   value: dataStats.trainingRows.toLocaleString() },
                  { label: "Forecast Lead Time", value: "4–8 wks" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
                    <p className="text-2xl font-black text-white leading-none">{item.value}</p>
                    <p className="text-green-300 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data sources + partners bar */}
        <SponsorBar />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Model R²"      value={dataStats.modelR2.toFixed(3)}          sub="Train 2005–22 · Val 2023"    accent="border-green-500" />
          <StatCard label="MAE"           value={`${dataStats.modelMAE} bu/ac`}          sub="Mean absolute error"          accent="border-blue-500" />
          <StatCard label="Counties"      value={dataStats.counties.toLocaleString()}    sub="5 states"                    accent="border-purple-500" />
          <StatCard label="Years"         value="2005–2024"                              sub="20-year window"               accent="border-yellow-500" />
          <StatCard label="Features"      value={dataStats.features.toString()}          sub="satellite + climate + soil"  accent="border-orange-500" />
          <StatCard label="Training Rows" value={dataStats.trainingRows.toLocaleString()} sub="county-year records"        accent="border-rose-500" />
        </div>

        {/* 2025 state forecast summary */}
        <StateForecast2025 />

        {/* === KEY DELIVERABLE: Cone of Uncertainty === */}
        <ConeOfUncertainty />

        {/* Beat USDA lead-time banner */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-900 to-green-800 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-1">Key Advantage</p>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              4–5 months ahead of USDA
            </h3>
            <p className="text-green-200 text-sm mt-1 max-w-lg">
              First forecast issued <strong>August 1</strong> — USDA NASS final estimates release in December.
              That&apos;s a 4–5 month lead window for grain traders, insurers, and food-security planners.
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[
              { value: "Aug 1", sub: "First forecast" },
              { value: "4–5 mo", sub: "Lead time" },
              { value: "4×", sub: "Updates per season" },
            ].map((s) => (
              <div key={s.sub} className="text-center">
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-green-300 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth stage timeline */}
        <GrowthStageTimeline />

        {/* Yield trends + model performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <YieldTrendsChart />
          </div>
          <div>
            <ModelPerformanceChart />
          </div>
        </div>

        {/* Feature importance + state breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureImportanceChart />
          <StateBreakdown />
        </div>

        {/* 2025 county predictions */}
        <PredictionsTable />

        {/* Geospatial intelligence — globe + leaflet map + county cards */}
        <GeospatialSection />

        {/* Yield signal heatmap — hexagon grid by state × month */}
        <div className="flex justify-center">
          <HexagonYieldHeatmap />
        </div>

        {/* Data overview — dotted map + state forecasts + chart + feature cards */}
        <CornDataOverview />

        {/* USDA validation */}
        <USDAComparison />

        {/* Data pipeline visual */}
        <PipelineVisual />

        {/* Project roadmap */}
        <ProjectRoadmap />

        {/* Methodology */}
        <MethodologySection />

        {/* Impact */}
        <ImpactSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-6 pb-10 text-center text-xs text-gray-400">
          Aurum — AI Corn Yield Forecasting · CSU April Hackathon 2026 · Land Use &amp; Sustainability Track
          <br />
          Data: USDA NASS · Oregon State PRISM · USDA NRCS gSSURGO · NASA HLS / Prithvi · gridMET · USDA Drought Monitor
        </footer>
      </main>
    </div>
  );
}
