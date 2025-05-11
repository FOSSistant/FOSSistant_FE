interface Issue {
    issueId: string;
    title: string;
    body: string;
}

interface IssueLabel {
  id: number;
  difficulty: string;
}

interface IssueGuide {
  title: string;
  difficulty: string;
  description: string;
  solution: string;
  caution: string;
}

// github로부터 이슈들 body 정보 가져오기
export const getIssuesFromGithub = async (owner: string, repo: string, page: number): Promise<Issue[] | null> => {
  try {
    const response = await fetch(`https://api.github.com/${owner}/${repo}/issues?page=${page}`);
    const data = await response.json();
    return data;
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







