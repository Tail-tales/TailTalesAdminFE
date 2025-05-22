import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { LOGOUT_URL, REFRESH_URL } from '@/constants/api';

export const useAuthStore = defineStore('auth', () => {
  // State
    const accessToken = ref<string | null>(null);
    const adminId = ref<string | null>(null);

  // Getters
    const isloggedIn = computed(() => !!accessToken.value);
    const currentAdminId = computed(() => adminId.value);

  // Actions
    function setAccessToken(token: string | null) {
        accessToken.value = token;
        updateAuthHeader(token);
    }

    function setAdminId(id: string | null) {
        adminId.value = id;
      }

    function clearAccessToken() {
        accessToken.value = null;
        adminId.value = null;
        updateAuthHeader(null);
        sessionStorage.removeItem('accessToken');
    }

    function updateAuthHeader(token: string | null) {
        if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
        delete axios.defaults.headers.common['Authorization'];
        }
    }

    function loginSuccess(token: string, id: string) {
        setAccessToken(token);
        setAdminId(id);
        sessionStorage.setItem('accessToken', token);
        sessionStorage.setItem('id', id);
    }
    
    async function logout() {
        try {
            await axios.post(LOGOUT_URL);
            clearAccessToken();
            sessionStorage.removeItem('id');
            console.log('로그아웃 완료 및 Access Token, id 제거');
        } catch (error) {
            sessionStorage.removeItem('id');
            console.error('로그아웃 실패:', error);
            clearAccessToken();
        }
    }

    // Access Token 갱신 액션
    async function refreshToken() {
        try {
          const response = await axios.post(REFRESH_URL, null,{
            withCredentials: true,
            headers: {
              Authorization: null
            }
          });
          const newAccessToken = response.data.accessToken;
          setAccessToken(newAccessToken);
          console.log('Access Token 갱신 성공');
          return true; // 갱신 성공
        } catch (error) {
          console.error('Access Token 갱신 실패:', error);
          clearAccessToken();
          sessionStorage.removeItem('id');
          return false; // 갱신 실패
        }
    }

    return { accessToken, isloggedIn, currentAdminId, setAccessToken, setAdminId, clearAccessToken, loginSuccess, logout, refreshToken };
});