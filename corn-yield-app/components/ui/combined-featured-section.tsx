"use client";

import { Activity, MapPin, Database, Satellite, Leaf } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as React from "react";

// Geographic positions as % of a US bounding box (lng -125 to -66, lat 25 to 50)
// x = (125 + lng) / 59 * 100,  y = (50 - lat) / 25 * 100
const STATE_PINS = [
  { x: 53, y: 32, color: "#16a34a", label: "Iowa",     abbr: "IA", yield: "184" },
  { x: 43, y: 34, color: "#2563eb", label: "Nebraska", abbr: "NE", yield: "178" },
  { x: 60, y: 22, color: "#7c3aed", label: "Wisconsin",abbr: "WI", yield: "164" },
  { x: 55, y: 46, color: "#dc2626", label: "Missouri", abbr: "MO", yield: "158" },
  { x: 33, y: 44, color: "#d97706", label: "Colorado", abbr: "CO", yield: "146" },
];

const StateMap = () => (
  <div className="relative w-full" style={{ paddingBottom: "52%" }}>
    {/* Light US-region background */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 overflow-hidden">
      {/* Subtle grid lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {[20,40,60,80].map(x => (
          <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {[25,50,75].map(y => (
          <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* Compass label */}
        <text x="4%" y="8%" fontSize="8" fill="#cbd5e1" fontFamily="system-ui" fontWeight="600">W</text>
        <text x="94%" y="8%" fontSize="8" fill="#cbd5e1" fontFamily="system-ui" fontWeight="600">E</text>
        <text x="48%" y="6%" fontSize="8" fill="#cbd5e1" fontFamily="system-ui" fontWeight="600">N</text>
        <text x="48%" y="97%" fontSize="8" fill="#cbd5e1" fontFamily="system-ui" fontWeight="600">S</text>
      </svg>

      {/* Pulse rings + dots */}
      {STATE_PINS.map((s, i) => (
        <div
          key={s.abbr}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          {/* Pulse ring */}
          <span
            className="absolute inline-flex rounded-full opacity-30 animate-ping"
            style={{
              width: 28, height: 28, top: -14, left: -14,
              background: s.color,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "2.5s",
            }}
          />
          {/* Dot */}
          <span
            className="relative inline-flex rounded-full shadow-md"
            style={{ width: 14, height: 14, background: s.color, border: "2.5px solid white" }}
          />
          {/* Label pill */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap"
            style={{ background: s.color }}
          >
            {s.abbr} {s.yield}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const yieldChartData = [
  { month: "May", Iowa: 0, Nebraska: 0 },
  { month: "Jun", Iowa: 40, Nebraska: 35 },
  { month: "Jul", Iowa: 110, Nebraska: 95 },
  { month: "Aug", Iowa: 165, Nebraska: 148 },
  { month: "Sep", Iowa: 195, Nebraska: 178 },
  { month: "Oct", Iowa: 208, Nebraska: 190 },
];

const forecastCards = [
  { state: "Iowa",      color: "from-green-400 to-emerald-600",   yield: 208, ci: "203–213" },
  { state: "Nebraska",  color: "from-blue-400 to-blue-700",       yield: 190, ci: "185–195" },
  { state: "Wisconsin", color: "from-purple-400 to-violet-700",   yield: 182, ci: "177–187" },
  { state: "Missouri",  color: "from-red-400 to-rose-700",        yield: 166, ci: "161–171" },
  { state: "Colorado",  color: "from-amber-400 to-orange-600",    yield: 192, ci: "187–197" },
  { state: "US Avg",    color: "from-gray-400 to-gray-600",       yield: 181, ci: "Historical" },
];

export default function CornDataOverview() {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* 1 — Dotted map coverage */}
        <div className="relative bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span>Spatial Coverage</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            5-State Corn Belt Coverage{" "}
            <span className="text-gray-500 font-normal text-base">— 263 counties · 20 years of training data.</span>
          </h3>
          <div className="relative mt-4">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-md text-xs font-medium shadow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              5 states · NASA HLS coverage active
            </div>
            <StateMap />
          </div>
        </div>

        {/* 2 — State forecast cards */}
        <div className="flex flex-col justify-between gap-3 p-6 bg-white border-b border-gray-100">
          <div>
            <span className="text-xs flex items-center gap-2 text-gray-500 mb-2">
              <Database className="w-4 h-4" />
              2025 End-of-Season Forecasts
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              State-level predictions{" "}
              <span className="text-gray-500 font-normal">with calibrated 90% confidence intervals.</span>
            </h3>
          </div>
          <div className="w-full max-h-[260px] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent z-10" />
            <div className="space-y-2">
              {forecastCards.map((card, i) => (
                <div
                  key={card.state}
                  className="flex gap-3 items-center p-3 border border-gray-100 rounded-lg"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`w-8 h-8 min-w-[2rem] rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <span className="text-white text-[9px] font-bold">{card.state.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">{card.state}</span>
                      <span className="text-xs font-bold text-gray-900">{card.yield} bu/ac</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">90% CI: {card.ci}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — NDVI / Yield accumulation chart */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Activity className="w-4 h-4" />
            Yield Accumulation Curve
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Modeled growing season trajectory.{" "}
            <span className="text-gray-500 font-normal">Yield signal builds from vegetative to harvest.</span>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={yieldChartData}>
              <defs>
                <linearGradient id="iowa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="nebraska" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 220]} tickFormatter={(v) => `${v}`} />
              <Tooltip
                formatter={(value, name) => [`${value} bu/ac`, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="Iowa"    stroke="#16a34a" strokeWidth={2} fill="url(#iowa)"    name="Iowa" />
              <Area type="monotone" dataKey="Nebraska" stroke="#2563eb" strokeWidth={2} fill="url(#nebraska)" name="Nebraska" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 4 — Feature cards */}
        <div className="grid grid-cols-2 border-t border-gray-100">
          <FeatureCard
            icon={<Satellite className="w-4 h-4" />}
            title="NASA HLS Imagery"
            subtitle="30m Resolution"
            description="Harmonized Landsat Sentinel-2 at 4 phenological stages per season."
            stat="4"
            statLabel="growth stages"
          />
          <FeatureCard
            icon={<Leaf className="w-4 h-4" />}
            title="NDVI + Climate Fusion"
            subtitle="20 Features"
            description="GDD, VPD at silking, PRISM precipitation, and soil productivity index."
            stat="0.72"
            statLabel="model R²"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
  description,
  stat,
  statLabel,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  statLabel: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 p-5 border border-gray-100 bg-white hover:bg-gray-50 transition-colors overflow-hidden">
      <div className="pr-20">
        <span className="text-xs flex items-center gap-2 text-gray-500 mb-3">
          {icon}
          {title}
        </span>
        <h3 className="text-base font-semibold text-gray-900">
          {subtitle}{" "}
          <span className="text-gray-500 font-normal text-sm">{description}</span>
        </h3>
      </div>
      {/* Stat badge — replaces empty Card */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center justify-center w-20 h-16 bg-gray-900 rounded-xl shadow-md">
        <span className="text-white text-lg font-black leading-none">{stat}</span>
        <span className="text-gray-400 text-[9px] mt-0.5 text-center leading-tight px-1">{statLabel}</span>
      </div>
    </div>
  );
}
