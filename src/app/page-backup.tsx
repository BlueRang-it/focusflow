"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 -right-48 animate-pulse" style={{animationDelay: '700ms'}}></div>
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse" style={{animationDelay: '1400ms'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">⚡</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FocusFlow Pro
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <button className="px-6 py-2 text-white hover:text-blue-300 transition-colors font-medium">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
              🚀 The Future of Productivity
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your Day,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Level Up Your Life
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The gamified productivity platform that makes achieving goals addictive. 
            Track, analyze, and dominate your daily objectives with AI-powered insights.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/auth/signup">
              <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105">
                🚀 Start Free Today
              </button>
            </Link>
            <Link href="#features">
              <button className="px-10 py-4 bg-white/10 backdrop-blur text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                ✨ See Features
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-400">Productive Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">1M+</div>
              <div className="text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">99%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mb-20">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h3 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed to help you achieve more, stay focused, and build lasting habits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Dashboard</h3>
              <p className="text-gray-400">Track your productivity, progress, and streaks in real-time with beautiful visualizations.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-xl font-bold text-white mb-3">Hourly Check-Ins</h3>
              <p className="text-gray-400">Stay focused with guided check-ins that help you track accomplishments and maintain momentum.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📝</div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Tasks</h3>
              <p className="text-gray-400">Prioritize your work intelligently with smart task management and deadline tracking.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
              <h3 className="text-xl font-bold text-white mb-3">Build Streaks</h3>
              <p className="text-gray-400">Maintain daily streaks and build powerful habits with consistency rewards.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">Deep Analytics</h3>
              <p className="text-gray-400">Understand your productivity patterns with advanced insights and trend analysis.</p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h3 className="text-xl font-bold text-white mb-3">Gamification</h3>
              <p className="text-gray-400">Earn XP, unlock badges, and level up as you achieve your productivity goals.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-white text-center mb-20 border-4 border-white/20">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Productivity?</h3>
          <p className="text-xl mb-8 text-white/90">Join thousands of users who are achieving their goals with FocusFlow Pro</p>
          <Link href="/auth/signup">
            <button className="px-12 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105">
              Get Started Free →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur border-t border-white/10 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-2xl">⚡</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FocusFlow Pro
            </span>
          </div>
          <p className="text-gray-400">&copy; 2024 FocusFlow Pro. Built to help you achieve your goals.</p>
          <p className="text-sm text-gray-500 mt-2">Made with ❤️ for productivity enthusiasts</p>
        </div>
      </footer>
    </div>
  );
}
