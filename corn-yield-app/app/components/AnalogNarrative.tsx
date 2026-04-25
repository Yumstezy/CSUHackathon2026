"use client";

import { useState } from "react";
import { analogYears, STATE_COLORS, STATES } from "../lib/data";

const YEAR_LORE: Record<number, { label: string; tag: string; tagColor: string; note: string }> = {
  2005: { label: "Avg season", tag: "Normal",   tagColor: "bg-gray-100 text-gray-600", note: "Baseline year — moderate GDD, average precip." },
  2006: { label: "Dry finish",  tag: "Drought",  tagColor: "bg-red-100 text-red-700",  note: "Late-season VPD spike cut grain fill short across much of the belt." },
  2011: { label: "Wet spring",  tag: "Wet",      tagColor: "bg-blue-100 text-blue-700", note: "Planting delays from excessive May rain; recovery yield still near average." },
  2012: { label: "Historic drought", tag: "D4 Drought", tagColor: "bg-red-200 text-red-800", note: "Worst Corn Belt drought since 1988. D4 exceptional drought covered ~60% of acreage at silking." },
  2015: { label: "Near-record", tag: "Strong",   tagColor: "bg-green-100 text-green-700", note: "Ideal GDD accumulation and timely August rain drove strong grain fill." },
  2016: { label: "Record year", tag: "Record",   tagColor: "bg-emerald-100 text-emerald-800", note: "All-time record for Iowa. Exceptional GDD trajectory, near-zero drought stress, normal VPD." },
  2017: { label: "Good season", tag: "Normal+",  tagColor: "bg-green-100 text-green-700", note: "Above-average yields across Nebraska and Colorado; slight heat stress in Missouri." },
  2018: { label: "Heat stress", tag: "Warm",     tagColor: "bg-orange-100 text-orange-700", note: "Elevated EDD above 86°F at silking stage suppressed yield potential in southern states." },
  2019: { label: "Wet planting", tag: "Wet",     tagColor: "bg-blue-100 text-blue-700", note: "Record prevent-plant claims across Iowa/Nebraska. Late maturity dragged final yields." },
  2020: { label: "La Niña recovery", tag: "Strong", tagColor: "bg-emerald-100 text-emerald-800", note: "Fast La Niña development. Near-record yields despite August derecho damage in Iowa." },
  2021: { label: "W. drought", tag: "Dry West",  tagColor: "bg-amber-100 text-amber-700", note: "Colorado and western Nebraska hit by D3 drought; Iowa/Wisconsin near average." },
  2022: { label: "Solid yields", tag: "Good",    tagColor: "bg-green-100 text-green-700", note: "Above-normal GDD and adequate soil moisture at silking across all 5 states." },
  2023: { label: "Mixed signals", tag: "Moderate", tagColor: "bg-gray-100 text-gray-600", note: "D2 drought in Missouri, near-average conditions elsewhere. Yields tracked USDA closely." },
  2024: { label: "2024 holdout", tag: "Holdout", tagColor: "bg-purple-100 text-purple-700", note: "Model holdout year — final validation set. Strong yields confirmed model accuracy." },
};

const STATE_NARRATIVES: Record<string, string> = {
  Iowa:     "2025 conditions in Iowa most closely resemble seasons with strong GDD accumulation and near-average VPD. The analog set skews toward above-average outcomes — model is cautiously optimistic.",
  Nebraska: "Nebraska analogs show a mixed picture: two record seasons offset by one drought year. Elevated early-season soil moisture is the key positive signal heading into silking.",
  Wisconsin:"Wisconsin analog years cluster around moderate-to-strong outcomes. Low drought severity through July is a positive leading indicator; late-season temperature will be decisive.",
  Missouri: "Missouri analogs include 2012 as a downside tail risk — drought conditions in the Ozarks are worth watching. Current Drought Monitor shows D0–D1, consistent with cautious cone.",
  Colorado: "Colorado analogs reflect the state's irrigation-dominated yield response. Current analog mix suggests near-average outcomes barring a late-season VPD spike.",
};

export default function AnalogNarrative() {
  const [selected, setSelected] = useState("Iowa");
  const color = STATE_COLORS[selected];
  const years = analogYears[selected] ?? [];
  const narrative = STATE_NARRATIVES[selected];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
              Phase F
            </span>
            <h2 className="text-lg font-semibold text-gray-900">Analog Year Intelligence</h2>
          </div>
          <p className="text-sm text-gray-500">
            K-NN retrieves the 10 seasons most similar to 2025 — their actual yields define the cone
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selected === s ? "text-white border-transparent shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={selected === s ? { background: STATE_COLORS[s] } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative blurb */}
      <div className="rounded-lg p-4 mb-5 text-sm leading-relaxed text-gray-700 border" style={{ background: `${color}08`, borderColor: `${color}25` }}>
        <span className="font-semibold" style={{ color }}>2025 outlook — </span>
        {narrative}
      </div>

      {/* Analog year cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {years.map((yr) => {
          const lore = YEAR_LORE[yr];
          if (!lore) return null;
          return (
            <div key={yr} className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-gray-800">{yr}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${lore.tagColor}`}>{lore.tag}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{lore.note}</p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mt-4">
        Top 5 of K=10 analog years shown · Full retrieval uses standardized GDD, NDVI, VPD, drought severity, and soil moisture features as-of the forecast date
      </p>
    </div>
  );
}
