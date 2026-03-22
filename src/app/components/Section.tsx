"use client";

import { useState } from "react";

type Props = {
  title: string;
  content: string;
  onUpdate?: (value: string) => void;
};

// Edit instructions for each section
const EDIT_INSTRUCTIONS: { [key: string]: string } = {
  "📋 Problem Breakdown": "Format: Use bullet points (•) to list each problem or issue. Be specific and concise.",
  "👥 Key Stakeholders": "Format: Use bullet points (•) to list stakeholders. Include role and expectations.\nExample: • Customers: Expect excellent service",
  "💡 Solution Approach": "Format: Use bullet points (•) for solution strategies. Explain how each approach addresses the problems.\nExample: • Strategy: Implementation method and benefits",
  "🎯 Action Plan": "Format: Use numbered steps (1. 2. 3.) in chronological order.\nExample:\n1. First step and timeline\n2. Second step and timeline\n3. Third step and timeline",
};

export default function Section({ title, content, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleRefine = async (instruction: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, instruction }),
      });
      const data = await res.json();
      setEditValue(data.data);
      if (onUpdate) {
        onUpdate(data.data);
      }
    } catch (error) {
      console.error("Error refining content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <div key={idx} className="flex gap-3 items-start text-gray-700 text-base leading-relaxed">
                <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>{line.replace(/^[•-]\s*/, "")}</span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(line.trim())) {
            const match = line.match(/^(\d+)\.\s(.+)$/);
            if (match) {
              return (
                <div key={idx} className="flex gap-3 items-start text-gray-700 text-base leading-relaxed">
                  <span className="text-blue-600 font-bold min-w-8 flex-shrink-0">{match[1]}.</span>
                  <span>{match[2]}</span>
                </div>
              );
            }
          }

          if (line.trim().endsWith(":")) {
            return (
              <p key={idx} className="font-bold text-gray-900 mt-5 mb-3 text-base">
                {line}
              </p>
            );
          }

          return (
            <p key={idx} className="text-gray-700 text-base leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow print:page-break-inside-avoid">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        {!isEditing && onUpdate && (
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => handleRefine("Make this more detailed and comprehensive, add more context")}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              {isLoading ? "..." : "✨ Detailed"}
            </button>
            <button
              onClick={() => handleRefine("Shorten this significantly while keeping all key points")}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              {isLoading ? "..." : "⚡ Shorten"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent mb-6 rounded-full"></div>

      {/* Content View */}
      {!isEditing && <div className="print:text-xs">{renderContent(content)}</div>}

      {/* Edit Mode */}
      {isEditing && onUpdate && (
        <div className="space-y-4">
          {/* Edit Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-900 font-semibold mb-2">📝 Edit Instructions:</p>
            <p className="text-sm text-blue-800 whitespace-pre-wrap">
              {EDIT_INSTRUCTIONS[title] || "Edit this section and save your changes."}
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-700 bg-gray-50 resize-none"
            rows={12}
            placeholder="Edit the content here..."
          />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
