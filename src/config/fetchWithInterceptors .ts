export const BASE_URL = process.env.REACT_APP_DEV_SERVER as string;

export const getAccessToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get('accessToken', (result) => {
      resolve(result.accessToken || null);
    });
  });
};

export const getRefreshToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get('refreshToken', (result) => {
      resolve(result.refreshToken || null);
    });
  });
};

export const removeTokens = async () => {
  chrome.storage.local.remove('accessToken');
  chrome.storage.local.remove('refreshToken');
};   



export const getNewAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    const response = await fetch(`${BASE_URL}/auth/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    const { result } = await response.json();
    return result;    
  } catch (error) {
    console.log(error);
    throw error;
  }

};


export const fetchWithInterceptors = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  console.log('fetchWithInterceptors 진입');
  // ======= 🔹 요청 인터셉터 영역 =======
  const token = await getAccessToken(); // 예: chrome.storage에서 토큰 불러오기
  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
  // ====================================

  try {
    console.log('fetch 진입');
    const response = await fetch(input, modifiedInit);
    console.log('fetch 완료');
    console.log(response);
    // ======= 🔹 응답 인터셉터 영역 =======
    if (response.status === 403 || response.status === 401) {
      console.log('403 또는 401 응답 감지');
      const tokenResponse = await getNewAccessToken();
      console.log('getNewAccessToken 호출출');
      
      const newAccessToken = tokenResponse.accessToken;
      const newRefreshToken = tokenResponse.refreshToken;
      await chrome.storage.local.set({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      // 새로운 토큰으로 다시 요청청
      const newInit: RequestInit = {
        ...modifiedInit,
        headers: {
          ...modifiedInit.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      await fetch(input, newInit);
    }

    return response;
  } catch (err) {
    await removeTokens();
    console.error('[Fetch 요청 실패]', err);
    throw err;
  }
};
