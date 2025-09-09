export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  country: string | null;
  timezone: string | null;
  push_reminders: boolean;
  auth_provider: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface PromoCode {
  id: string;
  code: string;
  expiration_date: string;
  usage_limit: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoCodeRequest {
  expiration_duration: number;
  usage_limit: number;
}

export interface UpdatePromoCodeRequest {
  expiration_duration?: number;
  usage_limit?: number;
}

export type Theme = 'dark' | 'light' | 'system';
