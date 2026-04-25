"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { featureImportance, CATEGORY_COLORS } from "../lib/data";

const sorted = [...featureImportance].sort((a, b) => a.importance - b.importance);

export default function FeatureImportanceChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Feature Importance</h2>
      <p className="text-sm text-gray-500 mb-4">
        XGBoost feature importance (gain) · model8 · 35 features
      </p>
      <div className="flex gap-4 mb-5 flex-wrap">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-xs text-gray-600">{cat}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            domain={[0, 30]}
          />
          <YAxis
            dataKey="feature"
            type="category"
            width={190}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Importance"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
            {sorted.map((entry) => (
              <Cell key={entry.feature} fill={CATEGORY_COLORS[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
