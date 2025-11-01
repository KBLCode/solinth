"use client";

import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * Shader Background Component - PERFORMANCE OPTIMIZED
 *
 * Features:
 * - Pauses animation when scrolled past the hero section
 * - Uses Intersection Observer for efficient scroll detection
 * - Reduces GPU usage when not visible
 * - Maintains visual quality when active
 * - Solinth brand colors (Radiant Amber, Solar White, Sky Mist)
 */

export function ShaderBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create intersection observer to detect when hero section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Pause shader when less than 20% of hero is visible
        setIsVisible(entry.intersectionRatio > 0.2);
      },
      {
        threshold: [0, 0.2, 0.5, 1], // Multiple thresholds for smooth transitions
        rootMargin: "0px 0px -10% 0px", // Start pausing slightly before fully scrolled past
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      {isVisible ? (
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={[
            "#FFA845", // Radiant Amber
            "#FFFFFF", // Solar White
            "#FFFFFF",
            "#FFD67C", // Solar Gradient Light
            "#FFFFFF",
            "#FFFFFF",
            "#EADAC0", // Midday Sand
            "#FFFFFF",
            "#FFFFFF",
            "#FFA845", // Radiant Amber
            "#FFFFFF",
            "#FFFFFF",
            "#D8E3F0", // Sky Mist
            "#FFFFFF",
            "#FFFFFF",
            "#FFB347", // Solar Flare
            "#FFFFFF",
            "#FFFFFF",
          ]}
          speed={0.4} // Slightly reduced for better performance
        />
      ) : (
        // Static fallback when paused - maintains visual continuity
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background: `
              radial-gradient(ellipse 1000px 800px at 15% 25%, rgba(255, 168, 69, 0.3) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              radial-gradient(ellipse 800px 1000px at 85% 15%, rgba(255, 214, 124, 0.25) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              radial-gradient(ellipse 900px 700px at 65% 75%, rgba(234, 218, 192, 0.2) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              radial-gradient(ellipse 1100px 900px at 25% 85%, rgba(255, 168, 69, 0.35) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              radial-gradient(ellipse 700px 1100px at 90% 65%, rgba(216, 227, 240, 0.25) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              radial-gradient(ellipse 1000px 800px at 10% 90%, rgba(255, 179, 71, 0.2) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 60%),
              #FFFFFF
            `,
          }}
        />
      )}
    </div>
  );
}
