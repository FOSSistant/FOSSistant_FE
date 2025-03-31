import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Options: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Extension Options</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Configure your extension settings here.</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
} 