import { bingoCardService } from '@/services/bingoCardService';
import { useBingoCardStore } from '@/stores/bingoCardStore';
import {
  BingoCard,
  CreateBingoCardRequest,
  UpdateBingoCardRequest,
  ChallengeCategory,
} from '@/types';
import { useState, useEffect } from 'react';

export const useBingoCards = () => {
  const [categories, setCategories] = useState<ChallengeCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    bingoCards,
    currentPage,
    searchTerm,
    selectedCategory,
    bingoCardsPerPage,
    total,
    totalPages,
    isLoading,
    error,
    setBingoCards,
    setPagination,
    addBingoCard,
    updateBingoCard,
    removeBingoCard,
    setCurrentPage,
    setSearchTerm,
    setSelectedCategory,
    setLoading,
    setError,
    getFilteredBingoCards,
  } = useBingoCardStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await bingoCardService.getChallengeCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchBingoCards = async (categoryId?: string, page?: number, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const pageToFetch = page || currentPage;
      const result = await bingoCardService.getBingoCards(
        categoryId && categoryId !== 'all' ? categoryId : undefined,
        pageToFetch,
        bingoCardsPerPage,
        search
      );
      setBingoCards(result.bingoCards);
      setPagination(result.pagination);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch bingo cards';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createBingoCard = async (bingoCardData: CreateBingoCardRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newBingoCard = await bingoCardService.createBingoCard(
        bingoCardData
      );
      addBingoCard(newBingoCard);
      return newBingoCard;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create bingo card';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editBingoCard = async (
    id: string,
    bingoCardData: UpdateBingoCardRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBingoCard = await bingoCardService.updateBingoCard(
        id,
        bingoCardData
      );
      updateBingoCard(id, updatedBingoCard);
      return updatedBingoCard;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update bingo card';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBingoCard = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await bingoCardService.deleteBingoCard(id);
      removeBingoCard(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete bingo card';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const filteredBingoCards = getFilteredBingoCards();
  const currentBingoCards = bingoCards;

  return {
    bingoCards,
    filteredBingoCards,
    currentBingoCards,
    currentPage,
    searchTerm,
    selectedCategory,
    bingoCardsPerPage,
    total,
    totalPages,
    isLoading,
    error,
    categories,
    isLoadingCategories,
    fetchBingoCards,
    createBingoCard,
    editBingoCard,
    deleteBingoCard,
    setCurrentPage,
    setSearchTerm,
    setSelectedCategory,
  };
};

