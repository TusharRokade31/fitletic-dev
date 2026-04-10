import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { setField, saveOnboardingStep } from '../features/auth/onboardingSlice';

export default function OnboardingStep1() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, sex, age, weight, height, loading, error } = useSelector((s) => s.onboarding);

  const canProceed = name.trim() && sex && age && weight.value && height.value;

  const handleNext = async () => {
    if (!canProceed) return;
    const result = await dispatch(
      saveOnboardingStep({
        name: name.trim(),
        sex,
        age: Number(age),
        weight: { value: Number(weight.value), unit: weight.unit },
        height: { value: Number(height.value), unit: height.unit },
      })
    );
    if (saveOnboardingStep.fulfilled.match(result)) {
      navigate('/onboarding/2');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col px-6 pt-10 pb-8 font-sans overflow-y-auto">

      {/* Progress bar */}
      <div className="flex justify-center mb-6 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-44 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Hey there!</h1>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          We're happy you've taken the first step towards a healthier you.
          We need a few details to kickstart your journey.
        </p>
      </div>

      {/* Name */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">What is your name?</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => dispatch(setField({ key: 'name', value: e.target.value }))}
          placeholder="Enter Your Name"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0D5941] shadow-sm transition-all"
        />
      </div>

      {/* Sex */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">What's your biological sex?</h2>
        <div className="flex gap-3">
          {[
            { value: 'male', label: '♂ Male' },
            { value: 'female', label: '♀ Female' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch(setField({ key: 'sex', value: opt.value }))}
              className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                sex === opt.value
                  ? 'border-[#014c38] bg-[#014c38] text-white'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">What's your Age?</h2>
        <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <input
            type="number"
            value={age}
            onChange={(e) => dispatch(setField({ key: 'age', value: e.target.value }))}
            placeholder="20"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
          />
          <span className="text-sm text-gray-400 font-medium">Years</span>
        </div>
      </div>

      {/* Weight */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">What's your current weight?</h2>
        <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <input
            type="number"
            value={weight.value}
            onChange={(e) =>
              dispatch(setField({ key: 'weight', value: { ...weight, value: e.target.value } }))
            }
            placeholder="74"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
          />
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-bold">
            {['kg', 'lb'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'weight', value: { ...weight, unit: u } }))
                }
                className={`px-3 py-1 transition-colors ${
                  weight.unit === u
                    ? 'bg-[#014c38] text-white'
                    : 'bg-white text-gray-500'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Height */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">How tall are you?</h2>
        <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <input
            type="number"
            value={height.value}
            onChange={(e) =>
              dispatch(setField({ key: 'height', value: { ...height, value: e.target.value } }))
            }
            placeholder="170"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
          />
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-bold">
            {['ft/in', 'cm'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'height', value: { ...height, unit: u === 'ft/in' ? 'ft' : 'cm' } }))
                }
                className={`px-3 py-1 transition-colors ${
                  (u === 'ft/in' ? 'ft' : 'cm') === height.unit
                    ? 'bg-[#014c38] text-white'
                    : 'bg-white text-gray-500'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

      {/* Disclaimer */}
      <p className="text-xs text-center text-gray-400 mt-2 mb-6">
        ⓘ Don't worry if you don't know it precisely — you can change this later from settings.
      </p>

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={!canProceed || loading}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            canProceed && !loading
              ? 'bg-[#014c38] text-white shadow-md'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
}