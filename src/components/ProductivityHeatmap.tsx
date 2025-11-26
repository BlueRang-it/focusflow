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
  // Generate last 12 weeks of dates
  const weeks = 12;
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
    <Card>
      <CardHeader 
        title="🔥 Activity Heatmap" 
        subtitle="Your productivity over the last 12 weeks"
      />
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            {/* Day labels */}
            <div className="flex gap-1 mb-1">
              <div className="w-8"></div>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="w-3 h-3 text-xs text-gray-500 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {weekIndex % 4 === 0 && (
                  <div className="w-8 text-xs text-gray-500 flex items-center">
                    {format(week[0], "MMM")}
                  </div>
                )}
                {weekIndex % 4 !== 0 && <div className="w-8"></div>}
                {week.map((date, dayIndex) => {
                  const count = getDayData(date);
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getIntensity(count)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                      title={`${format(date, "MMM d, yyyy")}: ${count} check-ins`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="bg-gray-100 w-3 h-3 rounded-sm"></div>
          <div className="bg-green-200 w-3 h-3 rounded-sm"></div>
          <div className="bg-green-400 w-3 h-3 rounded-sm"></div>
          <div className="bg-green-600 w-3 h-3 rounded-sm"></div>
          <div className="bg-green-800 w-3 h-3 rounded-sm"></div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
