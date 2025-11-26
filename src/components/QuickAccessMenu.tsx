"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickAccessMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const quickActions = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠", color: "bg-blue-500" },
    { name: "New Task", path: "/tasks", icon: "📝", color: "bg-green-500" },
    { name: "Journal", path: "/journal", icon: "📔", color: "bg-purple-500" },
    { name: "Analytics", path: "/analytics", icon: "📊", color: "bg-orange-500" },
    { name: "Habits", path: "/habits", icon: "🎯", color: "bg-pink-500" },
  ];

  const handleAction = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center text-2xl"
        title="Quick Access Menu"
      >
        {isOpen ? "✕" : "⚡"}
      </button>

      {/* Quick Access Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-gray-200">
          <div className="text-sm font-semibold text-gray-700 mb-3">Quick Access</div>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => handleAction(action.path)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-xl`}>
                  {action.icon}
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
