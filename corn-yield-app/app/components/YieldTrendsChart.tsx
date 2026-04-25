"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { yieldTrends, STATES, STATE_COLORS } from "../lib/data";

const YEAR_OPTIONS = [
  { label: "All (2015–2025)", from: 2015 },
  { label: "Last 5 yrs",      from: 2020 },
  { label: "Last 3 yrs",      from: 2022 },
];

export default function YieldTrendsChart() {
  const [fromYear, setFromYear] = useState(2015);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allRows = yieldTrends as any[];
  const historical = useMemo(
    () => allRows.filter((d) => !d.isForecast && d.year >= fromYear),
    [allRows, fromYear],
  );
  const forecastRow = allRows.find((d) => d.isForecast);
  const forecastSegment = forecastRow
    ? [historical[historical.length - 1], forecastRow].filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <h2 className="text-lg font-semibold text-gray-900">Historical Yields + 2025 Forecast</h2>
        {/* Year range filter */}
        <div className="flex gap-1">
          {YEAR_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setFromYear(opt.from)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                fromYear === opt.from
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-4">
        USDA NASS actuals · XGBoost county-mean forecast for 2025
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 border-t-2 border-gray-500" /> Actual
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 border-t-2 border-dashed border-gray-400" /> Forecast
        </span>
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            type="number"
            domain={[fromYear, 2025]}
            tickCount={2025 - fromYear + 1}
            tick={{ fontSize: 11 }}
            allowDuplicatedCategory={false}
          />
          <YAxis
            domain={[110, 220]}
            tick={{ fontSize: 11 }}
            label={{ value: "bu/acre", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 10, fill: "#9ca3af" } }}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(value, name) => [`${value} bu/acre`, String(name).replace(" forecast", "")]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => `${label}${Number(label) === 2025 ? " (forecast)" : " (USDA actual)"}`}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />

          {/* Green "forecast zone" background */}
          <ReferenceArea x1={2024.3} x2={2025} fill="#f0fdf4" fillOpacity={0.7} />
          <ReferenceLine
            x={2024.3}
            stroke="#bbf7d0"
            strokeDasharray="4 3"
            label={{ value: "2025 fcst →", position: "insideTopRight", fontSize: 9, fill: "#6ee7b7" }}
          />

          {/* Historical solid lines */}
          {STATES.map((state) => (
            <Line
              key={`hist-${state}`}
              data={historical}
              type="monotone"
              dataKey={state}
              stroke={STATE_COLORS[state]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={state}
              legendType="circle"
            />
          ))}

          {/* Dashed forecast connector — no legend */}
          {forecastSegment.length > 1 &&
            STATES.map((state) => (
              <Line
                key={`fcst-${state}`}
                data={forecastSegment}
                type="monotone"
                dataKey={state}
                stroke={STATE_COLORS[state]}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={(props) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { cx, cy, index } = props as any;
                  if (index !== 1) return <g key={`e-${cx}`} />;
                  return (
                    <circle
                      key={`fd-${state}-${cx}`}
                      cx={cx} cy={cy} r={5}
                      fill={STATE_COLORS[state]}
                      stroke="#fff" strokeWidth={2}
                    />
                  );
                }}
                legendType="none"
                name={`${state} forecast`}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Colorado 2024 drop (188→131) reflects drought conditions · Iowa 2024 (211) was a record high
      </p>
    </div>
  );
}
