import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import notificationReducer from '../slices/notificationSlice';
import languageReducer from '../slices/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: {
        extraArgument: {},
      },
    }),
});

export default store;
