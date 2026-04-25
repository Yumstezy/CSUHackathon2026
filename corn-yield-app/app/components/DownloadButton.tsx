"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check } from "lucide-react";

interface Prediction {
  county: string;
  fips: string;
  state: string;
  predicted: number;
  ci_low: number;
  ci_high: number;
  trend: string;
}

interface Props {
  predictions: Prediction[];
}

export default function DownloadButton({ predictions }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    const headers = ["County", "State", "FIPS", "Predicted Yield (bu/ac)", "CI Low", "CI High", "Trend"];
    const rows = predictions.map((r) => [
      r.county, r.state, r.fips, r.predicted, r.ci_low, r.ci_high, r.trend,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "corncast-2025-forecasts.csv";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }

  return (
    <motion.button
      onClick={handleDownload}
      initial={{ width: "2.75rem" }}
      whileHover={{ width: "220px" }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="relative flex items-center justify-center overflow-hidden h-11 rounded-full border border-white/30 bg-white/15 hover:bg-white/25 text-white transition-colors"
      style={{ minWidth: "2.75rem" }}
    >
      {/* Icon always centred; shifts left when expanded */}
      <motion.span
        className="absolute left-3.5 flex items-center justify-center w-5 h-5 shrink-0"
        layout
      >
        <AnimatePresence mode="wait" initial={false}>
          {downloaded ? (
            <motion.span
              key="check"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Check className="w-4 h-4 text-green-300" strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span
              key="dl"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Download className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>

      {/* Label — fades in as button expands */}
      <motion.span
        className="pl-9 pr-4 text-sm font-semibold whitespace-nowrap"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.18, delay: 0.08 }}
      >
        {downloaded ? "Downloaded!" : "Download 2025 CSV"}
      </motion.span>
    </motion.button>
  );
}
