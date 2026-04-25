"use client";

import { useState, useMemo } from "react";
import { predictions2025, STATE_COLORS, STATES } from "../lib/data";

const INITIAL_ROWS = 10;
const ALL = "All";

const sorted = [...predictions2025].sort((a, b) => b.predicted - a.predicted);

export default function PredictionsTable() {
  const [expanded, setExpanded]     = useState(false);
  const [stateFilter, setStateFilter] = useState(ALL);
  const [query, setQuery]           = useState("");

  const filtered = useMemo(() => {
    let rows = sorted;
    if (stateFilter !== ALL) rows = rows.filter((r) => r.state === stateFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => r.county.toLowerCase().includes(q));
    }
    return rows;
  }, [stateFilter, query]);

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_ROWS);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-900">2025 Yield Predictions — County Level</h2>
        <span className="text-xs text-gray-400 font-mono">{filtered.length} counties</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Predicted corn yield with 90% CI · XGBoost model8 · sorted by forecast
      </p>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* State tabs */}
        <div className="flex flex-wrap gap-1">
          {[ALL, ...STATES].map((s) => (
            <button
              key={s}
              onClick={() => { setStateFilter(s); setExpanded(false); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                stateFilter === s
                  ? "text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
              style={stateFilter === s && s !== ALL
                ? { background: STATE_COLORS[s], borderColor: STATE_COLORS[s] }
                : stateFilter === s
                ? { background: "#374151", borderColor: "#374151" }
                : {}}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search county…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setExpanded(false); }}
          className="ml-auto text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400 w-36"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 pr-3 font-semibold text-gray-400 uppercase tracking-wider">#</th>
              <th className="text-left pb-2 pr-3 font-semibold text-gray-400 uppercase tracking-wider">County</th>
              <th className="text-left pb-2 pr-3 font-semibold text-gray-400 uppercase tracking-wider">State</th>
              <th className="text-right pb-2 pr-3 font-semibold text-gray-400 uppercase tracking-wider">Predicted</th>
              <th className="text-right pb-2 pr-3 font-semibold text-gray-400 uppercase tracking-wider">90% CI</th>
              <th className="text-right pb-2 font-semibold text-gray-400 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={row.fips} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-1.5 pr-3 text-gray-300 font-mono">{i + 1}</td>
                <td className="py-1.5 pr-3 font-medium text-gray-900">{row.county}</td>
                <td className="py-1.5 pr-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                    style={{ background: STATE_COLORS[row.state] }}
                  >
                    {row.state}
                  </span>
                </td>
                <td className="py-1.5 pr-3 text-right font-bold text-gray-900">{row.predicted} bu/ac</td>
                <td className="py-1.5 pr-3 text-right text-gray-400">{row.ci_low}–{row.ci_high}</td>
                <td className="py-1.5 text-right">
                  {row.trend === "up"
                    ? <span className="text-green-600 font-semibold">↑ Rising</span>
                    : <span className="text-gray-400">— Stable</span>}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">No counties match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > INITIAL_ROWS && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2 transition-colors hover:bg-gray-50"
        >
          {expanded ? "Show less ↑" : `Show all ${filtered.length} counties ↓`}
        </button>
      )}
    </div>
  );
}
