"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const radarData = [
  { metric: "Yield/acre", Iowa: 90, Nebraska: 82, Wisconsin: 75, Missouri: 68, Colorado: 80 },
  { metric: "GDD", Iowa: 88, Nebraska: 85, Wisconsin: 72, Missouri: 82, Colorado: 90 },
  { metric: "NDVI Health", Iowa: 92, Nebraska: 84, Wisconsin: 80, Missouri: 74, Colorado: 78 },
  { metric: "Soil Quality", Iowa: 95, Nebraska: 88, Wisconsin: 76, Missouri: 72, Colorado: 70 },
  { metric: "Water Avail.", Iowa: 85, Nebraska: 80, Wisconsin: 90, Missouri: 78, Colorado: 65 },
  { metric: "Precipitation", Iowa: 82, Nebraska: 74, Wisconsin: 88, Missouri: 80, Colorado: 60 },
];

const STATE_COLORS: Record<string, string> = {
  Iowa: "#16a34a",
  Nebraska: "#2563eb",
  Wisconsin: "#7c3aed",
  Missouri: "#dc2626",
  Colorado: "#d97706",
};

const stateStats = [
  { state: "Iowa",     counties: 73, avgYield: 184, soilRating: "A+", irrigation: "12%", r2: 0.79 },
  { state: "Nebraska", counties: 60, avgYield: 178, soilRating: "A",  irrigation: "64%", r2: 0.72 },
  { state: "Wisconsin",counties: 59, avgYield: 164, soilRating: "B+", irrigation: "8%",  r2: 0.75 },
  { state: "Missouri", counties: 53, avgYield: 158, soilRating: "B",  irrigation: "7%",  r2: 0.71 },
  { state: "Colorado", counties: 18, avgYield: 146, soilRating: "B+", irrigation: "78%", r2: 0.68 },
];

export default function StateBreakdown() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">State Performance Profile</h2>
      <p className="text-sm text-gray-500 mb-6">
        Normalized agricultural factors by state · 2025 XGBoost county-mean forecasts
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[50, 100]} tick={{ fontSize: 9 }} />
            {Object.entries(STATE_COLORS).map(([state, color]) => (
              <Radar
                key={state}
                name={state}
                dataKey={state}
                stroke={color}
                fill={color}
                fillOpacity={0.08}
                strokeWidth={2}
              />
            ))}
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-3 text-xs font-semibold text-gray-500 uppercase">State</th>
                <th className="text-right py-2 pr-3 text-xs font-semibold text-gray-500 uppercase">2025 Fcst</th>
                <th className="text-right py-2 pr-3 text-xs font-semibold text-gray-500 uppercase">Soil</th>
                <th className="text-right py-2 pr-3 text-xs font-semibold text-gray-500 uppercase">Irrigation</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Model R²</th>
              </tr>
            </thead>
            <tbody>
              {stateStats.map((row) => (
                <tr key={row.state} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-3 font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: STATE_COLORS[row.state] }}
                      />
                      {row.state}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-semibold text-gray-900">{row.avgYield}</td>
                  <td className="py-2.5 pr-3 text-right text-gray-600">{row.soilRating}</td>
                  <td className="py-2.5 pr-3 text-right text-gray-600">{row.irrigation}</td>
                  <td className="py-2.5 text-right">
                    <span className="font-semibold text-green-700">{row.r2.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
