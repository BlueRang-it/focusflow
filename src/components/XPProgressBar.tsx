"use client";

interface XPProgressBarProps {
  level: number;
  currentXP: number;
  showDetails?: boolean;
}

export default function XPProgressBar({ level, currentXP, showDetails = true }: XPProgressBarProps) {
  // XP required for each level (exponential growth)
  const getXPForLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForLevel(level + 1);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(
    100,
    (xpInCurrentLevel / xpNeededForNextLevel) * 100
  );

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">
              Level {level}
            </span>
            <span className="text-sm text-gray-500">
              ({currentXP.toLocaleString()} XP)
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {xpInCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP
          </span>
        </div>
      )}
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
        
        {showDetails && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700 drop-shadow-sm">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {xpNeededForNextLevel - xpInCurrentLevel} XP to Level {level + 1}
        </div>
      )}
    </div>
  );
}
