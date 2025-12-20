import { useAuthStore } from '@/stores/authStore';
import {
  Challenge,
  ChallengeStatus,
  GetChallengesResponse,
  UpdateChallengeStatusRequest,
  StartNextWeekResponse,
} from '@/types';
import { API_BASE_URL } from '@/config';

class ChallengeService {
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
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(errorData.error?.message || errorData.message || 'Request failed');
    }

    const data = await response.json();
    return data.data || data;
  }

  async getChallenges(params?: {
    page?: number;
    limit?: number;
    status?: ChallengeStatus;
    search?: string;
  }): Promise<GetChallengesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${API_BASE_URL}/api/challenge/admin${query}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(errorData.error?.message || errorData.message || 'Request failed');
    }

    const jsonResponse = await response.json();

    return {
      data: jsonResponse.data || [],
      pagination: jsonResponse.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }

  async startNextWeek(challengeId: string): Promise<StartNextWeekResponse> {
    return this.request<StartNextWeekResponse>(
      `/api/challenge/admin/${challengeId}/start-next-week`,
      {
        method: 'POST',
      }
    );
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    return this.request<void>(`/api/challenge/admin/${challengeId}`, {
      method: 'DELETE',
    });
  }

  async updateChallengeStatus(
    challengeId: string,
    status: ChallengeStatus
  ): Promise<Challenge> {
    return this.request<Challenge>(`/api/challenge/admin/${challengeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const challengeService = new ChallengeService();

