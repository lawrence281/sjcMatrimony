import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AuthAPI from '@/api/authAPI';
import { ADMIN_ROLES } from '@/constants/roles';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // True on initial mount to check existing session
  error: null,
};

const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Attempt to restore session on mount using refresh token (httpOnly cookie)
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (!storedToken) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      try {
        const response = await AuthAPI.refreshToken();
        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, accessToken } });
      } catch {
        localStorage.removeItem('accessToken');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    restoreSession();

    // Listen for session expiry events from Axios interceptor
    const handleSessionExpired = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Listen for session restoration (e.g. from OTP verification)
    const handleSessionRestored = (e) => {
      const { accessToken, user } = e.detail || {};
      if (accessToken && user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, accessToken } });
      }
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    window.addEventListener('auth:session-restored', handleSessionRestored);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      window.removeEventListener('auth:session-restored', handleSessionRestored);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await AuthAPI.login(credentials);
      const { accessToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, accessToken } });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout();
    } catch {
      // Continue logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const isAdmin = state.user && ADMIN_ROLES.includes(state.user.role);
  const isClient = state.user && state.user.role === 'client';
  const isSuperAdmin = state.user?.role === 'super_admin';

  const value = {
    ...state,
    login,
    logout,
    clearError,
    isAdmin,
    isClient,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
