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
      <div className="space-y-3">
        {lines.map((line, idx) => {
          // Bullet points
          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <div key={idx} className="flex gap-3 text-gray-700">
                <span className="text-blue-500 font-bold">•</span>
                <span>{line.replace(/^[•-]\s*/, "")}</span>
              </div>
            );
          }

          // Numbered steps
          if (/^\d+\.\s/.test(line.trim())) {
            return (
              <div key={idx} className="flex gap-3 text-gray-700">
                <span className="font-semibold text-blue-500 min-w-6">
                  {line.match(/^\d+/)?.[0]}.
                </span>
                <span>{line.replace(/^\d+\.\s*/, "")}</span>
              </div>
            );
          }

          // Bold headings (text ending with :)
          if (line.trim().endsWith(":")) {
            return (
              <p key={idx} className="font-semibold text-gray-900 mt-2">
                {line}
              </p>
            );
          }

          // Regular paragraphs
          return (
            <p key={idx} className="text-gray-700 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {!isEditing && onUpdate && (
          <div className="flex gap-2">
            <button
              onClick={() => handleRefine("Make this more detailed and comprehensive")}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
            >
              {isLoading ? "..." : "✨ Detailed"}
            </button>
            <button
              onClick={() => handleRefine("Shorten this significantly while keeping key points")}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 disabled:opacity-50"
            >
              {isLoading ? "..." : "⚡ Shorten"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

      {/* Content View */}
      {!isEditing && <div>{renderContent(content)}</div>}

      {/* Edit Mode */}
      {isEditing && onUpdate && (
        <div className="space-y-3">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={8}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
