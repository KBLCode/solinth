import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  href?: string;
}

/**
 * Solinth Logo Component
 *
 * Displays the Solinth logo with optional text
 * Uses Radiant Amber gradient for brand consistency
 */

export function Logo({
  size = 40,
  className,
  showText = true,
  href = "/",
}: LogoProps) {
  const logoContent = (
    <div className="flex items-center gap-3">
      {/* Solinth Icon - Sun/Metric Symbol */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          className
        )}
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #FFA845 0%, #FFD67C 100%)",
          boxShadow: "0 4px 12px rgba(255, 168, 69, 0.3)",
        }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun rays representing metrics/data */}
          <circle cx="12" cy="12" r="4" fill="white" />
          <path
            d="M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className="bg-solar-gradient bg-clip-text text-xl font-bold text-transparent">
          Solinth
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center transition-opacity hover:opacity-80"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
