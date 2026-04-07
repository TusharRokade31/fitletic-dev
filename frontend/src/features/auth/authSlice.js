import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// --- Thunks ---
export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ phone, countryCode }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/otp/send`, { phone, countryCode });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, countryCode, otp }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/otp/verify`, { phone, countryCode, otp });
    // Save tokens to localStorage
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Invalid OTP');
  }
});


export const registerWithEmail = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginWithEmail = createAsyncThunk('auth/loginEmail', async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
  }
});

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    tempPhone: null,
    registrationData: {
      name: '',
      referralCode: ''
    } // Stores phone number temporarily between screen 2 and 3
  },
  reducers: {
    setTempPhone: (state, action) => {
      state.tempPhone = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // NEW: Action to save data between steps
    setRegistrationData: (state, action) => {
      state.registrationData = { ...state.registrationData, ...action.payload };
    },
    clearRegistrationData: (state) => {
      state.registrationData = { name: '', referralCode: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Email Login
      .addCase(loginWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
      })
      .addCase(loginWithEmail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Register cases
      .addCase(registerWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerWithEmail.fulfilled, (state) => {
        state.loading = false;
        // The backend returns a 201 Created and asks to verify email.
        // We do NOT set isAuthenticated to true yet.
      })
      .addCase(registerWithEmail.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      });
  },
});

export const { setTempPhone, clearError, setRegistrationData, clearRegistrationData } = authSlice.actions;
export default authSlice.reducer;