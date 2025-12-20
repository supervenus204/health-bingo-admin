import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';
import { API_BASE_URL } from '@/config';

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

    if (response.status === 401) {
      // Redirect to login when unauthorized
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(errorData.message || 'Request failed');
    }

    const data = await response.json();
    return data.data;
  }

  async getUsers(params?: {
    sort?: string;
    desc?: boolean;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
  }): Promise<{
    users: User[];
    pagination: {
      total: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params?.desc !== undefined) {
      queryParams.append('desc', params.desc.toString());
    }
    if (params?.pageNumber !== undefined) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize !== undefined) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/user${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      users: User[];
      pagination: {
        total: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
      };
    }>(endpoint);
    
    return response;
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/user/${id}`);
  }

  async createAdmin(userData: Partial<User>): Promise<User> {
    return this.request<User>('/api/user/admin', {
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
