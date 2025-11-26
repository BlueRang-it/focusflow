"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";

interface AIInsightsProps {
  userData?: {
    level: number;
    xp: number;
    streak: number;
  };
  dailyProgress?: {
    completedTasks: number;
    totalTasks: number;
    checkInCount: number;
    averageRating: number;
  };
}

export default function AIInsights({ userData, dailyProgress }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newInsights: string[] = [];
      
      // Analyze streak
      if (userData?.streak && userData.streak > 7) {
        newInsights.push(`🔥 Impressive ${userData.streak}-day streak! You're building strong habits.`);
      } else if (userData?.streak === 0) {
        newInsights.push("🎯 Start a streak today! Consistency is the key to success.");
      }
      
      // Analyze check-ins
      if (dailyProgress?.checkInCount) {
        if (dailyProgress.checkInCount >= 8) {
          newInsights.push("⭐ You're checking in regularly throughout the day. Excellent self-awareness!");
        } else if (dailyProgress.checkInCount < 4) {
          newInsights.push("📝 Try checking in more frequently (target: 8 times/day) for better tracking.");
        }
      }
      
      // Analyze productivity rating
      if (dailyProgress?.averageRating) {
        if (dailyProgress.averageRating >= 8) {
          newInsights.push("💪 Your productivity rating is outstanding! Keep up the great work.");
        } else if (dailyProgress.averageRating < 5) {
          newInsights.push("💡 Your ratings suggest room for improvement. Consider identifying blockers.");
        }
      }
      
      // Analyze task completion
      if (dailyProgress?.completedTasks && dailyProgress?.totalTasks) {
        const completion = (dailyProgress.completedTasks / dailyProgress.totalTasks) * 100;
        if (completion >= 80) {
          newInsights.push("✅ Strong task completion rate! You're crushing your goals.");
        } else if (completion < 50) {
          newInsights.push("📋 Focus on completing fewer, high-priority tasks first.");
        }
      }
      
      // Level-based insights
      if (userData?.level) {
        if (userData.level >= 10) {
          newInsights.push("🏆 You're a productivity master! Consider sharing your strategies.");
        } else if (userData.level < 5) {
          newInsights.push("🌱 You're building momentum. Small daily wins compound over time!");
        }
      }
      
      // General recommendations
      newInsights.push("💡 Pro tip: Use the Pomodoro timer for deep focus sessions.");
      newInsights.push("📊 Review your weekly analytics to identify patterns and optimize.");
      
      setInsights(newInsights);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader 
        title="🤖 AI Insights" 
        subtitle="Personalized productivity recommendations"
      />
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🧠</div>
            <p className="text-gray-600 mb-4">
              Get AI-powered insights about your productivity patterns
            </p>
            <Button onClick={generateInsights} disabled={loading}>
              {loading ? "Analyzing..." : "Generate Insights"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="p-3 bg-white rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
            <Button 
              onClick={generateInsights} 
              variant="secondary" 
              size="sm"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "🔄 Refresh Insights"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
