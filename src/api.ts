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
  caution: string;
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
    const response = await fetch(`${dev_server}/issue/guide`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },    
      body: JSON.stringify(issue),
  });
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};







