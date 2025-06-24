export interface LoginRequest {
    id: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
    id: string;
}

export interface AdminSignUpRequest {
    name: string;
    id: string;
    password: string;
    contact: string;
    email: string;
}