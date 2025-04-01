import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

interface UrlInfo {
  url: string;
  title: string;
  favicon: string;
}

const SidePanel: React.FC = () => {
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);

  useEffect(() => {
    // 메시지 수신 리스너
    const messageListener = (message: any) => {
      if (message.type === 'UPDATE_URL_INFO') {
        setUrlInfo(message.data);
      }
    };

    // 메시지 리스너 등록
    chrome.runtime.onMessage.addListener(messageListener);

    // 컴포넌트 언마운트 시 정리
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">현재 페이지 정보</h1>
      {urlInfo ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {urlInfo.favicon && (
              <img
                src={urlInfo.favicon}
                alt="favicon"
                className="w-4 h-4"
              />
            )}
            <h2 className="text-lg font-semibold">{urlInfo.title}</h2>
          </div>
          <div className="text-sm text-gray-600 break-all">
            {urlInfo.url}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">페이지 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
} 