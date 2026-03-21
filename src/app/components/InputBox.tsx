"use client";

import { useState } from "react";

type Props = {
  onSubmit: (value: string) => void;
};

export default function InputBox({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">
        AI Planning Agent
      </h1>

      <textarea
        className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black"
        rows={5}
        placeholder="Enter your problem statement..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={() => onSubmit(value)}
        className="mt-4 bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800"
      >
        Generate Plan
      </button>
    </div>
  );
}