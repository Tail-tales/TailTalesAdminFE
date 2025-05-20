export const API_BASE_URL = "http://localhost:8084";

export const AUTH_URL = `${API_BASE_URL}/auth`
export const VERIFY_URL = `${AUTH_URL}/verify`;
export const ID_CHECK_URL = `${AUTH_URL}/exists/id`;
export const EMAIL_CHECK_URL = `${AUTH_URL}/exists/email`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const ADMIN_REFRESH_URL = `${AUTH_URL}/admin/refresh`;
export const FIND_PW_URL = `${AUTH_URL}/findPassword`;

export const ADMIN_URL = `${API_BASE_URL}/admin`;
export const ADMIN_UPDATE_URL = `${API_BASE_URL}/admin/me`;

export const BOARD_URL = `${API_BASE_URL}/admin/boards`;
export const BOARD_LIST_URL = `${BOARD_URL}/all`;
export const BOARD_CTG_URL = `${BOARD_URL}/category`;
export const BOARD_EDIT_URL = `${BOARD_URL}/edit`;

export const CATEGORY_URL = `${API_BASE_URL}/admin/categories`;
export const CATEGORY_LIST_URL = `${CATEGORY_URL}/all`;
export const CATEGORY_EDIT_URL = `${CATEGORY_URL}/edit`;
export const CATEGORY_UPDATE_URL = `${CATEGORY_URL}/changes`;