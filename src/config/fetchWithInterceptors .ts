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
    if (response.status === 403) {
      await removeTokens();
    }

    return response;
  } catch (err) {
    console.error('[Fetch 요청 실패]', err);
    throw err;
  }
};
