import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

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
        // Refresh Token은 백엔드에서 HTTP-only Cookie로 설정해야 할 것 같음음
    }
    
    async function logout() {
        try {
            // await axios.post('/api/logout'); //백엔드에서 Refresh Token 만료시키기
            clearAccessToken();
            console.log('로그아웃 완료 및 Access Token 제거');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            clearAccessToken();
        }
    }

    // Access Token 갱신 액션
    // async function refreshToken() {
    //     try {
    //     const response = await axios.post('/api/refresh'); // Access Token 갱신 API
    //     const newAccessToken = response.data.accessToken;
    //     setAccessToken(newAccessToken);
    //     console.log('Access Token 갱신 성공');
    //     return true; // 갱신 성공
    //     } catch (error) {
    //     console.error('Access Token 갱신 실패:', error);
    //     clearAccessToken(); // 갱신 실패 시 Access Token 제거
    //     return false; // 갱신 실패
    //     }
    // }

    return { accessToken, isloggedIn, currentAdminId, setAccessToken, clearAccessToken, loginSuccess, logout };
});