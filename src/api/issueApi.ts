import { fetchWithInterceptors } from "../config/fetchWithInterceptors ";

export interface Issue {
  issueId: string;
}

export interface IssueLabel {
  issueId: string;
  difficulty: string;
}

export interface IssueGuide {
  title: string;
  difficulty: string;
  description: string;
  solution: string;
  relatedLinks: string;
  highlightedBody: string;
  caution?: string;
}

export interface RepoInfo {
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string;
  stars: number;
}






// API 서버 주소 변수 선언
const dev_server = process.env.REACT_APP_DEV_SERVER as string;// github로부터 이슈들 body 정보 가져오기

export const getIssuesFromGithub = async (owner: string, repo: string, page: number): Promise<Issue[] | null> => {
  try {
    return await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&sort=created&page=${page}`)
    .then((res) => res.json())
    .then((data) => {
     const pureIssues = data.filter((issue: any) => !issue.pull_request)
     const top30Issues = pureIssues.slice(0, 30);
     return top30Issues;
   });;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getIssueFromGithub = async (owner: string, repo: string, issueNumber: number): Promise<Issue | null> => {
  try {
    return await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const getIssueLabels = async (issues: Issue[]): Promise<IssueLabel[]> => {
  try {
    console.log(issues);
    const response = await fetch(`${dev_server}/issues`, {
      method: "POST",
      body: JSON.stringify({ issues }),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const { result } = await response.json();
    return result.results;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 단일 이슈의의 가이드 가져오기
export const getIssueGuide = async (issue: Issue): Promise<IssueGuide | null> => {
  try {
    console.log(issue);
    const response = await fetchWithInterceptors(`${dev_server}/issues/guide`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },    
      body: JSON.stringify({ issueId: issue.issueId }),
  });
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const submitDifficultyOpinion = async (issueId: string, feedbackTag: string): Promise<boolean> => {
  try {
    await fetchWithInterceptors(`${dev_server}/issues/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ issueId, feedbackTag }),
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getDifficultyOpinion = async (issueId: string): Promise<string | null> => {
  try {
    const response = await fetchWithInterceptors(`${dev_server}/issues/feedback?issueId=${encodeURIComponent(issueId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const { result } = await response.json();
    return result.feedbackTag;
  } catch (error) {
    return null;
  }
};

export const getTrendyRepos = async (): Promise<RepoInfo[]> => {
  try {
    const response = await fetchWithInterceptors(`${dev_server}/repo/personal`, {
      method: "GET",
    });
    const { result } = await response.json();
    return result.results;
  } catch (error) {
    return [];
  }
};


export const getReposByLanguage = async (language: String): Promise<RepoInfo[]> => {
  try {
    const response = await fetchWithInterceptors(`${dev_server}/repo/category/${language}`, {
      method: "GET",
    });
    const { result } = await response.json();
    return result.results;
  } catch (error) {
    return [];
  }
};
