"use client";

import { useState } from "react";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    frequency: string;
    currentStreak: number;
    longestStreak: number;
    targetCount: number;
    totalCompleted: number;
    isActive: boolean;
  };
  onLog: (habitId: string) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

export default function HabitCard({ habit, onLog, onEdit, onDelete }: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "DAILY":
        return "Daily";
      case "WEEKLY":
        return "Weekly";
      case "MULTIPLE_TIMES_DAILY":
        return `${habit.targetCount}x Daily`;
      default:
        return frequency;
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600";
    if (streak >= 7) return "text-blue-600";
    if (streak >= 3) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {habit.category}
            </span>
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{getFrequencyLabel(habit.frequency)}</span>
            <span className={`font-semibold ${getStreakColor(habit.currentStreak)}`}>
              🔥 {habit.currentStreak} day streak
            </span>
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Longest Streak:</span>
                <span className="font-medium">{habit.longestStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Completed:</span>
                <span className="font-medium">{habit.totalCompleted} times</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${habit.isActive ? "text-green-600" : "text-gray-400"}`}>
                  {habit.isActive ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onLog(habit.id)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            disabled={!habit.isActive}
          >
            ✓ Log
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? "Less" : "More"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(habit.id)}
              className="flex-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(habit.id)}
              className="flex-1 px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
