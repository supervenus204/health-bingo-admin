import { useAuthStore } from '@/stores/authStore';
import {
  TotalRevenue,
  DailyRevenue,
  WeeklyRevenue,
  MonthlyRevenue,
  DateRangeRevenue,
} from '@/types';
import { API_BASE_URL } from '@/config';

class RevenueService {
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

  async getTotalRevenue(): Promise<TotalRevenue> {
    return this.request<TotalRevenue>('/api/payment/revenue/total');
  }

  async getDailyRevenue(): Promise<{ dailyRevenue: DailyRevenue[] }> {
    return this.request<{ dailyRevenue: DailyRevenue[] }>(
      '/api/payment/revenue/daily'
    );
  }

  async getWeeklyRevenue(): Promise<{ weeklyRevenue: WeeklyRevenue[] }> {
    return this.request<{ weeklyRevenue: WeeklyRevenue[] }>(
      '/api/payment/revenue/weekly'
    );
  }

  async getMonthlyRevenue(): Promise<{ monthlyRevenue: MonthlyRevenue[] }> {
    return this.request<{ monthlyRevenue: MonthlyRevenue[] }>(
      '/api/payment/revenue/monthly'
    );
  }

  async getRevenueByDateRange(
    startDate: string,
    endDate: string
  ): Promise<DateRangeRevenue> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return this.request<DateRangeRevenue>(
      `/api/payment/revenue/range?${params.toString()}`
    );
  }
}

export const revenueService = new RevenueService();

