const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`;
const GITHUB_CLIENT_SECRET = "f70b4ed63c748aeedfeb88b3b42570ab8295dc43"
const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email,read:user,repo`;

export async function requestGitHubCode() {
  chrome.identity.launchWebAuthFlow(
    {
      url: AUTH_URL,
      interactive: true,
    },
    async (redirectUrl) => {
      try {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("OAuth 실패:", chrome.runtime.lastError);
          return;
      }

      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");

      if (!code) {
        console.warn("code 없음");
        return;
      }

        console.log("GitHub code 받음:", code);

        return code;
      } catch (error) {
        console.error("GitHub 인증 오류 발생생:", error);
        return null;
      }
    }
  );
}

