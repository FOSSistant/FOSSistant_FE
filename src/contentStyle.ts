// content script에서 사용하는 스타일 주입 함수
export function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #floating-button-container {
      position: fixed;
      z-index: 2147483647;
      right: 1rem;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      pointer-events: auto;
      touch-action: none;
      user-select: none;
    }

    .floating-button {
      pointer-events: auto;
      width: 3.5rem;
      height: 3.5rem;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #2D333B 0%, #22272E 100%);
      color: white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 0.75rem;
    }

    .floating-button:hover {
      transform: translateX(-4px);
      background: linear-gradient(135deg, #373E47 0%, #2D333B 100%);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }

    .floating-button-icon {
      stroke: currentColor;
      width: 100%;
      height: 100%;
    }

    .custom-label-style {
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      margin-right: 8px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      line-height: 1;
      vertical-align: middle;
      border: 1px solid;
    }
  `;
  document.head.appendChild(style);
} 