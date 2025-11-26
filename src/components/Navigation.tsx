"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import NotificationBell from "./NotificationBell";

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Don't show navigation on auth pages
  if (pathname?.startsWith("/auth/") || pathname === "/") {
    return null;
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠", isHome: true },
    { name: "Tasks", path: "/tasks", icon: "📋" },
    { name: "Habits", path: "/habits", icon: "🎯" },
    { name: "Journal", path: "/journal", icon: "📔" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "Weekly Review", path: "/weekly-review", icon: "📈" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Clock */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
              title="Home - Go to Dashboard"
            >
              ⚡ FocusFlow Pro
            </button>
            
            {/* Digital Clock */}
            <div className="hidden md:flex flex-col items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-gray-900 font-mono tracking-wider">
                {format(currentTime, "HH:mm:ss")}
              </div>
              <div className="text-xs text-gray-600">
                {format(currentTime, "EEE, MMM d")}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${item.isHome ? "ring-2 ring-blue-200" : ""}`}
                title={item.isHome ? "Home - Dashboard" : item.name}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden xl:inline">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Side - Notifications & User */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            {session?.user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user.email}
                  </p>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation & Clock */}
        <div className="lg:hidden pb-3">
          {/* Mobile Clock */}
          <div className="flex justify-center mb-3 md:hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-gray-900 font-mono tracking-wider text-center">
                {format(currentTime, "HH:mm:ss")}
              </div>
              <div className="text-xs text-gray-600 text-center">
                {format(currentTime, "EEE, MMM d, yyyy")}
              </div>
            </div>
          </div>
          
          {/* Mobile Nav Items */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 bg-white"
                } ${item.isHome ? "ring-2 ring-blue-300" : ""}`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
