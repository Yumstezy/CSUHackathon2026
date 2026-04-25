// ── Live model data (loaded after `npm run sync-data`) ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let live: Record<string, any> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  live = require("./liveResults.json");
} catch { /* no live data yet — static fallback used */ }

// ── Static fallback values ───────────────────────────────────────────────────

export const STATES = ["Iowa", "Nebraska", "Wisconsin", "Missouri", "Colorado"];

export const STATE_COLORS: Record<string, string> = {
  Iowa: "#16a34a",
  Nebraska: "#2563eb",
  Wisconsin: "#7c3aed",
  Missouri: "#dc2626",
  Colorado: "#d97706",
};

const staticYieldTrends = [
  { year: 2015, Iowa: 191, Nebraska: 176, Wisconsin: 167, Missouri: 148, Colorado: 178 },
  { year: 2016, Iowa: 196, Nebraska: 183, Wisconsin: 172, Missouri: 161, Colorado: 181 },
  { year: 2017, Iowa: 199, Nebraska: 181, Wisconsin: 170, Missouri: 163, Colorado: 183 },
  { year: 2018, Iowa: 196, Nebraska: 175, Wisconsin: 168, Missouri: 158, Colorado: 180 },
  { year: 2019, Iowa: 167, Nebraska: 162, Wisconsin: 151, Missouri: 139, Colorado: 165 },
  { year: 2020, Iowa: 197, Nebraska: 182, Wisconsin: 174, Missouri: 165, Colorado: 182 },
  { year: 2021, Iowa: 177, Nebraska: 162, Wisconsin: 158, Missouri: 144, Colorado: 171 },
  { year: 2022, Iowa: 202, Nebraska: 185, Wisconsin: 177, Missouri: 163, Colorado: 188 },
  { year: 2023, Iowa: 200, Nebraska: 183, Wisconsin: 175, Missouri: 161, Colorado: 185 },
  { year: 2024, Iowa: 203, Nebraska: 187, Wisconsin: 179, Missouri: 164, Colorado: 188 },
];

const staticFeatureImportance = [
  { feature: "GDD (Growing Degree Days)", importance: 18.4, category: "Climate" },
  { feature: "NDVI at Silking", importance: 15.2, category: "Satellite" },
  { feature: "VPD at Silking (kPa)", importance: 12.7, category: "Climate" },
  { feature: "Soil Productivity (nccpi3corn)", importance: 11.3, category: "Soil" },
  { feature: "NDVI Peak Season", importance: 9.8, category: "Satellite" },
  { feature: "Prior Year Yield", importance: 8.9, category: "Lag" },
  { feature: "Drought Severity (D2–D4 %)", importance: 7.8, category: "Climate" },
  { feature: "Precip (May–Aug mm)", importance: 6.4, category: "Climate" },
  { feature: "VPD Vegetative Stage", importance: 5.4, category: "Climate" },
  { feature: "Soil Water Capacity (aws0_100)", importance: 3.8, category: "Soil" },
  { feature: "Heat Stress Hours > 86F", importance: 2.3, category: "Climate" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Climate: "#2563eb",
  Satellite: "#16a34a",
  Soil: "#d97706",
  Lag: "#7c3aed",
};

const staticPredictions2025 = [
  { county: "Adair, IA",        fips: "19001", state: "Iowa",      predicted: 212, ci_low: 202, ci_high: 222, trend: "up" },
  { county: "Platte, NE",       fips: "31141", state: "Nebraska",  predicted: 208, ci_low: 198, ci_high: 218, trend: "up" },
  { county: "Kewaunee, WI",     fips: "55061", state: "Wisconsin", predicted: 196, ci_low: 187, ci_high: 205, trend: "stable" },
  { county: "Dodge, NE",        fips: "31053", state: "Nebraska",  predicted: 205, ci_low: 195, ci_high: 215, trend: "up" },
  { county: "Linn, IA",         fips: "19113", state: "Iowa",      predicted: 210, ci_low: 200, ci_high: 220, trend: "up" },
  { county: "Phelps, NE",       fips: "31137", state: "Nebraska",  predicted: 203, ci_low: 193, ci_high: 213, trend: "stable" },
  { county: "Fond du Lac, WI",  fips: "55039", state: "Wisconsin", predicted: 192, ci_low: 183, ci_high: 201, trend: "up" },
  { county: "Cass, IA",         fips: "19029", state: "Iowa",      predicted: 209, ci_low: 199, ci_high: 219, trend: "stable" },
  { county: "Boone, IA",        fips: "19015", state: "Iowa",      predicted: 211, ci_low: 201, ci_high: 221, trend: "up" },
  { county: "Washington, CO",   fips: "08121", state: "Colorado",  predicted: 194, ci_low: 184, ci_high: 204, trend: "up" },
];

const staticModelPerformance = [
  { model: "Baseline\n(State+Year)",      r2: 0.271, mae: 18.4  },
  { model: "RF No Lag\n(v1)",             r2: 0.514, mae: 15.95 },
  { model: "XGBoost\n+ Lag Yield (v2)",  r2: 0.771, mae: 12.46 },
];

const staticDataStats = {
  counties: 847,
  yearsCovered: 20,
  trainingRows: 25872,
  features: 22,
  modelR2: 0.771,
  modelMAE: 12.46,
  statesCount: 5,
};

// Four growth stage time points for 2025 season
export const GROWTH_STAGES = [
  { date: "Aug 1", label: "Early Grain Fill",          shortLabel: "Aug 1" },
  { date: "Sep 1", label: "Late Grain Fill / Dough",   shortLabel: "Sep 1" },
  { date: "Oct 1", label: "Maturity / Early Harvest",  shortLabel: "Oct 1" },
  { date: "Final", label: "End of Season",             shortLabel: "Final" },
];

const staticConeData: Record<string, { stage: string; predicted: number; upper: number; lower: number; analog_range: [number, number] }[]> = {
  Iowa: [
    { stage: "Aug 1", predicted: 192, upper: 218, lower: 166, analog_range: [162, 221] },
    { stage: "Sep 1", predicted: 200, upper: 218, lower: 182, analog_range: [175, 222] },
    { stage: "Oct 1", predicted: 206, upper: 216, lower: 196, analog_range: [188, 220] },
    { stage: "Final", predicted: 208, upper: 213, lower: 203, analog_range: [198, 218] },
  ],
  Nebraska: [
    { stage: "Aug 1", predicted: 178, upper: 202, lower: 154, analog_range: [149, 206] },
    { stage: "Sep 1", predicted: 184, upper: 200, lower: 168, analog_range: [162, 204] },
    { stage: "Oct 1", predicted: 188, upper: 197, lower: 179, analog_range: [173, 201] },
    { stage: "Final", predicted: 190, upper: 195, lower: 185, analog_range: [182, 198] },
  ],
  Wisconsin: [
    { stage: "Aug 1", predicted: 171, upper: 193, lower: 149, analog_range: [143, 197] },
    { stage: "Sep 1", predicted: 176, upper: 190, lower: 162, analog_range: [156, 194] },
    { stage: "Oct 1", predicted: 180, upper: 189, lower: 171, analog_range: [165, 192] },
    { stage: "Final", predicted: 182, upper: 187, lower: 177, analog_range: [173, 190] },
  ],
  Missouri: [
    { stage: "Aug 1", predicted: 155, upper: 178, lower: 132, analog_range: [127, 182] },
    { stage: "Sep 1", predicted: 160, upper: 175, lower: 145, analog_range: [140, 179] },
    { stage: "Oct 1", predicted: 164, upper: 173, lower: 155, analog_range: [150, 177] },
    { stage: "Final", predicted: 166, upper: 171, lower: 161, analog_range: [157, 174] },
  ],
  Colorado: [
    { stage: "Aug 1", predicted: 180, upper: 206, lower: 154, analog_range: [148, 210] },
    { stage: "Sep 1", predicted: 186, upper: 203, lower: 169, analog_range: [163, 207] },
    { stage: "Oct 1", predicted: 190, upper: 200, lower: 180, analog_range: [175, 204] },
    { stage: "Final", predicted: 192, upper: 197, lower: 187, analog_range: [183, 200] },
  ],
};

const staticAnalogYears: Record<string, number[]> = {
  Iowa:      [2012, 2016, 2020, 2022, 2023],
  Nebraska:  [2012, 2017, 2020, 2022, 2023],
  Wisconsin: [2011, 2016, 2019, 2021, 2022],
  Missouri:  [2012, 2015, 2019, 2021, 2023],
  Colorado:  [2012, 2016, 2018, 2021, 2022],
};

// ── Live flag ────────────────────────────────────────────────────────────────
export const isLive: boolean = !!live.dataStats;

// ── Merged exports (live overrides static when available) ────────────────────

export const yieldTrends:       typeof staticYieldTrends       = live.yieldTrends       ?? staticYieldTrends;
export const featureImportance: typeof staticFeatureImportance = live.featureImportance ?? staticFeatureImportance;
export const predictions2025:   typeof staticPredictions2025   = live.predictions2025   ?? staticPredictions2025;
export const modelPerformance:  typeof staticModelPerformance  = live.modelPerformance  ?? staticModelPerformance;
export const dataStats:         typeof staticDataStats         = { ...staticDataStats,  ...(live.dataStats  ?? {}) };
export const coneData:          typeof staticConeData          = { ...staticConeData,   ...(live.coneData   ?? {}) };
export const analogYears:       typeof staticAnalogYears       = { ...staticAnalogYears, ...(live.analogYears ?? {}) };

export interface StateForecast {
  state: string; predicted: number; usda2024: number; delta: number;
  countyCount: number; topCounty: string; topYield: number; risingCounties: number;
  xgbForecast?: number; knnForecast?: number;
}
const staticStateForecasts2025: Record<string, StateForecast> = {};
export const stateForecasts2025: Record<string, StateForecast> = live.stateForecasts2025 ?? staticStateForecasts2025;

export const usda2024: Record<string, number> = live.usda2024 ?? {
  Iowa: 211, Nebraska: 184, Wisconsin: 162, Missouri: 175, Colorado: 131,
};
