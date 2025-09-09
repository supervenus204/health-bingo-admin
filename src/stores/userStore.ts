import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  users: User[];
  currentPage: number;
  searchTerm: string;
  usersPerPage: number;
  isLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFilteredUsers: () => User[];
  getCurrentUsers: () => User[];
  getTotalPages: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentPage: 1,
      searchTerm: '',
      usersPerPage: 10,
      isLoading: false,
      error: null,
      setUsers: (users: User[]) => {
        set({ users });
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
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
      getFilteredUsers: () => {
        const { users, searchTerm } = get();
        if (!searchTerm) return users;

        return users.filter(
          user =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },
      getCurrentUsers: () => {
        const { currentPage, usersPerPage } = get();
        const filteredUsers = get().getFilteredUsers();
        const startIndex = (currentPage - 1) * usersPerPage;
        return filteredUsers.slice(startIndex, startIndex + usersPerPage);
      },
      getTotalPages: () => {
        const { usersPerPage } = get();
        const filteredUsers = get().getFilteredUsers();
        return Math.ceil(filteredUsers.length / usersPerPage);
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
