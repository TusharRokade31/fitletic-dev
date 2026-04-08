import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
    const token = response.data.data.accessToken;
    
    // Save token to cookie (expires in 7 days)
    Cookies.set('accessToken', token, { expires: 7 });
    
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
      
      const token = data.data?.accessToken;
      // Save token to cookie (expires in 7 days)
      if (token) {
        Cookies.set('accessToken', token, { expires: 7 });
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed.');
    }
  }
);

export const loginWithEmail = createAsyncThunk('auth/loginEmail', async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.data?.accessToken;
    
    // Save token to cookie (expires in 7 days)
    if (token) {
      Cookies.set('accessToken', token, { expires: 7 });
    }

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const updateName = createAsyncThunk(
  'auth/updateName',
  async (name, { getState, rejectWithValue }) => {
    try {
      // 1. Now we can safely grab the token from Redux state!
      const token = getState().auth.accessToken; 
      
      if (!token) {
        return rejectWithValue("Authentication token missing.");
      }

      const { data } = await axios.patch(
        `${API_URL}/me`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    // 2. Initialize accessToken directly from the cookie on page refresh
    accessToken: Cookies.get('accessToken') || null, 
    // If we have a token on load, we can assume they are authenticated
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
      Cookies.remove('accessToken');
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.registrationData = { name: '', referralCode: '' };
    },
    // ADD THIS NEW REDUCER:
    setSocialCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      // Save token to cookie (expires in 7 days) matching your thunks
      Cookies.set('accessToken', accessToken, { expires: 7 });
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
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Email Login
      .addCase(loginWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
      })
      .addCase(loginWithEmail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Register cases
      .addCase(registerWithEmail.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        // Save token to state if it exists
        if (action.payload.data?.accessToken) {
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
        }
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(registerWithEmail.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // Update Name
      .addCase(updateName.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateName.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user ?? action.payload;
      })
      .addCase(updateName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTempPhone, clearError, setRegistrationData, clearRegistrationData, logout, setSocialCredentials } = authSlice.actions;
export default authSlice.reducer;