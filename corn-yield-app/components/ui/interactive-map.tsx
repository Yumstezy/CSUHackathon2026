"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createYieldIcon = (yield_val: number) => {
  const color = yield_val >= 205 ? "#16a34a" : yield_val >= 190 ? "#65a30d" : yield_val >= 175 ? "#d97706" : "#dc2626";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      color:#fff;
      border:2px solid #fff;
      border-radius:50%;
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:10px;
      font-weight:700;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      line-height:1;
    ">${yield_val}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

interface CountyMarker {
  id: string;
  position: [number, number];
  county: string;
  state: string;
  predicted: number;
  ci_low: number;
  ci_high: number;
}

const COUNTY_MARKERS: CountyMarker[] = [
  { id: "1", position: [41.83, -94.01], county: "Adair",     state: "Iowa",     predicted: 212, ci_low: 202, ci_high: 222 },
  { id: "2", position: [42.07, -91.59], county: "Linn",      state: "Iowa",     predicted: 210, ci_low: 200, ci_high: 220 },
  { id: "3", position: [42.04, -93.79], county: "Boone",     state: "Iowa",     predicted: 211, ci_low: 201, ci_high: 221 },
  { id: "4", position: [41.39, -95.44], county: "Cass",      state: "Iowa",     predicted: 209, ci_low: 199, ci_high: 219 },
  { id: "5", position: [41.57, -97.38], county: "Platte",    state: "Nebraska", predicted: 208, ci_low: 198, ci_high: 218 },
  { id: "6", position: [41.43, -96.67], county: "Dodge",     state: "Nebraska", predicted: 205, ci_low: 195, ci_high: 215 },
  { id: "7", position: [40.72, -99.12], county: "Phelps",    state: "Nebraska", predicted: 203, ci_low: 193, ci_high: 213 },
  { id: "8", position: [44.49, -87.80], county: "Kewaunee",  state: "Wisconsin",predicted: 196, ci_low: 187, ci_high: 205 },
  { id: "9", position: [43.77, -88.44], county: "Fond du Lac",state:"Wisconsin",predicted: 192, ci_low: 183, ci_high: 201 },
  { id: "10",position: [39.97,-103.15], county: "Washington", state: "Colorado", predicted: 194, ci_low: 184, ci_high: 204 },
];

// State circles — approximate centers + radii for visual effect
const STATE_CIRCLES = [
  { center: [42.0, -93.5]  as [number,number], radius: 180000, color: "#16a34a", state: "Iowa",      avg: 208 },
  { center: [41.5, -99.9]  as [number,number], radius: 220000, color: "#2563eb", state: "Nebraska",  avg: 190 },
  { center: [44.5, -89.6]  as [number,number], radius: 160000, color: "#7c3aed", state: "Wisconsin", avg: 182 },
  { center: [38.5, -92.5]  as [number,number], radius: 200000, color: "#dc2626", state: "Missouri",  avg: 166 },
  { center: [39.0,-105.5]  as [number,number], radius: 170000, color: "#d97706", state: "Colorado",  avg: 192 },
];

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[36.5, -109.5], [47.5, -87.0]], { padding: [30, 30] });
  }, [map]);
  return null;
}

export function CornYieldMap({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`} style={{ minHeight: 420 }}><p className="text-gray-400 text-sm">Loading map...</p></div>;

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${className}`} style={{ minHeight: 420 }}>
      <MapContainer
        center={[41.5, -96]}
        zoom={5}
        style={{ height: "100%", width: "100%", minHeight: 420 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds />

        {/* State coverage circles */}
        {STATE_CIRCLES.map((sc) => (
          <Circle
            key={sc.state}
            center={sc.center}
            radius={sc.radius}
            pathOptions={{ color: sc.color, fillColor: sc.color, fillOpacity: 0.08, weight: 2, dashArray: "6 4" }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{sc.state}</p>
                <p>State avg forecast: <strong>{sc.avg} bu/ac</strong></p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* County markers */}
        {COUNTY_MARKERS.map((m) => (
          <Marker key={m.id} position={m.position} icon={createYieldIcon(m.predicted)}>
            <Popup>
              <div className="text-sm min-w-[160px]">
                <p className="font-bold text-base">{m.county} Co., {m.state}</p>
                <p className="mt-1">2025 Forecast: <strong>{m.predicted} bu/ac</strong></p>
                <p className="text-gray-500 text-xs">90% CI: {m.ci_low}–{m.ci_high} bu/ac</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
