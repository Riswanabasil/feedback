export const USER_TOKEN_KEY = "accessToken";
export const ADMIN_TOKEN_KEY = "adminToken";

export const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY);
export const setUserToken = (t: string) => localStorage.setItem(USER_TOKEN_KEY, t);
export const clearUserToken = () => localStorage.removeItem(USER_TOKEN_KEY);

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (t: string) => localStorage.setItem(ADMIN_TOKEN_KEY, t);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);
