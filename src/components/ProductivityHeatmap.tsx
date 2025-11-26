"use client";

import { Card, CardHeader, CardContent } from "./Card";
import { subDays, format, startOfWeek, addDays } from "date-fns";

interface HeatmapData {
  date: string;
  count: number;
}

interface ProductivityHeatmapProps {
  data?: HeatmapData[];
}

export default function ProductivityHeatmap({ data = [] }: ProductivityHeatmapProps) {
  // Generate last 16 weeks for wider display
  const weeks = 16;
  const today = new Date();
  const startDate = subDays(today, weeks * 7);
  
  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-green-200";
    if (count <= 4) return "bg-green-400";
    if (count <= 6) return "bg-green-600";
    return "bg-green-800";
  };

  const getDayData = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayData = data.find(d => d.date === dateStr);
    return dayData?.count || 0;
  };

  // Generate grid of weeks
  const grid: Date[][] = [];
  let currentDate = startOfWeek(startDate);
  
  for (let week = 0; week < weeks; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    grid.push(weekDays);
  }

  return (
    <Card className="col-span-full">
      <div className="px-6 pt-6">
        <h3 className="text-white text-xl font-bold drop-shadow-lg">🔥 Activity Heatmap</h3>
        <p className="text-blue-200 text-base font-semibold drop-shadow">Your productivity over the last 16 weeks</p>
      </div>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex flex-col gap-1 min-w-full">
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              <div className="w-12"></div>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <div key={i} className="w-4 h-4 text-xs text-gray-700 font-semibold flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid - Horizontal Layout */}
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {weekIndex % 4 === 0 && (
                  <div className="w-12 text-sm text-gray-700 font-semibold flex items-center">
                    {format(week[0], "MMM")}
                  </div>
                )}
                {weekIndex % 4 !== 0 && <div className="w-12"></div>}
                {week.map((date, dayIndex) => {
                  const count = getDayData(date);
                  return (
                    <div
                      key={dayIndex}
                      className={`w-4 h-4 rounded ${getIntensity(count)} hover:ring-2 hover:ring-blue-500 hover:scale-110 cursor-pointer transition-all border border-gray-300`}
                      title={`${format(date, "MMM d, yyyy")}: ${count} check-ins`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-6 text-sm text-gray-700 font-semibold">
          <span>Less</span>
          <div className="bg-gray-100 w-4 h-4 rounded border border-gray-300"></div>
          <div className="bg-green-200 w-4 h-4 rounded border border-gray-300"></div>
          <div className="bg-green-400 w-4 h-4 rounded border border-gray-300"></div>
          <div className="bg-green-600 w-4 h-4 rounded border border-gray-300"></div>
          <div className="bg-green-800 w-4 h-4 rounded border border-gray-300"></div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
