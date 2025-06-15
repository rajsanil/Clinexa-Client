export const API_URL = import.meta.env.VITE_APP_API_URL;

export const API_SETTINGS = {
  USER_REGISTER: `${API_URL}/register`,
  USER_LOGIN: `${API_URL}/authenticate`,
  USER_LOGOUT: `${API_URL}/logout`,
  FORGOT_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,
  REFRESH_TOKEN: `${API_URL}/refresh`,
};
