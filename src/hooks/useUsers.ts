import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types';

export const useUsers = () => {
  const {
    users,
    currentPage,
    pageSize,
    searchTerm,
    sortColumn,
    sortDesc,
    total,
    totalPages,
    isLoading,
    error,
    setUsers,
    setPagination,
    addUser,
    updateUser,
    removeUser,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setSort,
    setLoading,
    setError,
  } = useUserStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const state = useUserStore.getState();
      const params: {
        sort?: string;
        desc?: boolean;
        pageNumber?: number;
        pageSize?: number;
        search?: string;
      } = {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
      };

      if (state.sortColumn) {
        params.sort = state.sortColumn;
        params.desc = state.sortDesc;
      }

      if (state.searchTerm) {
        params.search = state.searchTerm;
      }

      const response = await userService.getUsers(params);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await userService.createAdmin(userData);
      addUser(newUser);
      return newUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUser(id, userData);
      updateUser(id, updatedUser);
      return updatedUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      removeUser(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    currentPage,
    pageSize,
    searchTerm,
    sortColumn,
    sortDesc,
    total,
    totalPages,
    isLoading,
    error,
    fetchUsers,
    createAdmin,
    editUser,
    deleteUser,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setSort,
  };
};
