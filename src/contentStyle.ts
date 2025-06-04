// content script에서 사용하는 스타일 주입 함수
export function injectStyles() {
  // 스타일이 이미 주입되었는지 확인
  if (document.getElementById('fossistant-styles')) {
    return;
  }

  const styles = `
    /* FOSSistant 커스텀 스타일 */
    .custom-label {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      padding: 3px 8px !important;
      margin-right: 8px !important;
      border-radius: 12px !important;
      border: 1px solid !important;
      text-transform: capitalize !important;
    }

    .custom-label-style {
      transition: all 0.2s ease !important;
    }

    .custom-label-style:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .loading-label {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }

    .loading-spinner {
      width: 12px !important;
      height: 12px !important;
      border: 2px solid transparent !important;
      border-top: 2px solid currentColor !important;
      border-radius: 50% !important;
      animation: spin 1s linear infinite !important;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* 하이라이트 애니메이션 */
    @keyframes recommend-pulse {
      0%, 100% { 
        box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 16px rgba(255, 193, 7, 0.8);
        transform: scale(1.02);
      }
    }

    /* 텍스트 하이라이트 스타일 */
    .fossistant-highlight {
      background: linear-gradient(120deg, #fef08a 0%, #facc15 100%) !important;
      color: #1f2937 !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1) !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
      transition: all 0.3s ease !important;
      animation: highlight-blink 3s ease-in-out !important;
      position: relative !important;
      z-index: 1000 !important;
    }

    @keyframes highlight-blink {
      0%, 100% { opacity: 1; }
      20%, 40%, 60%, 80% { opacity: 0.8; }
    }

    .fossistant-highlight::before {
      content: '' !important;
      position: absolute !important;
      top: -2px !important;
      left: -2px !important;
      right: -2px !important;
      bottom: -2px !important;
      background: linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24) !important;
      border-radius: 6px !important;
      z-index: -1 !important;
      animation: highlight-glow 2s ease-in-out infinite !important;
    }

    @keyframes highlight-glow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
  `;

  // 스타일 엘리먼트 생성 및 삽입
  const styleSheet = document.createElement('style');
  styleSheet.id = 'fossistant-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  console.log('✅ FOSSistant 스타일 주입 완료');
} 