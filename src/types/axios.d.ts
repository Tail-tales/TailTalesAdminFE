import type { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _verifyToken?: boolean;
  }
}