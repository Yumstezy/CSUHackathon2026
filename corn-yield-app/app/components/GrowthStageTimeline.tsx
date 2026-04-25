"use client";

const stages = [
  {
    date: "Aug 1",
    label: "Early Grain Fill",
    description: "Kernels accumulating starch. VPD and heat stress are critical signals.",
    icon: "◑",
    uncertainty: "±26 bu/ac",
    color: "border-amber-400 bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    date: "Sep 1",
    label: "Late Grain Fill / Dough",
    description: "NDVI declining. Silking-stage satellite features heavily weighted.",
    icon: "◕",
    uncertainty: "±17 bu/ac",
    color: "border-lime-500 bg-lime-50",
    textColor: "text-lime-700",
  },
  {
    date: "Oct 1",
    label: "Maturity / Early Harvest",
    description: "GDD accumulation complete. Black layer formation. Highest model confidence.",
    icon: "●",
    uncertainty: "±10 bu/ac",
    color: "border-green-600 bg-green-50",
    textColor: "text-green-700",
  },
  {
    date: "Final",
    label: "End of Season",
    description: "Post-harvest reconciliation against USDA NASS reported values.",
    icon: "★",
    uncertainty: "±5 bu/ac",
    color: "border-emerald-700 bg-emerald-50",
    textColor: "text-emerald-700",
  },
];

export default function GrowthStageTimeline() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Forecast Timeline — Four Growth Stages</h2>
      <p className="text-sm text-gray-500 mb-6">
        Each forecast issued 4–8 weeks before the next, using cumulative satellite + climate data
      </p>

      {/* Timeline bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 via-lime-400 to-emerald-600 rounded-full" />
        <div className="grid grid-cols-4 gap-2 relative">
          {stages.map((s, i) => (
            <div key={s.date} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold z-10 ${s.color} ${s.textColor}`}>
                {i + 1}
              </div>
              <p className="text-xs font-bold mt-2 text-gray-800">{s.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stage cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((s) => (
          <div key={s.date} className={`rounded-lg border-l-4 p-4 ${s.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${s.textColor}`}>{s.date}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60 ${s.textColor}`}>{s.uncertainty}</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm mb-1.5">{s.label}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Uncertainty range shrinks from ±26 bu/ac in August to ±5 bu/ac at season end as new satellite passes are ingested
      </p>
    </div>
  );
}
