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

  // Render structured content (lists, paragraphs, etc.)
  const renderContent = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-4 text-slate-700">
        {lines.map((line, idx) => {
          // Bullet points
          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                <span className="pt-0.5">{line.replace(/^[•-]\s*/, "")}</span>
              </div>
            );
          }

          // Numbered steps
          if (/^\d+\.\s/.test(line.trim())) {
            const match = line.match(/^(\d+)\.\s(.+)$/);
            if (match) {
              return (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="font-bold text-blue-600 min-w-8 flex-shrink-0">{match[1]}.</span>
                  <span className="pt-0.5">{match[2]}</span>
                </div>
              );
            }
          }

          // Bold headings (text ending with :)
          if (line.trim().endsWith(":") && line.trim().length > 2) {
            return (
              <p key={idx} className="font-bold text-slate-900 mt-4 mb-2 text-lg">
                {line}
              </p>
            );
          }

          // Regular paragraphs
          return (
            <p key={idx} className="leading-relaxed text-slate-700">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow print:page-break-inside-avoid">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        {!isEditing && onUpdate && (
          <div className="flex gap-2">
            <button
              onClick={() => handleRefine("Make this more detailed and comprehensive, add more context")}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? "..." : "✨ Detailed"}
            </button>
            <button
              onClick={() => handleRefine("Shorten this significantly while keeping all key points")}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? "..." : "⚡ Shorten"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors font-medium"
            >
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-transparent mb-6"></div>

      {/* Content View */}
      {!isEditing && <div className="print:text-xs">{renderContent(content)}</div>}

      {/* Edit Mode */}
      {isEditing && onUpdate && (
        <div className="space-y-4">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-slate-700"
            rows={10}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
