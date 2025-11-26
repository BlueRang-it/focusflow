"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === "focus") {
      setSessions(sessions + 1);
      // Play notification sound
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Focus session complete!", {
            body: "Great work! Time for a break.",
            icon: "⏰",
          });
        }
      }
      setMode("break");
      setMinutes(5);
      setSeconds(0);
    } else {
      setMode("focus");
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "focus" ? 25 : 5);
    setSeconds(0);
  };

  const setFocusMode = (duration: number) => {
    setIsActive(false);
    setMode("focus");
    setMinutes(duration);
    setSeconds(0);
  };

  const progress = mode === "focus" 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <Card className={`${mode === "focus" ? "bg-gradient-to-br from-red-50 to-orange-50" : "bg-gradient-to-br from-green-50 to-teal-50"}`}>
      <CardHeader 
        title={mode === "focus" ? "🎯 Focus Timer" : "☕ Break Time"} 
        subtitle={`${sessions} sessions completed`}
      />
      <CardContent>
        <div className="text-center">
          {/* Timer Display */}
          <div className="relative inline-block">
            <svg className="transform -rotate-90" width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={mode === "focus" ? "#ef4444" : "#10b981"}
                strokeWidth="10"
                fill="none"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 - (565.48 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-5xl font-bold text-gray-900">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-600 mt-1 capitalize">{mode}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={toggleTimer}
              variant={isActive ? "secondary" : "primary"}
              size="lg"
            >
              {isActive ? "⏸️ Pause" : "▶️ Start"}
            </Button>
            <Button onClick={resetTimer} variant="secondary" size="lg">
              🔄 Reset
            </Button>
          </div>

          {/* Quick Presets */}
          {!isActive && mode === "focus" && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setFocusMode(15)}
                className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-50"
              >
                15m
              </button>
              <button
                onClick={() => setFocusMode(25)}
                className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-50"
              >
                25m
              </button>
              <button
                onClick={() => setFocusMode(45)}
                className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-50"
              >
                45m
              </button>
              <button
                onClick={() => setFocusMode(60)}
                className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-50"
              >
                60m
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
