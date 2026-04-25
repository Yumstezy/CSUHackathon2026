"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export default function StatCard({ label, value, sub, accent = "border-green-500" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${accent} shadow-sm p-5 flex flex-col gap-1`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}
