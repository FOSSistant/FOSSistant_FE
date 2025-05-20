// src/pages/NewTab.tsx
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { FeatureList } from "./components/FeatureList";
import { FeatureDetail } from "./components/FeatureDetail";
import './index.css';  // Tailwind CSS import

const NewTab = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-200 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">FOSSistant</h1>
          <p className="text-gray-400 mt-2 text-sm">오픈소스 기여 도우미</p>
        </div>

        {selected === null ? (
          <FeatureList onSelect={setSelected} />
        ) : (
          <FeatureDetail index={selected} onBack={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<NewTab />);
}