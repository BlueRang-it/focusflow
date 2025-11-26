"use client";

import { useState } from "react";

interface HelpTooltipProps {
  title: string;
  content: string[];
  position?: "top" | "bottom" | "left" | "right";
}

export default function HelpTooltip({ title, content, position = "bottom" }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors flex items-center justify-center cursor-help"
        aria-label="Help"
      >
        ?
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip content */}
          <div
            className={`absolute z-50 w-80 bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-4 ${positionClasses[position]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              {content.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
