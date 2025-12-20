import { BingoCard } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BingoCardState {
  bingoCards: BingoCard[];
  currentPage: number;
  searchTerm: string;
  selectedCategory: string;
  bingoCardsPerPage: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setBingoCards: (bingoCards: BingoCard[]) => void;
  setPagination: (pagination: {
    total: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }) => void;
  addBingoCard: (bingoCard: BingoCard) => void;
  updateBingoCard: (id: string, updates: Partial<BingoCard>) => void;
  removeBingoCard: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFilteredBingoCards: () => BingoCard[];
}

export const useBingoCardStore = create<BingoCardState>()(
  persist(
    (set, get) => ({
      bingoCards: [],
      currentPage: 1,
      searchTerm: '',
      selectedCategory: 'all',
      bingoCardsPerPage: 50,
      total: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      setBingoCards: (bingoCards: BingoCard[]) => {
        set({ bingoCards: Array.isArray(bingoCards) ? bingoCards : [] });
      },
      setPagination: (pagination) => {
        set({
          total: pagination.total,
          totalPages: pagination.totalPages,
          currentPage: pagination.pageNumber,
          bingoCardsPerPage: pagination.pageSize,
        });
      },
      addBingoCard: (bingoCard: BingoCard) => {
        set(state => ({
          bingoCards: [...state.bingoCards, bingoCard],
        }));
      },
      updateBingoCard: (id: string, updates: Partial<BingoCard>) => {
        set(state => ({
          bingoCards: state.bingoCards.map(bingoCard =>
            bingoCard.id === id ? { ...bingoCard, ...updates } : bingoCard
          ),
        }));
      },
      removeBingoCard: (id: string) => {
        set(state => ({
          bingoCards: state.bingoCards.filter(bingoCard => bingoCard.id !== id),
        }));
      },
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },
      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category, currentPage: 1 });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
      getFilteredBingoCards: () => {
        const { bingoCards, searchTerm } = get();
        let filtered = Array.isArray(bingoCards) ? bingoCards : [];

        if (searchTerm) {
          filtered = filtered.filter(
            card =>
              card?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card?.id?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return filtered;
      },
    }),
    {
      name: 'bingo-card-storage',
      partialize: state => ({
        bingoCards: Array.isArray(state.bingoCards) ? state.bingoCards : [],
      }),
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          bingoCards: Array.isArray(persistedState?.bingoCards)
            ? persistedState.bingoCards
            : [],
        };
      },
    }
  )
);

