import { BASE_URL, fetchWithInterceptors } from "../config/fetchWithInterceptors ";
import { TokenRequest, TokenResponse, UserProfile } from "../types";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const REDIRECT_URI = `https://emoioalldchmkpkhddjddjjkpamdpigj.chromiumapp.org/`;
const dev_server = process.env.REACT_APP_DEV_SERVER as string;// github로부터 이슈들 body 정보 가져오기

export const requestGitHubCode = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 캐시된 인증 토큰들을 모두 지워서 강제 재로그인 유도
    chrome.identity.clearAllCachedAuthTokens(() => {
      // 매번 새로운 state 값과 timestamp를 생성해서 캐시 방지
      const state = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email,read:user,repo&prompt=select_account&state=${state}&t=${timestamp}`;
      
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

