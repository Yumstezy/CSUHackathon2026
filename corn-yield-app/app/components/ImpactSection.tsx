"use client";

const stats = [
  { value: "40%", label: "of global corn supply", sub: "comes from the US" },
  { value: "$60B+", label: "US corn market value", sub: "annually" },
  { value: "4–8 wks", label: "earlier than USDA", sub: "official estimates" },
  { value: "91M", label: "acres planted", sub: "across the US in 2024" },
];

const useCases = [
  {
    title: "Commodity Traders",
    body: "Early yield signals reduce market volatility. A 10 bu/ac forecast error can move corn futures by $0.30/bushel — that's $2.7B in market exposure.",
    icon: "▲",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Farm Managers",
    body: "County-level granularity lets individual producers benchmark their operation against regional forecasts and adjust grain storage or forward-contract decisions.",
    icon: "◼",
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Food Security Policy",
    body: "USDA, FEWS NET, and WFP use early-season yield signals to trigger food aid procurement before harvest shortfalls materialize into price spikes.",
    icon: "●",
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Crop Insurance",
    body: "Sub-county yield estimates enable more accurate actuarial pricing for MPCI and revenue protection products, reducing systemic basis risk for insurers.",
    icon: "◆",
    color: "text-purple-600 bg-purple-50",
  },
];

export default function ImpactSection() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      {/* Dark header band */}
      <div className="bg-gray-900 text-white px-8 py-8">
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Why It Matters</p>
        <h2 className="text-2xl font-bold leading-tight mb-3">
          Faster forecasts. Smarter decisions.<br />From field to global markets.
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
          The US corn belt produces enough grain to feed 10 billion people for a year.
          Our model delivers county-level yield estimates 4–8 weeks before USDA official reports —
          enabling earlier, better-informed decisions across the entire agricultural value chain.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-2xl font-black text-green-400">{s.value}</p>
              <p className="text-sm text-white font-medium mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use case cards */}
      <div className="bg-gray-50 px-8 py-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Who Benefits</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((u) => (
            <div key={u.title} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold mb-3 ${u.color}`}>
                {u.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{u.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
