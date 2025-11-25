"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

interface CheckInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckInModal = ({ onClose, onSuccess }: CheckInModalProps) => {
  const [accomplishment, setAccomplishment] = useState("");
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState("NEUTRAL");
  const [blockers, setBlockers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const moods = [
    { value: "VERY_UNHAPPY", label: "😞", name: "Very Unhappy" },
    { value: "UNHAPPY", label: "😕", name: "Unhappy" },
    { value: "NEUTRAL", label: "😐", name: "Neutral" },
    { value: "HAPPY", label: "🙂", name: "Happy" },
    { value: "VERY_HAPPY", label: "😄", name: "Very Happy" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accomplishment,
          productivityRating: rating,
          mood,
          blockers,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create check-in");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-500 to-indigo-600 text-white p-6 border-b">
          <h2 className="text-2xl font-bold">How&apos;re you doing? ✅</h2>
          <p className="text-sm mt-1 text-blue-100">Hourly check-in</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Accomplishment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              What did you accomplish this hour?
            </label>
            <textarea
              value={accomplishment}
              onChange={(e) => setAccomplishment(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="e.g., Completed design mockups, fixed bugs, attended meeting..."
            />
          </div>

          {/* Productivity Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How productive were you? {rating}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How do you feel right now?
            </label>
            <div className="flex justify-around gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    mood === m.value
                      ? "bg-blue-100 border-2 border-blue-500 scale-110"
                      : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
                  }`}
                  title={m.name}
                >
                  <span className="text-3xl">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Any blockers or distractions? (optional)
            </label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="e.g., Interrupted by meetings, distracted by notifications..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
            >
              {loading ? "Submitting..." : "Submit Check-In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
