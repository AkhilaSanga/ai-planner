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
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
      <div>
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Describe Your Challenge
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
          Provide details about your problem, and we'll generate a comprehensive analysis and action plan.
        </p>

        {/* Input Area */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          rows={5}
          placeholder="Example: We need to improve customer retention by 20% over the next quarter. Our current churn rate is 5%..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-3 sm:mt-4">
          💡 Tip: Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Cmd/Ctrl + Enter</kbd> to submit
        </p>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="mt-4 sm:mt-6 w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isLoading ? (
            <>
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
