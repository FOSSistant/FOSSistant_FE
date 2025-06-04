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
  console.log('🔗 fetchWithInterceptors 진입');
  
  // ======= 🔹 요청 인터셉터 영역 =======
  const token = await getAccessToken();
  console.log('🔑 토큰 상태:', { hasToken: !!token, tokenLength: token?.length || 0 });
  
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
    console.log('⚠️ 인증 토큰이 없습니다. GitHub 로그인이 필요합니다.');
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  // ====================================

  try {
    console.log('📡 fetch 요청 시작');
    const response = await fetch(input, modifiedInit);
    console.log('✅ fetch 응답 수신:', { status: response.status, statusText: response.statusText });
    
    // ======= 🔹 응답 인터셉터 영역 =======
    if (response.status === 403 || response.status === 401) {
      console.log('🔄 토큰 갱신 필요 (상태 코드:', response.status, ')');
      
      try {
        const tokenResponse = await getNewAccessToken();
        console.log('🔄 토큰 갱신 성공');
        
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

          console.log('🔄 새 토큰으로 재요청');
          return await fetch(input, newInit);
        } else {
          throw new Error('토큰 갱신 응답이 유효하지 않음');
        }
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
        await removeTokens();
        throw new Error('AUTHENTICATION_REFRESH_FAILED');
      }
    }

    return response;
  } catch (err) {
    console.error('❌ [Fetch 요청 실패]', err);
    
    // 특정 인증 오류의 경우에만 토큰 제거
    if (err instanceof Error && 
        (err.message.includes('AUTHENTICATION') || 
         err.message.includes('401') || 
         err.message.includes('403'))) {
      console.log('🧹 인증 오류로 인한 토큰 정리');
      await removeTokens();
    }
    
    throw err;
  }
};
