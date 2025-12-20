import { challengeService } from '@/services/challengeService';
import {
  Challenge,
  ChallengeStatus,
  UpdateChallengeStatusRequest,
} from '@/types';
import { useState, useEffect } from 'react';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await challengeService.getChallenges({
        page: currentPage,
        limit: pageSize,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchTerm || undefined,
      });
      setChallenges(response.data);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch challenges';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startNextWeek = async (challengeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await challengeService.startNextWeek(challengeId);
      await fetchChallenges();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start next week';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await challengeService.deleteChallenge(challengeId);
      await fetchChallenges();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete challenge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeStatus = async (
    challengeId: string,
    status: ChallengeStatus
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      await challengeService.updateChallengeStatus(challengeId, status);
      await fetchChallenges();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update challenge status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
      }
      fetchChallenges();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    challenges,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    fetchChallenges,
    startNextWeek,
    deleteChallenge,
    updateChallengeStatus,
  };
};

