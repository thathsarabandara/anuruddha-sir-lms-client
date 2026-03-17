import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, getUser, setToken, setUser, clearAuthData } from '../../utils/helpers';
import { authAPI } from '../../api';
import { normalizeRole } from '../../utils/constants';

// Async Thunk for Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const userData = response.data.user || response.data.data?.user;
      const accesstoken = response.data.access_token || response.data.data?.access_token;
      const refreshtoken = response.data.refresh_token || response.data.data?.refresh_token;
      
      if (userData && accesstoken && refreshtoken) {
        // Normalize the user role
        const normalizedUser = {
          ...userData,
          role: normalizeRole(userData.role),
        };
        
        setToken('access_token', accesstoken);
        setToken('refresh_token', refreshtoken);
        setUser(normalizedUser);
        return { user: normalizedUser, access_token: accesstoken, refresh_token: refreshtoken };
      }
      return rejectWithValue('Invalid response structure');
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async Thunk for Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authAPI.logout();
      clearAuthData();
      return null;
    } catch (error) {
      console.warn('Logout API call failed, clearing auth data locally:', error);
      clearAuthData();
      return null;
    }
  }
);

// Async Thunk for Verify Auth
export const verifyAuth = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user || response.data.data?.user || response.data;
      
      if (userData && userData.id) {
        // Normalize the user role
        const normalizedUser = {
          ...userData,
          role: normalizeRole(userData.role),
        };
        setUser(normalizedUser);
        return { user: normalizedUser };
      }
      return rejectWithValue('No valid user data in response');
    } catch (error) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);

// Async Thunk for Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const initializeAuthState = () => {
  const access_token = getToken('access_token');
  const refresh_token = getToken('refresh_token');
  let user = getUser();
  
  // Normalize user role if user exists
  if (user && user.role) {
    user = {
      ...user,
      role: normalizeRole(user.role),
    };
  }
  
  const isAuthenticated = !!(access_token && refresh_token);
  
  return {
    user: user || null,
    access_token,
    refresh_token,
    isAuthenticated,
    loading: false,
    error: null,
  };
};

const initialState = initializeAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      setUser(state.user);
    },
    // Legacy actions for backward compatibility
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token || action.payload.token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      if (action.payload.access_token) {
        setToken('access_token', action.payload.access_token);
      }
      if (action.payload.refresh_token) {
        setToken('refresh_token', action.payload.refresh_token);
      }
      if (action.payload.user) {
        setUser(action.payload.user);
      }
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      clearAuthData();
    },
  },
  extraReducers: (builder) => {
    // Login thunk handlers
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout thunk handlers
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
      });

    // Verify Auth thunk handlers
    builder
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        clearAuthData();
      });

    // Register thunk handlers
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUser, loginSuccess, loginStart, loginFailure } = authSlice.actions;

export default authSlice.reducer;
