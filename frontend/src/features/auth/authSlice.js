import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';           
import axiosInstance from './axiosInstance'; 
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/auth';

// --- Thunks ---

export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ phone, countryCode }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/otp/send`, { phone, countryCode });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, countryCode, otp }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/otp/verify`, { phone, countryCode, otp });
    const { accessToken, refreshToken } = response.data.data;
    
    if (accessToken) Cookies.set('accessToken', accessToken, { expires: 7 });
    if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 }); // Save refresh token
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Invalid OTP');
  }
});

export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async ({ email, password, employeeId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        email,
        password,
        ...(employeeId ? { employeeId } : {}),
      });
      const { accessToken, refreshToken } = data.data || {};
      
      if (accessToken) Cookies.set('accessToken', accessToken, { expires: 7 });
      if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 }); // Save refresh token
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed.');
    }
  }
);

export const loginWithEmail = createAsyncThunk('auth/loginEmail', async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { accessToken, refreshToken } = response.data.data || {};
    
    if (accessToken) Cookies.set('accessToken', accessToken, { expires: 7 });
    if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 }); // Save refresh token
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// Uses axiosInstance — token is attached automatically via the interceptor
export const updateName = createAsyncThunk(
  'auth/updateName',
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch('/auth/me', { name });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Could not save name.');
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: Cookies.get('accessToken') || null,
    isAuthenticated: !!Cookies.get('accessToken'),
    loading: false,
    error: null,
    tempPhone: null,
    registrationData: {
      name: '',
      referralCode: ''
    }
  },
  reducers: {
    setTempPhone: (state, action) => {
      state.tempPhone = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationData: (state, action) => {
      state.registrationData = { ...state.registrationData, ...action.payload };
    },
    clearRegistrationData: (state) => {
      state.registrationData = { name: '', referralCode: '' };
    },
    logout: (state) => {
      // CRITICAL: Clear BOTH tokens so the interceptor properly logs the user out
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.registrationData = { name: '', referralCode: '' };
    },
    setSocialCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      
      Cookies.set('accessToken', accessToken, { expires: 7 });
      if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
      })
      .addCase(loginWithEmail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(registerWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data?.accessToken) {
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
        }
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(registerWithEmail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateName.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateName.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user ?? action.payload;
      })
      .addCase(updateName.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setTempPhone, clearError, setRegistrationData, clearRegistrationData, logout, setSocialCredentials } = authSlice.actions;
export default authSlice.reducer;