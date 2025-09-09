import { PromoCode } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PromoCodeState {
  promoCodes: PromoCode[];
  currentPage: number;
  searchTerm: string;
  promoCodesPerPage: number;
  isLoading: boolean;
  error: string | null;
  setPromoCodes: (promoCodes: PromoCode[]) => void;
  addPromoCode: (promoCode: PromoCode) => void;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void;
  removePromoCode: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFilteredPromoCodes: () => PromoCode[];
  getCurrentPromoCodes: () => PromoCode[];
  getTotalPages: () => number;
}

export const usePromoCodeStore = create<PromoCodeState>()(
  persist(
    (set, get) => ({
      promoCodes: [],
      currentPage: 1,
      searchTerm: '',
      promoCodesPerPage: 10,
      isLoading: false,
      error: null,
      setPromoCodes: (promoCodes: PromoCode[]) => {
        set({ promoCodes });
      },
      addPromoCode: (promoCode: PromoCode) => {
        set(state => ({
          promoCodes: [...state.promoCodes, promoCode],
        }));
      },
      updatePromoCode: (id: string, updates: Partial<PromoCode>) => {
        set(state => ({
          promoCodes: state.promoCodes.map(promoCode =>
            promoCode.id === id ? { ...promoCode, ...updates } : promoCode
          ),
        }));
      },
      removePromoCode: (id: string) => {
        set(state => ({
          promoCodes: state.promoCodes.filter(promoCode => promoCode.id !== id),
        }));
      },
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
      getFilteredPromoCodes: () => {
        const { promoCodes, searchTerm } = get();
        if (!searchTerm) return promoCodes;

        return promoCodes.filter(
          promoCode =>
            promoCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promoCode.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },
      getCurrentPromoCodes: () => {
        const { currentPage, promoCodesPerPage } = get();
        const filteredPromoCodes = get().getFilteredPromoCodes();
        const startIndex = (currentPage - 1) * promoCodesPerPage;
        return filteredPromoCodes.slice(
          startIndex,
          startIndex + promoCodesPerPage
        );
      },
      getTotalPages: () => {
        const { promoCodesPerPage } = get();
        const filteredPromoCodes = get().getFilteredPromoCodes();
        return Math.ceil(filteredPromoCodes.length / promoCodesPerPage);
      },
    }),
    {
      name: 'promo-code-storage',
      partialize: state => ({
        promoCodes: state.promoCodes,
      }),
    }
  )
);
