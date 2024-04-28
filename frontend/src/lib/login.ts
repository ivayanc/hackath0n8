import { clearAuthTokens, setAuthTokens } from 'axios-jwt';

import { axiosInstance } from '@/http/api';

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

export const login = async (params: { email: string; password: string }) => {
  const response = await axiosInstance.post(`${LOGIN_URL}`, params);
  await setAuthTokens({
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token
  });
};
export const logout = () => clearAuthTokens();
