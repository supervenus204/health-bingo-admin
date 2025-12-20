import { AuthResponse, LoginRequest } from '@/types';
import { API_BASE_URL } from '@/config';

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        ...credentials,
        role: 'admin',
      }),
    });
  }

  async logout(): Promise<void> {
    // Implement logout API call if needed
    return Promise.resolve();
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.request('/api/auth/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
