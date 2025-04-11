import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UrlInfo, Note } from './types';
import './index.css';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<UrlInfo | null>(null);
  const [recentUrls, setRecentUrls] = useState<UrlInfo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 현재 URL 정보 로드
    chrome.storage.local.get(['currentUrlInfo'], (result) => {
      if (result.currentUrlInfo) {
        setCurrentUrl(result.currentUrlInfo);
      }
    });

    // 최근 방문 URL 로드
    chrome.storage.local.get(['recentUrls'], (result) => {
      if (result.recentUrls) {
        setRecentUrls(result.recentUrls);
      }
    });

    // 메모 로드
    chrome.storage.local.get(['notes'], (result) => {
      if (result.notes) {
        setNotes(result.notes);
      }
    });

    // 테마 로드
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
    });

    // 메시지 리스너
    const messageListener = (message: any) => {
      if (message.type === 'UPDATE_URL_INFO') {
        setCurrentUrl(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: Date.now()
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setNewNote('');

    chrome.storage.local.set({ notes: updatedNotes });
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    chrome.storage.sync.set({ theme: newTheme });
  };

  return (
    <div className={`sidepanel-container ${theme}`}>
      {/* 테마 토글 버튼 */}
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* 현재 페이지 정보 */}
      <div className="current-page">
        {currentUrl && (
          <>
            <img src={currentUrl.favicon} alt="" className="favicon" />
            <h2>{currentUrl.title}</h2>
            <p className="url">{currentUrl.url}</p>
          </>
        )}
      </div>

      {/* 빠른 메모 */}
      <div className="notes-section">
        <h3>빠른 메모</h3>
        <div className="note-input">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="메모를 입력하세요"
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <button onClick={handleAddNote}>추가</button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-item">
              <p>{note.content}</p>
              <button onClick={() => handleDeleteNote(note.id)}>삭제</button>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 방문 사이트 */}
      <div className="recent-sites">
        <h3>최근 방문</h3>
        <div className="sites-list">
          {recentUrls.slice(0, 5).map((url, index) => (
            <a key={index} href={url.url} className="site-item">
              <img src={url.favicon} alt="" />
              <span>{url.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// 컴포넌트 렌더링
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
} 