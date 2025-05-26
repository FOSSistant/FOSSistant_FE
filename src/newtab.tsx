// src/pages/NewTab.tsx
import { createRoot } from "react-dom/client";
import './index.css';  // Tailwind CSS import
import { DashBoard } from "./components/newTab/DashBoard";

const NewTab = () => {

  return (
    <div>
      <DashBoard />
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<NewTab />);
}