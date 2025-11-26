"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HabitCard from "@/components/HabitCard";
import { Card } from "@/components/Card";

interface Habit {
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
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "Personal",
    frequency: "DAILY",
    targetCount: 1,
  });
  const router = useRouter();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits");
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHabit = async () => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewHabit({
          name: "",
          description: "",
          category: "Personal",
          frequency: "DAILY",
          targetCount: 1,
        });
        fetchHabits();
      }
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  };

  const handleLogHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1 }),
      });

      if (response.ok) {
        fetchHabits();
        // Show success message
        alert("Habit logged! +5 XP");
      }
    } catch (error) {
      console.error("Failed to log habit:", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchHabits();
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const activeHabits = habits.filter((h) => h.isActive);
  const inactiveHabits = habits.filter((h) => !h.isActive);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Habits & Routines
            </h1>
            <p className="text-gray-600">
              Build consistency and track your daily habits
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Habit
          </button>
        </div>

        {/* Active Habits */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Active Habits ({activeHabits.length})
          </h2>
          {activeHabits.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No active habits yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start building consistency by creating your first habit
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Create Your First Habit
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLog={handleLogHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Inactive Habits */}
        {inactiveHabits.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-400 mb-4">
              Paused Habits ({inactiveHabits.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
              {inactiveHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLog={handleLogHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Habit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create New Habit
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Morning Exercise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="What does this habit involve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Health">Health</option>
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, frequency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MULTIPLE_TIMES_DAILY">Multiple Times Daily</option>
                  </select>
                </div>

                {newHabit.frequency === "MULTIPLE_TIMES_DAILY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Count Per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newHabit.targetCount}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          targetCount: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateHabit}
                  disabled={!newHabit.name}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
