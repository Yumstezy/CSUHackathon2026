"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";

interface YieldMarker {
  id: string;
  location: [number, number];
  state: string;
  yield: number;
  trend: number;
}

interface GlobeYieldProps {
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
}

const STATE_MARKERS: YieldMarker[] = [
  { id: "iowa",     location: [42.0, -93.5],  state: "Iowa",     yield: 208, trend: 3  },
  { id: "nebraska", location: [41.5, -99.9],  state: "Nebraska", yield: 190, trend: 2  },
  { id: "wisconsin",location: [44.5, -89.6],  state: "Wisconsin",yield: 182, trend: 4  },
  { id: "missouri", location: [38.5, -92.5],  state: "Missouri", yield: 166, trend: 1  },
  { id: "colorado", location: [39.0, -105.5], state: "Colorado", yield: 192, trend: 5  },
];

export function GlobeYield({ className = "", speed = 0.003, style }: GlobeYieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [data, setData] = useState(STATE_MARKERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((m) => ({
          ...m,
          yield: m.yield + Math.floor(Math.random() * 3) - 1,
          trend: Math.max(-10, Math.min(15, m.trend + Math.floor(Math.random() * 3) - 1)),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 2.0; // Start showing North America (~95°W)

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 2.0,
        theta: 0.3,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [0.1, 0.65, 0.25],
        glowColor: [0.9, 0.95, 0.9],
        markerElevation: 0,
        markers: STATE_MARKERS.map((m) => ({ location: m.location, size: 0.07, id: m.id })),
        arcs: [],
        arcColor: [0.2, 0.8, 0.4],
        arcWidth: 1,
        arcHeight: 0.2,
        opacity: 0.8,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.3 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [speed]);

  return (
    <div className={`relative aspect-square select-none ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {data.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            positionAnchor: `--cobe-${m.id}` as any,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 6,
            display: "flex",
            alignItems: "baseline",
            gap: "0.3rem",
            padding: "0.3rem 0.6rem",
            background: "rgba(0,30,0,0.88)",
            borderRadius: 6,
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <span style={{ fontSize: "0.65rem", color: "#86efac", fontWeight: 600 }}>{m.state}</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>
            {m.yield}
          </span>
          <span style={{ fontSize: "0.55rem", color: m.trend >= 0 ? "#34d399" : "#f87171", fontWeight: 500 }}>
            {m.trend >= 0 ? "↑" : "↓"}{Math.abs(m.trend)}%
          </span>
        </div>
      ))}
    </div>
  );
}
