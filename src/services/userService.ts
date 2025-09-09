import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';

const API_BASE_URL =
  'https://healthbingo-backend-dev-69f9daf23457.herokuapp.com';

class UserService {
  private getAuthHeader(): Record<string, string> {
    const token = useAuthStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
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

    const data = await response.json();
    return data.data;
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/user');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/user/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('/api/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/api/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/user/${id}`, {
      method: 'DELETE',
    });
  }

  async resetPassword(id: string): Promise<void> {
    return this.request<void>(`/api/user/${id}/reset-password`, {
      method: 'POST',
    });
  }
}

export const userService = new UserService();
