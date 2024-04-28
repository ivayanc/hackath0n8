import axios from 'axios';
import type { IAuthTokens, TokenRefreshRequest } from 'axios-jwt';
import { applyAuthTokenInterceptor } from 'axios-jwt';

const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;
const REFRESH_URL = process.env.NEXT_PUBLIC_REFRESH_URL;
export const axiosInstance = axios.create({ baseURL: BASE_URL });

const requestRefresh: TokenRefreshRequest = async (
  refreshToken: string
): Promise<IAuthTokens | string> => {
  const response = await axios.post(`${BASE_URL}${REFRESH_URL}`, {
    token: refreshToken
  });

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token
  };
};

applyAuthTokenInterceptor(axiosInstance, {
  requestRefresh
});
