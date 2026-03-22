"use client";

import { useState } from "react";

type Props = {
  title: string;
  content: string;
  onUpdate?: (value: string) => void;
};

export default function Section({ title, content, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (onUpdate) {
      // Preserve formatting - ensure bullets and numbers are maintained
      const saved = preserveFormatting(editValue);
      onUpdate(saved);
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
      // Ensure formatted response maintains bullets/numbers
      const formatted = preserveFormatting(data.data);
      setEditValue(formatted);
      if (onUpdate) {
        onUpdate(formatted);
      }
    } catch (error) {
      console.error("Error refining content:", error);
      alert("Failed to refine content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Preserve bullet and numbering formatting
  const preserveFormatting = (text: string): string => {
    const lines = text.split("\n");
    return lines
      .map((line) => {
        const trimmed = line.trim();
        
        // Already has bullet
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          return trimmed.startsWith("•") ? trimmed : "• " + trimmed.substring(2);
        }
        
        // Already has number
        if (/^\d+\.\s/.test(trimmed)) {
          return trimmed;
        }
        
        // Empty or heading
        if (!trimmed || trimmed.endsWith(":")) {
          return trimmed;
        }
        
        return trimmed;
      })
      .join("\n");
  };

  // Render structured content (lists, paragraphs, etc.)
  const renderContent = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-3 sm:space-y-4">
        {lines.map((line, idx) => {
          // Bullet points
          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <div key={idx} className="flex gap-3 items-start text-gray-700 text-sm sm:text-base leading-relaxed">
                <span className="text-gray-900 font-semibold flex-shrink-0 mt-0.5">•</span>
                <span>{line.replace(/^[•-]\s*/, "")}</span>
              </div>
            );
          }

          // Numbered steps
          if (/^\d+\.\s/.test(line.trim())) {
            const match = line.match(/^(\d+)\.\s(.+)$/);
            if (match) {
              return (
                <div key={idx} className="flex gap-3 items-start text-gray-700 text-sm sm:text-base leading-relaxed">
                  <span className="text-gray-900 font-semibold min-w-6 flex-shrink-0">{match[1]}.</span>
                  <span>{match[2]}</span>
                </div>
              );
            }
          }

          // Bold headings (text ending with :)
          if (line.trim().endsWith(":")) {
            return (
              <p key={idx} className="font-semibold text-gray-900 mt-3 sm:mt-4 mb-2 text-sm sm:text-base">
                {line}
              </p>
            );
          }

          // Regular paragraphs
          return (
            <p key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow print:page-break-inside-avoid">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 flex-col sm:flex-row">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{title}</h3>
        {!isEditing && onUpdate && (
          <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <button
              onClick={() => handleRefine("Make this more detailed and comprehensive, add more context")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
            >
              {isLoading ? "..." : "✨ Detailed"}
            </button>
            <button
              onClick={() => handleRefine("Shorten this significantly while keeping all key points")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs sm:text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
            >
              {isLoading ? "..." : "⚡ Shorten"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
            >
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-gray-200 to-transparent mb-4 sm:mb-6"></div>

      {/* Content View */}
      {!isEditing && <div className="print:text-xs">{renderContent(content)}</div>}

      {/* Edit Mode */}
      {isEditing && onUpdate && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <p className="font-medium mb-1">📝 Editing Tips:</p>
            <ul className="text-xs space-y-1">
              <li>Use • for bullet points (e.g., • Your point)</li>
              <li>Use numbers for lists (e.g., 1. Your step)</li>
              <li>End lines with : for bold headings</li>
            </ul>
          </div>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-700"
            rows={12}
            placeholder="Edit the content here. Maintain formatting with • for bullets and 1. for numbers..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
