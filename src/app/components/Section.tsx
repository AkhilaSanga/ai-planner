"use client";

import { useState } from "react";

type Props = {
  title: string;
  content: string;
  onUpdate: (newContent: string) => void;
};

export default function Section({ title, content, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleEdit = async (instruction: string) => {
    setLoading(true);

    const res = await fetch("/api/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, instruction }),
    });

    const data = await res.json();
    onUpdate(data.data);

    setLoading(false);
  };

  return (
    <div className="border rounded-md p-5 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-gray-700 whitespace-pre-line mb-4">
        {content}
      </p>

      {/* ✅ BUTTONS (THIS IS WHAT YOU WERE MISSING) */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleEdit("Rewrite in a professional tone")}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Rewrite
        </button>

        <button
          onClick={() => handleEdit("Make this more detailed")}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Detailed
        </button>

        <button
          onClick={() => handleEdit("Shorten this")}
          className="px-3 py-1 bg-gray-500 text-white rounded"
        >
          Shorten
        </button>
      </div>

      {loading && <p className="text-sm mt-2">Updating...</p>}
    </div>
  );
}