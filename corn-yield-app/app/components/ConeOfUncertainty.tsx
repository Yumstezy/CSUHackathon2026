"use client";

import { useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { coneData, analogYears, STATE_COLORS, STATES } from "../lib/data";

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number | number[] }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const predicted = payload.find((p) => p.name === "Predicted")?.value as number;
  const upper = payload.find((p) => p.name === "90% CI Upper")?.value as number;
  const lower = payload.find((p) => p.name === "90% CI Lower")?.value as number;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-sm min-w-[200px]">
      <p className="font-bold text-gray-900 mb-2">{label}</p>
      {predicted !== undefined && (
        <p className="text-gray-900 font-semibold">Forecast: <span className="text-green-700">{predicted} bu/ac</span></p>
      )}
      {upper !== undefined && lower !== undefined && (
        <p className="text-gray-500 mt-1">p10–p90 cone: {lower} – {upper} bu/ac</p>
      )}
      {upper !== undefined && lower !== undefined && (
        <p className="text-gray-400 text-xs mt-1">Uncertainty: ±{Math.round((upper - lower) / 2)} bu/ac</p>
      )}
    </div>
  );
};

export default function ConeOfUncertainty() {
  const [selectedState, setSelectedState] = useState("Iowa");
  const color = STATE_COLORS[selectedState];
  const data = coneData[selectedState];
  const analogs = analogYears[selectedState];

  // Build chart data with separate upper/lower for the area band
  const chartData = data.map((d) => ({
    stage: d.stage,
    predicted: d.predicted,
    band: [d.lower, d.upper] as [number, number],
    upper: d.upper,
    lower: d.lower,
    analogHigh: d.analog_range[1],
    analogLow: d.analog_range[0],
  }));

  const finalPredicted = data[data.length - 1].predicted;
  const finalUpper = data[data.length - 1].upper;
  const finalLower = data[data.length - 1].lower;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">2025 Yield Forecast — Cone of Uncertainty</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            p10/p50/p90 from K-NN analog-year retrieval (K=10) — narrows as more of the season is observed
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedState(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedState === s
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={selectedState === s ? { background: STATE_COLORS[s], borderColor: STATE_COLORS[s] } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id={`cone-${selectedState}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="stage" tick={{ fontSize: 12, fontWeight: 600 }} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `${v}`}
            tick={{ fontSize: 11 }}
            label={{ value: "bu/acre", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11, fill: "#9ca3af" } }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Analog year outer range */}
          <Area
            type="monotone"
            dataKey="analogHigh"
            stroke="none"
            fill="#f3f4f6"
            fillOpacity={1}
            legendType="none"
            name="Analog range high"
          />
          <Area
            type="monotone"
            dataKey="analogLow"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            legendType="none"
            name="Analog range low"
          />

          {/* 90% CI cone */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill={`url(#cone-${selectedState})`}
            fillOpacity={1}
            legendType="square"
            name="90% CI Upper"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            legendType="square"
            name="90% CI Lower"
          />

          {/* Center forecast line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
            name="Predicted"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Bottom summary */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.map((d, i) => {
          const stageLabels = ["Early Grain Fill", "Late Grain Fill / Dough", "Maturity / Early Harvest", "End of Season"];
          const uncertainty = Math.round((d.upper - d.lower) / 2);
          return (
            <div
              key={d.stage}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{d.stage}</p>
              <p className="text-xl font-bold mt-1" style={{ color }}>{d.predicted}</p>
              <p className="text-[10px] text-gray-500">bu/acre</p>
              <p className="text-[10px] text-gray-400 mt-1">±{uncertainty} uncertainty</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{stageLabels[i]}</p>
            </div>
          );
        })}
      </div>

      {/* Analog years */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="font-semibold text-gray-700">Analog years used:</span>
        {analogs.map((yr) => (
          <span key={yr} className="bg-gray-100 rounded px-2 py-0.5 font-mono">{yr}</span>
        ))}
        <span className="text-gray-400 ml-1">— K-NN matched on GDD, NDVI, VPD &amp; drought severity</span>
      </div>

      {/* Final forecast callout */}
      <div
        className="mt-4 rounded-lg p-4 flex items-center justify-between"
        style={{ background: `${color}12`, border: `1px solid ${color}30` }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
            {selectedState} — End of Season 2025 Forecast
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">
            {finalPredicted} <span className="text-base font-normal text-gray-500">bu/acre</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">p10–p90 analog range</p>
          <p className="text-lg font-bold text-gray-700">{finalLower} – {finalUpper}</p>
        </div>
      </div>
    </div>
  );
}
