"use client";

const steps = [
  {
    step: "01",
    title: "Satellite Imagery (NDVI)",
    body: "MODIS NDVI (2005–2024, all 21 years) CDL-masked to corn pixels via Google Earth Engine, plus Harmonized Landsat-Sentinel HLS v2.0 (2013–2024) for NDVI/EVI at four phenological windows: vegetative, silking, grain fill, and peak season.",
    badge: "NASA / USGS",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    step: "02",
    title: "Climate Data (gridMET)",
    body: "Daily 4km gridded weather from gridMET (Univ. of Idaho): Tmax/Tmin/Precip/Solar Radiation/VPD, 2005–2024. Derived features: Growing Degree Days (50–86°F base), Extreme Degree Days above 86°F, Vapor Pressure Deficit at silking, cumulative precip windows. Drought severity from US Drought Monitor (D0–D4 weekly).",
    badge: "Univ. of Idaho / USDM",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    step: "03",
    title: "Soil Quality (gSSURGO)",
    body: "USDA gridded SSURGO Valu1 table aggregated to county level: National Commodity Crop Productivity Index for corn (nccpi3corn), available water storage (aws0_100), soil organic carbon (soc0_30), and droughty soil indicator. Static across years — joined to every (county, year) row.",
    badge: "USDA NRCS",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    step: "04",
    title: "Dual-Model Architecture",
    body: "Point estimate: XGBoost trained on 2005–2022 county-year records (val: 2023, holdout: 2024). Cone of uncertainty: K-NN analog-year retrieval (K=10) — standardized features find the 10 most similar historical seasons; their actual yields produce the p10/p50/p90 cone. The cone naturally narrows as more of the season is observed.",
    badge: "XGBoost + KNN",
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

export default function MethodologySection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Methodology</h2>
      <p className="text-sm text-gray-500 mb-6">
        Multi-source data fusion pipeline — satellite, climate, drought, and soil features combined for county-level yield forecasting
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s) => (
          <div key={s.step} className={`rounded-lg border p-4 ${s.color}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl font-black text-gray-200">{s.step}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badgeColor}`}>{s.badge}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">{s.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
