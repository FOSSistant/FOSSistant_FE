import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Popup: React.FC = () => {
  return (
    <div className="w-64 p-4">
      <h1 className="text-xl font-bold mb-4">Chrome Extension</h1>
      <p className="text-gray-600">Welcome to your Chrome Extension!</p>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
} 