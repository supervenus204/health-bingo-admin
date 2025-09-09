import { useAuthStore } from '@/stores/authStore';
import {
  CreatePromoCodeRequest,
  PromoCode,
  UpdatePromoCodeRequest,
} from '@/types';

const API_BASE_URL =
  'https://healthbingo-backend-dev-69f9daf23457.herokuapp.com';

class PromoCodeService {
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

  async getPromoCodes(): Promise<PromoCode[]> {
    return this.request<PromoCode[]>('/api/promo');
  }

  async getPromoCodeById(id: string): Promise<PromoCode> {
    return this.request<PromoCode>(`/api/promo/${id}`);
  }

  async createPromoCode(
    promoCodeData: CreatePromoCodeRequest
  ): Promise<PromoCode> {
    return this.request<PromoCode>('/api/promo', {
      method: 'POST',
      body: JSON.stringify(promoCodeData),
    });
  }

  async updatePromoCode(
    id: string,
    promoCodeData: UpdatePromoCodeRequest
  ): Promise<PromoCode> {
    return this.request<PromoCode>(`/api/promo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoCodeData),
    });
  }

  async deletePromoCode(id: string): Promise<void> {
    return this.request<void>(`/api/promo/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePromoCodeStatus(id: string): Promise<PromoCode> {
    return this.request<PromoCode>(`/api/promo/${id}/toggle`, {
      method: 'PATCH',
    });
  }
}

export const promoCodeService = new PromoCodeService();
