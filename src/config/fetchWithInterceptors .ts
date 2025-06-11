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
    throw error;
  }

};


export const fetchWithInterceptors = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  
  // ======= 🔹 요청 인터셉터 영역 =======
  const token = await getAccessToken();
  
  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
  };
  
  // 토큰이 없으면 인증 요청 제안
  if (!token) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  // ====================================

  try {
    const response = await fetch(input, modifiedInit);
    
    // ======= 🔹 응답 인터셉터 영역 =======
    if (response.status === 403 || response.status === 401) {
      
      try {
        const tokenResponse = await getNewAccessToken();
        
        if (tokenResponse && tokenResponse.accessToken) {
          const newAccessToken = tokenResponse.accessToken;
          const newRefreshToken = tokenResponse.refreshToken;
          await chrome.storage.local.set({ 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken 
          });
          
          // 새로운 토큰으로 다시 요청
          const newInit: RequestInit = {
            ...modifiedInit,
            headers: {
              ...modifiedInit.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          return await fetch(input, newInit);
        } else {
          throw new Error('토큰 갱신 응답이 유효하지 않음');
        }
      } catch (refreshError) {
        await removeTokens();
        throw new Error('AUTHENTICATION_REFRESH_FAILED');
      }
    }

    return response;
  } catch (err) {
    
    // 특정 인증 오류의 경우에만 토큰 제거
    if (err instanceof Error && 
        (err.message.includes('AUTHENTICATION') || 
         err.message.includes('401') || 
         err.message.includes('403'))) {
      await removeTokens();
    }
    
    throw err;
  }
};
