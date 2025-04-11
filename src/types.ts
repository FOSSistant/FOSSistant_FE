export interface UrlInfo {
  url: string;
  title: string;
  favicon: string;
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export interface UserSettings {
  backgroundImage: string;
  showClock: boolean;
  gridColumns: number;
  themeColor: string;
} 