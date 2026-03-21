"use client";

import InputBox from "./components/InputBox";

export default function Home() {
  const handleSubmit = (input: string) => {
    console.log("User Input:", input);
  };

  return (
    <main className="p-6">
      <InputBox onSubmit={handleSubmit} />
    </main>
  );
}