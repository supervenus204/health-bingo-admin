import { useAuthStore } from '@/stores/authStore';
import {
  BingoCard,
  CreateBingoCardRequest,
  UpdateBingoCardRequest,
  ChallengeCategory,
} from '@/types';
import { API_BASE_URL } from '@/config';

class BingoCardService {
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
      throw new Error(errorData.message || 'Request failed');
    }

    const data = await response.json();
    return data.data;
  }

  async getBingoCards(
    categoryId?: string,
    pageNumber?: number,
    pageSize?: number,
    searchTerm?: string
  ): Promise<{
    bingoCards: BingoCard[];
    pagination: {
      total: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append('category_id', categoryId);
    }
    if (pageNumber) {
      params.append('pageNumber', pageNumber.toString());
    }
    if (pageSize) {
      params.append('pageSize', pageSize.toString());
    }
    if (searchTerm) {
      params.append('searchTerm', searchTerm);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await this.request<{
      bingoCards: BingoCard[];
      pagination: {
        total: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
      };
    }>(`/api/bingo-card${query}`);
    return {
      bingoCards: response.bingoCards || [],
      pagination: response.pagination || {
        total: 0,
        pageNumber: 1,
        pageSize: 50,
        totalPages: 0,
      },
    };
  }

  async getBingoCardById(id: string): Promise<BingoCard> {
    return this.request<BingoCard>(`/api/bingo-card/${id}`);
  }

  async createBingoCard(
    bingoCardData: CreateBingoCardRequest
  ): Promise<BingoCard> {
    return this.request<BingoCard>('/api/bingo-card', {
      method: 'POST',
      body: JSON.stringify(bingoCardData),
    });
  }

  async updateBingoCard(
    id: string,
    bingoCardData: UpdateBingoCardRequest
  ): Promise<BingoCard> {
    return this.request<BingoCard>(`/api/bingo-card/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bingoCardData),
    });
  }

  async deleteBingoCard(id: string): Promise<void> {
    return this.request<void>(`/api/bingo-card/${id}`, {
      method: 'DELETE',
    });
  }

  async getChallengeCategories(): Promise<ChallengeCategory[]> {
    return this.request<ChallengeCategory[]>('/api/challenge-category');
  }
}

export const bingoCardService = new BingoCardService();

