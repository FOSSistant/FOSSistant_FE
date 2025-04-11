import React from 'react';

interface FloatingButtonProps {
  onToggleSidepanel: () => void;
  isDarkMode?: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onToggleSidepanel,
  isDarkMode = false
}) => {
  return (
    <div 
      id="floating-button-container"
      style={{
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      <button
        className={`floating-button ${isDarkMode ? 'dark' : ''}`}
        onClick={onToggleSidepanel}
        aria-label="사이드 패널 열기"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default FloatingButton; 