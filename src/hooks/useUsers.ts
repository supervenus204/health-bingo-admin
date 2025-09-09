import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types';

export const useUsers = () => {
  const {
    users,
    currentPage,
    searchTerm,
    usersPerPage,
    isLoading,
    error,
    setUsers,
    addUser,
    updateUser,
    removeUser,
    setCurrentPage,
    setSearchTerm,
    setLoading,
    setError,
    getFilteredUsers,
    getCurrentUsers,
    getTotalPages,
  } = useUserStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await userService.createUser(userData);
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

  const resetUserPassword = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.resetPassword(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset password';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = getFilteredUsers();
  const currentUsers = getCurrentUsers();
  const totalPages = getTotalPages();

  return {
    users,
    filteredUsers,
    currentUsers,
    currentPage,
    searchTerm,
    usersPerPage,
    totalPages,
    isLoading,
    error,
    fetchUsers,
    createUser,
    editUser,
    deleteUser,
    resetUserPassword,
    setCurrentPage,
    setSearchTerm,
  };
};
