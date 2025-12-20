import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  users: User[];
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string | null;
  sortDesc: boolean;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setPagination: (pagination: {
    total: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (term: string) => void;
  setSort: (column: string | null, desc?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      currentPage: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: null,
      sortDesc: false,
      total: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      setUsers: (users: User[]) => {
        set({ users });
      },
      setPagination: (pagination) => {
        set({
          total: pagination.total,
          totalPages: pagination.totalPages,
          currentPage: pagination.pageNumber,
          pageSize: pagination.pageSize,
        });
      },
      addUser: (user: User) => {
        set(state => ({
          users: [...state.users, user],
        }));
      },
      updateUser: (id: string, updates: Partial<User>) => {
        set(state => ({
          users: state.users.map(user =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },
      removeUser: (id: string) => {
        set(state => ({
          users: state.users.filter(user => user.id !== id),
        }));
      },
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },
      setPageSize: (size: number) => {
        set({ pageSize: size, currentPage: 1 });
      },
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },
      setSort: (column: string | null, desc = false) => {
        set({ sortColumn: column, sortDesc: desc, currentPage: 1 });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'user-storage',
      partialize: state => ({
        users: state.users,
      }),
    }
  )
);
