import { promoCodeService } from '@/services/promoCodeService';
import { usePromoCodeStore } from '@/stores/promoCodeStore';
import { CreatePromoCodeRequest, UpdatePromoCodeRequest } from '@/types';

export const usePromoCodes = () => {
  const {
    promoCodes,
    currentPage,
    searchTerm,
    promoCodesPerPage,
    isLoading,
    error,
    setPromoCodes,
    addPromoCode,
    updatePromoCode,
    removePromoCode,
    setCurrentPage,
    setSearchTerm,
    setLoading,
    setError,
    getFilteredPromoCodes,
    getCurrentPromoCodes,
    getTotalPages,
  } = usePromoCodeStore();

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPromoCodes = await promoCodeService.getPromoCodes();
      setPromoCodes(fetchedPromoCodes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch promo codes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async (promoCodeData: CreatePromoCodeRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newPromoCode = await promoCodeService.createPromoCode(
        promoCodeData
      );
      addPromoCode(newPromoCode);
      return newPromoCode;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create promo code';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editPromoCode = async (
    id: string,
    promoCodeData: UpdatePromoCodeRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPromoCode = await promoCodeService.updatePromoCode(
        id,
        promoCodeData
      );
      updatePromoCode(id, updatedPromoCode);
      return updatedPromoCode;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update promo code';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await promoCodeService.deletePromoCode(id);
      removePromoCode(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete promo code';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const togglePromoCodeStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPromoCode = await promoCodeService.togglePromoCodeStatus(id);
      updatePromoCode(id, updatedPromoCode);
      return updatedPromoCode;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle promo code status';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const filteredPromoCodes = getFilteredPromoCodes();
  const currentPromoCodes = getCurrentPromoCodes();
  const totalPages = getTotalPages();

  return {
    promoCodes,
    filteredPromoCodes,
    currentPromoCodes,
    currentPage,
    searchTerm,
    promoCodesPerPage,
    totalPages,
    isLoading,
    error,
    fetchPromoCodes,
    createPromoCode,
    editPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    setCurrentPage,
    setSearchTerm,
  };
};
