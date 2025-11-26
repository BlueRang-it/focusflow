"use client";

interface Badge {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  criterion: string;
  earnedAt: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  compact?: boolean;
}

export default function BadgeDisplay({ badges, compact = false }: BadgeDisplayProps) {
  const getBadgeIcon = (criterion: string, icon?: string | null) => {
    if (icon) return icon;
    
    // Default icons based on criterion
    if (criterion.includes("first")) return "🌟";
    if (criterion.includes("streak")) return "🔥";
    if (criterion.includes("check_in")) return "✅";
    if (criterion.includes("task")) return "📋";
    if (criterion.includes("level")) return "⬆️";
    if (criterion.includes("perfect")) return "💯";
    return "🏆";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 5).map((badge) => (
          <div
            key={badge.id}
            className="relative group"
            title={badge.name}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl shadow-md hover:scale-110 transition-transform cursor-pointer">
              {getBadgeIcon(badge.criterion, badge.icon)}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {badge.name}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
        {badges.length > 5 && (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            +{badges.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl shadow-md mb-3">
              {getBadgeIcon(badge.criterion, badge.icon)}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {badge.name}
            </h3>
            {badge.description && (
              <p className="text-xs text-gray-600 mb-2">
                {badge.description}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Earned {formatDate(badge.earnedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
