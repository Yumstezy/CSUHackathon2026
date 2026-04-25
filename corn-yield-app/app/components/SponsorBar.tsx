"use client";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Sparkles } from "@/components/ui/sparkles";

const SOURCES = [
  { src: "/logos/nasa.png",        name: "NASA",         desc: "HLS Satellite · Prithvi" },
  { src: "/logos/usda.png",        name: "USDA",         desc: "NASS Yield · NRCS gSSURGO" },
  { src: "/logos/aws.png",         name: "AWS",          desc: "SageMaker Training" },
  { src: "/logos/google-earth.png",name: "Google Earth", desc: "Earth Engine · NDVI Export" },
  { src: "/logos/esri.png",        name: "Esri",         desc: "GIS Infrastructure" },
  { src: "/logos/databricks.png",  name: "Databricks",   desc: "Data Platform" },
];

export default function SponsorBar() {
  return (
    <div className="relative rounded-xl bg-gray-900 overflow-hidden py-5">
      <Sparkles color="#16a34a" density={30} />

      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Powered by
      </p>

      <div className="relative">
        <InfiniteSlider gap={24} duration={30} className="py-1">
          {SOURCES.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 shadow-sm whitespace-nowrap"
              style={{ minWidth: 160 }}
            >
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-gray-900 text-xs font-bold leading-none">{s.name}</p>
                <p className="text-gray-400 text-[10px] leading-none mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </InfiniteSlider>

        <ProgressiveBlur direction="left"  className="absolute inset-y-0 left-0  w-20 h-full" />
        <ProgressiveBlur direction="right" className="absolute inset-y-0 right-0 w-20 h-full" />
      </div>
    </div>
  );
}
