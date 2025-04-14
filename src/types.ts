export interface UrlInfo {
  url: string;
  title: string;
  favicon: string;
}

export interface TrendingRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
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