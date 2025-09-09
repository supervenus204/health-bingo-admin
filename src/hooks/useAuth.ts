import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { LoginRequest } from '@/types';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: setAuthData,
    logout: clearAuthData,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      clearError();

      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response.data;

      setAuthData(user, token, refreshToken);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshToken = async () => {
    const currentRefreshToken = useAuthStore.getState().refreshToken;
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(currentRefreshToken);
      const { user, token, refreshToken: newRefreshToken } = response.data;

      setAuthData(user, token, newRefreshToken);
      return response;
    } catch (error) {
      clearAuthData();
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
  };
};
