import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import type { Router } from 'vue-router';

const setupAxiosInterceptors = (router: Router) => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && originalRequest?._verifyToken && !originalRequest._retry) { // 무한루프 방지를 위한 재시도 여부 추적 플래그
                originalRequest._retry = true;
                const authStore = useAuthStore();
                const refreshSuccess = await authStore.refreshToken();
                if (refreshSuccess && authStore.accessToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.accessToken}`; // originalRequest에는 기존 accessToken이 들어있어서 바꿔줌
                    return axios(originalRequest); // 원래 요청 재시도
                } else {
                    console.error('로그아웃합니다.');
                    setTimeout(()=>router.push('/'), 3000);
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;