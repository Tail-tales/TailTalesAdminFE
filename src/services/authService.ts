import { LoginRequest, LoginResponse, AdminSignUpRequest } from "@/types/auth";
import { LOGIN_URL, ID_CHECK_URL, EMAIL_CHECK_URL, ADMIN_URL, FIND_PW_URL, LOGOUT_URL, REFRESH_URL } from "@/constants/api";
import axios from "axios";

export const login = async (credentials: LoginRequest) : Promise<LoginResponse> => {
    try {
        const response = await axios.post(LOGIN_URL, credentials , {
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        console.error('로그인 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const signup = async(credentials: AdminSignUpRequest) => {
    try{
        const response = await axios.post(ADMIN_URL, credentials)
        return response.data
    }catch (error){
        console.error('회원가입 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const idCheck = async(id: string) => {
    try{
        const response = await axios.get(`${ID_CHECK_URL}/${id}`)
        return response.data
    }catch (error){
        console.error('아이디 중복확인 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const emailCheck = async(email: string) => {
    try{
        const response = await axios.get(`${EMAIL_CHECK_URL}/${email}`)
        return response.data
    }catch (error){
        console.error('이메일 중복확인 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const findPassword = async(id: string) => {
    try{
        const response = await axios.post(`${FIND_PW_URL}?id=${id}`);
        return response.data
    }catch(error){
        console.error('비밀번호 찾기 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const logout = async() => {
    try{
        await axios.post(LOGOUT_URL);
    }catch(error){
        console.error('로그아웃 API 통신 중 에러 발생:', error);
        throw error;
    }
}

export const refreshAccessToken = async() => {
    try {
          const response = await axios.post(REFRESH_URL, null,{
            withCredentials: true,
            headers: {
              Authorization: null
            }
        });
        return response.data
    }catch(error){
        console.error('토큰 리프레쉬 API 통신 중 에러 발생:', error);
        throw error;
    }
}