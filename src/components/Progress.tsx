"use client";

import clsx from "clsx";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({
  progress,
  className,
  showLabel = true,
  animated = true,
}: ProgressBarProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const getColor = () => {
    if (safeProgress < 33) return "bg-red-500";
    if (safeProgress < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showLabel && <span className="text-sm font-semibold text-gray-900">{safeProgress}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={clsx(
            "h-2 rounded-full transition-all duration-300",
            getColor(),
            animated && "animate-pulse"
          )}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export const StatBox = ({
  label,
  value,
  unit,
  icon,
  trend,
}: StatBoxProps) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      {trend && (
        <p className={clsx("text-xs mt-2 font-semibold", trendColors[trend])}>
          {trend === "up" && "↑"} {trend === "down" && "↓"}
        </p>
      )}
    </div>
  );
};
