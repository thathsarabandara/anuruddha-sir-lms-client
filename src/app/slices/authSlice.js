import { createSlice } from '@reduxjs/toolkit';
import { getToken, getUser, setToken, setUser, clearAuthData } from '../../utils/helpers';

// Mock user for development/testing - Use SUPER_ADMIN to access all panels
//   const mockUser = {
//     id: '1',
//     email: 'admin@example.com',
//     first_name: 'Test',
//     last_name: 'Admin',
//     role: 'STUDENT', // Change to: STUDENT, TEACHER, ADMIN, SUPER_ADMIN, DEVELOPER
//     phone_number: '+94771234567',
//     school_name: 'Test School',
//     grade: 'Grade 5',
//     profile_picture: null,
//     is_active: true,
// };

const initialState = {
  user: getUser() ,
  token: getToken(),
  isAuthenticated: false,
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
      
      // Persist to localStorage
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
