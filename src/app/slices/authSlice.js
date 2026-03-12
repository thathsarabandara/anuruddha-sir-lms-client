import { createSlice } from '@reduxjs/toolkit';
import { getToken, getUser, setToken, setUser, clearAuthData } from '../../utils/helpers';

const initializeAuthState = () => {
  const token = getToken();
  const user = getUser();
  
  const isAuthenticated = !!(token && user && user.role);
  
  if ((token && !user) || (!token && user)) {
    console.log('Clearing corrupted auth data');
    clearAuthData();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
  
  return {
    user,
    token,
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
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      setToken(action.payload.token);
      setUser(action.payload.user);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearAuthData();
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      setUser(state.user);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
