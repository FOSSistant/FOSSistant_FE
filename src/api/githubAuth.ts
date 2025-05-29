import { BASE_URL, fetchWithInterceptors } from "../config/fetchWithInterceptors ";
import { TokenRequest, TokenResponse, UserProfile } from "../types";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`;
const GITHUB_CLIENT_SECRET = "f70b4ed63c748aeedfeb88b3b42570ab8295dc43"
const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email,read:user,repo&prompt=login`;
const dev_server = process.env.REACT_APP_DEV_SERVER as string;// github로부터 이슈들 body 정보 가져오기

export const requestGitHubCode = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: AUTH_URL,
        interactive: true,
      },
      async (redirectUrl) => {
        try {
          if (chrome.runtime.lastError || !redirectUrl) {
            console.error("OAuth 실패:", chrome.runtime.lastError);
            resolve(false);
            return;
          }
          const url = new URL(redirectUrl);
          const code = url.searchParams.get("code");
          if (!code) {
            resolve(false);
            return;
          }
          const result: TokenResponse = await postGithubCode({ githubCode: code });
          await chrome.storage.local.set({ accessToken: result.accessToken, refreshToken: result.refreshToken });
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      }
    );
  });
};

export const postGithubCode = async (tokenRequest: TokenRequest): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/github`, {
      method: "POST",
      body: JSON.stringify({ githubCode: tokenRequest.githubCode }),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const { result } = await response.json();
    return result;  } catch (error) {
    return { accessToken: "", refreshToken: "" };
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await fetchWithInterceptors(`${BASE_URL}/member/profile`, {
    method: "GET",
  });
  const { result } = await response.json();
  return result;
}


export const patchMyLevel = async (level: "BEGINNER" | "EXPERIENCED"): Promise<boolean> => {
  try {
    await fetchWithInterceptors(`${BASE_URL}/member/level`, {
      method: "PATCH",
      body: JSON.stringify({ level: level }),
      headers: {
      "Content-Type": "application/json"
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

