// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import onboardingReducer from '../features/auth/onboardingSlice';
import { injectStore } from '../features/auth/axiosInstance';

const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
  },
});

injectStore(store);   // ← add this — gives axiosInstance access to the store

export default store;