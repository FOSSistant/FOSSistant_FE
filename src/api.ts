export interface Issue {
    html_url: string;
    title: string;
    body: string;
}

export interface IssueLabel {
  id: number;
  difficulty: string;
}

export interface IssueGuide {
  title: string;
  difficulty: string;
  description: string;
  solution: string;
  caution: string;
}

// github로부터 이슈들 body 정보 가져오기
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

// 이슈들의 레이블 가져오기
export const getIssueLabels = async (issues: Issue[]): Promise<IssueLabel[]> => {
  try {
    const response = await fetch(`http://4.217.129.207:8080/issues`, {
      method: "POST",
      body: JSON.stringify(issues),
    });
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 단일 이슈의의 가이드 가져오기
export const getIssueGuide = async (issue: Issue): Promise<IssueGuide | null> => {
  try {
    const response = await fetch(`http://4.217.129.207:8080/issue/guide`, {
      method: "POST",
      body: JSON.stringify(issue),
  });
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};







