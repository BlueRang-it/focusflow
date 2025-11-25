"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">FocusFlow</h1>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Master Your Productivity
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Beat procrastination, stay motivated, and achieve your goals with hourly check-ins, real-time analytics, and intelligent insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg">
                Start Free Today
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Dashboard</h3>
              <p className="text-gray-600">Track your productivity, progress, and streaks in real-time with beautiful visualizations.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hourly Check-Ins</h3>
              <p className="text-gray-600">Stay focused with guided check-ins that help you track accomplishments and maintain momentum.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Tasks</h3>
              <p className="text-gray-600">Prioritize your work intelligently with smart task management and deadline tracking.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Build Streaks</h3>
              <p className="text-gray-600">Maintain daily streaks and build powerful habits with consistency rewards.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Analytics</h3>
              <p className="text-gray-600">Understand your productivity patterns with advanced insights and trend analysis.</p>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardContent>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gamification</h3>
              <p className="text-gray-600">Earn XP, unlock badges, and level up as you achieve your productivity goals.</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">How FocusFlow Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Tasks</h4>
              <p className="text-gray-600 text-sm">Add your daily tasks with priorities and time estimates.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Hourly Check-Ins</h4>
              <p className="text-gray-600 text-sm">Log what you accomplished and rate your productivity each hour.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-gray-600 text-sm">See real-time analytics and insights about your productivity patterns.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Build Streaks</h4>
              <p className="text-gray-600 text-sm">Maintain consistency and earn rewards with our gamification system.</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose FocusFlow?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">💪</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Beat Procrastination</h4>
                <p className="text-gray-600">Hourly check-ins and smart reminders keep you accountable and on track.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Stay Focused</h4>
                <p className="text-gray-600">Clear task prioritization and work blocks help you maintain deep focus.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data-Driven Insights</h4>
                <p className="text-gray-600">Understand your productivity patterns and optimize your workflow.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🏅</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Stay Motivated</h4>
                <p className="text-gray-600">Gamification and rewards make productivity fun and engaging.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🔔</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Notifications</h4>
                <p className="text-gray-600">Timely reminders and alerts keep you on pace without being intrusive.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📝</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reflection Journal</h4>
                <p className="text-gray-600">Track your thoughts, learnings, and progress over time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-12 text-white text-center mb-20">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Productivity?</h3>
          <p className="text-lg mb-8 text-blue-100">Join thousands of users who are achieving their goals with FocusFlow.</p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2024 FocusFlow. Built to help you achieve your goals.</p>
          <p className="text-sm text-gray-500 mt-2">Made with ❤️ for productivity enthusiasts</p>
        </div>
      </footer>
    </div>
  );
}
