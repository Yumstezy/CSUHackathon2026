import { AnimatedRoadmap, type Milestone } from "@/components/ui/animated-roadmap";

const MILESTONES: Milestone[] = [
  {
    id: 0,
    name: "Data Collection (A.1–A.5)",
    status: "complete",
    position: { top: "58%", left: "1%" },
  },
  {
    id: 1,
    name: "merge_all.py (A.6)",
    status: "in-progress",
    position: { top: "8%", left: "21%" },
  },
  {
    id: 2,
    name: "KNN Analog Retrieval (B)",
    status: "pending",
    position: { top: "50%", left: "44%" },
  },
  {
    id: 3,
    name: "XGBoost Baseline (C)",
    status: "pending",
    position: { top: "10%", left: "63%" },
  },
  {
    id: 4,
    name: "Backtest + Presentation (G)",
    status: "pending",
    position: { top: "24%", left: "81%" },
  },
];

export default function ProjectRoadmap() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-2">
        <h3 className="text-base font-bold text-gray-900">Project Roadmap</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          CSU Hackathon 2026 · April 25 presentation — go/no-go gates at end of B, C, and D.1
        </p>
      </div>
      <AnimatedRoadmap milestones={MILESTONES} className="max-w-3xl" />
      <div className="flex items-center gap-5 mt-2 justify-end">
        {(["complete", "in-progress", "pending"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[11px] text-gray-500 capitalize">
            <span className={`w-2 h-2 rounded-full ${
              s === "complete" ? "bg-green-500" :
              s === "in-progress" ? "bg-blue-500 animate-pulse" :
              "bg-gray-300"
            }`} />
            {s.replace("-", " ")}
          </span>
        ))}
      </div>
    </section>
  );
}
