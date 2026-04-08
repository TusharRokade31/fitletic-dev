import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance'; // token is injected automatically

export const saveOnboardingStep = createAsyncThunk(
  'onboarding/saveStep',
  async (stepData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch('/onboarding', stepData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to save.');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'onboarding/complete',
  async (finalStepData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch('/onboarding', {
        ...finalStepData,
        isComplete: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to complete onboarding.');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    name: '',
    sex: '',
    age: '',
    weight: { value: '', unit: 'kg' },
    height: { value: '', unit: 'cm' },
    goal: '',
    activityLevel: '',
    targetWeight: { value: '', unit: 'kg' },
    medicalConditions: [],
    foodPreference: '',
    referralCode: '',
    loading: false,
    error: null,
    isComplete: false,
  },
  reducers: {
    setField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    toggleMedicalCondition: (state, action) => {
      const condition = action.payload;
      if (condition === 'none') {
        state.medicalConditions = [];
      } else {
        const idx = state.medicalConditions.indexOf(condition);
        if (idx === -1) state.medicalConditions.push(condition);
        else state.medicalConditions.splice(idx, 1);
      }
    },
    clearOnboardingError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveOnboardingStep.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(saveOnboardingStep.fulfilled, (state) => { state.loading = false; })
      .addCase(saveOnboardingStep.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(completeOnboarding.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(completeOnboarding.fulfilled, (state) => { state.loading = false; state.isComplete = true; })
      .addCase(completeOnboarding.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setField, toggleMedicalCondition, clearOnboardingError } = onboardingSlice.actions;
export default onboardingSlice.reducer;