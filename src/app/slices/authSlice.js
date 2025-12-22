import { createSlice } from '@reduxjs/toolkit';
import { getToken, getUser, setToken, setUser, clearAuthData } from '../../utils/helpers';

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!(getToken() && getUser()),
  loading: false,
  error: null,
};

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
      
      // Clear localStorage
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
