import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const SidePanel: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">사이드 패널</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">섹션 1</h2>
          <p className="text-gray-600">여기에 내용을 추가하세요.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">섹션 2</h2>
          <p className="text-gray-600">여기에 내용을 추가하세요.</p>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
} 