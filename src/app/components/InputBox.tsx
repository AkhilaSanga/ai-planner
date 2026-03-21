"use client";

import { useState } from "react";

type Props = {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
};

export default function InputBox({ onSubmit, isLoading = false }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-8 border border-gray-200">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Describe Your Challenge
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Provide details about your problem, and we will generate a comprehensive analysis and action plan.
        </p>

        {/* Input Area */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
          rows={6}
          placeholder="Example: We need to improve customer retention by 20% over the next quarter. Our current churn rate is 5% and we want to reduce it to 4%..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Press <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Cmd/Ctrl + Enter</kbd> to submit
        </p>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              ✨ Generate Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
