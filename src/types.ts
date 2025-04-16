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

export interface IssueInfo {
  title: string;
  number: number;
  state: 'open' | 'closed';
  body: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: {
    name: string;
    color: string;
  }[];
  comments: number;
  reactions: {
    total_count: number;
  };
} 