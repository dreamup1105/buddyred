import { useState, useCallback } from 'react';
import { fetchUploadToken, fetchUploadTokenWithExpire } from '@/services/qiniu';

export function useUploadHook(): {
  token: string;
  loadToken: () => Promise<any>;
};

export default function useUploadHook() {
  const cacheToken = localStorage.getItem('uploadToken') || '';
  const [token, setToken] = useState<string>(cacheToken);

  const loadToken = useCallback(async () => {
    const { data } = await fetchUploadToken();
    setToken(data);
  }, []);

  const loadTokenWithExpire = useCallback(async () => {
    const tokenExpire = localStorage.getItem('tokenExpire');
    if (tokenExpire) {
      console.log(tokenExpire);
    }
    const { data } = await fetchUploadTokenWithExpire();
    setToken(data.token);
    localStorage.setItem('requestTokenTimestamp', data.expire);
    localStorage.setItem('uploadToken', data.token);
  }, []);

  return {
    token,
    loadToken,
    loadTokenWithExpire,
  };
}
