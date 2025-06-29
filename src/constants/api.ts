export const API_BASE_URL = "http://localhost:8084";

export const AUTH_URL = `${API_BASE_URL}/auth/admin`
export const VERIFY_URL = `${AUTH_URL}/verify`;
export const ID_CHECK_URL = `${AUTH_URL}/exists/id`;
export const EMAIL_CHECK_URL = `${AUTH_URL}/exists/email`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const REFRESH_URL = `${AUTH_URL}/refresh`;
export const FIND_PW_URL = `${AUTH_URL}/findPassword`;

export const ADMIN_URL = `${API_BASE_URL}/api/admin`;
export const ADMIN_UPDATE_URL = `${ADMIN_URL}/me`;

export const BOARD_URL = `${ADMIN_URL}/boards`;
export const BOARD_LIST_URL = `${BOARD_URL}/all`;
export const BOARD_CTG_URL = `${BOARD_URL}/category`;
export const BOARD_EDIT_URL = `${BOARD_URL}/edit`;

export const CATEGORY_URL = `${ADMIN_URL}/categories`;
export const CATEGORY_LIST_URL = `${CATEGORY_URL}/all`;
export const CATEGORY_EDIT_URL = `${CATEGORY_URL}/edit`;
export const CATEGORY_UPDATE_URL = `${CATEGORY_URL}/changes`;

export const USER_URL = `${ADMIN_URL}/users`;

export const IMAGE_URL = `${API_BASE_URL}/api/upload`