import { revenueService } from '@/services/revenueService';
import {
  RevenuePeriod,
  TotalRevenue,
  DailyRevenue,
  WeeklyRevenue,
  MonthlyRevenue,
  DateRangeRevenue,
} from '@/types';
import { useState, useEffect } from 'react';

export const useRevenue = () => {
  const [period, setPeriod] = useState<RevenuePeriod>('daily');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [dateRangeRevenue, setDateRangeRevenue] = useState<DateRangeRevenue | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalRevenue = async () => {
    try {
      const result = await revenueService.getTotalRevenue();
      setTotalRevenue(result.totalRevenue);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch total revenue';
      setError(errorMessage);
    }
  };

  const fetchDailyRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await revenueService.getDailyRevenue();
      setDailyRevenue(result.dailyRevenue);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch daily revenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await revenueService.getWeeklyRevenue();
      setWeeklyRevenue(result.weeklyRevenue);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weekly revenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await revenueService.getMonthlyRevenue();
      setMonthlyRevenue(result.monthlyRevenue);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch monthly revenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenueByDateRange = async (start: string, end: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await revenueService.getRevenueByDateRange(start, end);
      setDateRangeRevenue(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch revenue by date range';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    if (period === 'daily') {
      fetchDailyRevenue();
    } else if (period === 'weekly') {
      fetchWeeklyRevenue();
    } else if (period === 'monthly') {
      fetchMonthlyRevenue();
    }
  }, [period]);

  return {
    period,
    setPeriod,
    totalRevenue,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    dateRangeRevenue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoading,
    error,
    fetchRevenueByDateRange,
  };
};

