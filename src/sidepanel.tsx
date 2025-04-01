import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

interface UrlInfo {
  url: string;
  title: string;
  favicon: string;
}

const SidePanel: React.FC = () => {
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);
  const [text, setText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'UPDATE_URL_INFO') {
        setUrlInfo(message.data);
      }
    };

    // 메시지 리스너 등록
    chrome.runtime.onMessage.addListener(messageListener);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleModifyContent = async () => {
    if (!text || !replacement) return;
    setIsLoading(true);

    try {
      // 현재 활성화된 탭 정보 가져오기
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.id) {
        // content script로 메시지 전송
        await chrome.tabs.sendMessage(tab.id, {
          type: 'MODIFY_CONTENT',
          data: { text, replacement }
        });
        
        // 입력 필드 초기화
        setText('');
        setReplacement('');
      }
    } catch (error) {
      console.error('페이지 내용 변경 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">웹 페이지 정보</h1>
      
      {urlInfo ? (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            {urlInfo.favicon && (
              <img src={urlInfo.favicon} alt="favicon" className="w-4 h-4 mr-2" />
            )}
            <h2 className="text-lg font-semibold">{urlInfo.title}</h2>
          </div>
          <p className="text-sm text-gray-600 break-all">{urlInfo.url}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">페이지 내용 변경</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">찾을 텍스트</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="찾을 텍스트를 입력하세요"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">바꿀 텍스트</label>
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="바꿀 텍스트를 입력하세요"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleModifyContent}
            className={`w-full py-2 px-4 rounded ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? '변경 중...' : '변경하기'}
          </button>
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