"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import BackToTop from "@/components/BackToTop";
import { startOfWeek, endOfWeek, format } from "date-fns";

interface WeeklyReview {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  whatWorkedWell?: string | null;
  whatDidntWork?: string | null;
  improvements?: string | null;
  nextWeekPlan?: string | null;
  priorities?: string | null;
  focusAreas?: string | null;
  overallSatisfaction?: number | null;
  tasksCompleted: number;
  averageProductivity: number;
  totalHoursLogged: number;
  generatedInsights?: string | null;
  createdAt: string;
}

export default function WeeklyReviewPage() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReview, setNewReview] = useState({
    weekStartDate: startOfWeek(new Date()).toISOString(),
    weekEndDate: endOfWeek(new Date()).toISOString(),
    whatWorkedWell: "",
    whatDidntWork: "",
    improvements: "",
    nextWeekPlan: "",
    priorities: "",
    focusAreas: "",
    overallSatisfaction: 7,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/weekly-reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async () => {
    try {
      const response = await fetch("/api/weekly-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchReviews();
        alert("Weekly review created! +50 XP");
      }
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500">Loading weekly reviews...</p>
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
              Weekly Reviews
            </h1>
            <p className="text-gray-600">
              Reflect on your progress and plan for success
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No weekly reviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start reflecting on your progress with your first weekly review
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Create Your First Review
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Week of {format(new Date(review.weekStartDate), "MMM d")} -{" "}
                      {format(new Date(review.weekEndDate), "MMM d, yyyy")}
                    </h3>
                    {review.overallSatisfaction && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Satisfaction:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {review.overallSatisfaction}/10
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Completed {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {review.tasksCompleted}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Avg Productivity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {review.averageProductivity.toFixed(1)}/10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Hours Logged</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {review.totalHoursLogged.toFixed(1)}h
                    </p>
                  </div>
                </div>

                {/* AI Insights */}
                {review.generatedInsights && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      🤖 AI Insights
                    </h4>
                    <p className="text-sm text-blue-800 whitespace-pre-line">
                      {review.generatedInsights}
                    </p>
                  </div>
                )}

                {/* Reflections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {review.whatWorkedWell && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        ✅ What Worked Well
                      </h4>
                      <p className="text-gray-700 text-sm">{review.whatWorkedWell}</p>
                    </div>
                  )}

                  {review.whatDidntWork && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        ⚠️ What Didn't Work
                      </h4>
                      <p className="text-gray-700 text-sm">{review.whatDidntWork}</p>
                    </div>
                  )}

                  {review.improvements && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        💡 Improvements
                      </h4>
                      <p className="text-gray-700 text-sm">{review.improvements}</p>
                    </div>
                  )}

                  {review.nextWeekPlan && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        📅 Next Week Plan
                      </h4>
                      <p className="text-gray-700 text-sm">{review.nextWeekPlan}</p>
                    </div>
                  )}

                  {review.priorities && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        🎯 Priorities
                      </h4>
                      <p className="text-gray-700 text-sm">{review.priorities}</p>
                    </div>
                  )}

                  {review.focusAreas && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        🔍 Focus Areas
                      </h4>
                      <p className="text-gray-700 text-sm">{review.focusAreas}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Review Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create Weekly Review
              </h2>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Week Start Date
                    </label>
                    <input
                      type="date"
                      value={format(new Date(newReview.weekStartDate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          weekStartDate: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Week End Date
                    </label>
                    <input
                      type="date"
                      value={format(new Date(newReview.weekEndDate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          weekEndDate: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Satisfaction (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newReview.overallSatisfaction}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        overallSatisfaction: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Poor</span>
                    <span className="font-semibold text-lg text-blue-600">
                      {newReview.overallSatisfaction}
                    </span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What Worked Well?
                  </label>
                  <textarea
                    value={newReview.whatWorkedWell}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        whatWorkedWell: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Celebrate your wins..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What Didn't Work?
                  </label>
                  <textarea
                    value={newReview.whatDidntWork}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        whatDidntWork: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Identify challenges..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas for Improvement
                  </label>
                  <textarea
                    value={newReview.improvements}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        improvements: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="What can you improve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Week's Plan
                  </label>
                  <textarea
                    value={newReview.nextWeekPlan}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        nextWeekPlan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="What's your strategy for next week?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Top Priorities
                  </label>
                  <textarea
                    value={newReview.priorities}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        priorities: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="List your top 3-5 priorities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Areas
                  </label>
                  <textarea
                    value={newReview.focusAreas}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        focusAreas: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Where should you focus your energy?"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReview}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Review (+50 XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Menu */}
        <QuickAccessMenu />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </div>
  );
}
