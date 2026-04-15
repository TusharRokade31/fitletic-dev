import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Mars, Venus } from 'lucide-react';
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
    <div className="h-[100dvh] bg-[#F8F9FA] flex flex-col px-5 pt-6 pb-6 font-sans overflow-hidden">

      {/* Progress bar */}
      <div className="flex justify-center mb-4 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="w-32 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1.5">Hey there!</h1>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
          We're happy that you've taken the first step towards a healthier you.
          We need a few details to kickstart your journey.
        </p>
      </div>

      {/* Name */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">What is your name?</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => dispatch(setField({ key: 'name', value: e.target.value }))}
          placeholder="Enter Your Name"
          className="w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-800 outline-none shadow-sm focus:ring-1 focus:ring-[#014c38] transition-all"
        />
      </div>

      {/* Sex */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">What's your biological sex?</h2>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(setField({ key: 'sex', value: 'male' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
              sex === 'male'
                ? ' border-[#014c38] bg-[#014c38] text-white'
                : 'border border-transparent bg-white text-gray-700'
            }`}
          >
            <Mars size={18} className={sex === 'male' ? 'text-white' : 'text-gray-500'} />
            Male
          </button>
          <button
            onClick={() => dispatch(setField({ key: 'sex', value: 'female' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
              sex === 'female'
                ? ' border-[#014c38] bg-[#014c38] text-white'
                : 'border border-transparent bg-white text-gray-700'
            }`}
          >
            <Venus size={18} className={sex === 'female' ? 'text-white' : 'text-gray-500'} />
            Female
          </button>
        </div>
      </div>

      {/* Age */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">What's your Age?</h2>
        <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <input
            type="number"
            value={age}
            onChange={(e) => dispatch(setField({ key: 'age', value: e.target.value }))}
            placeholder="20"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent font-medium"
          />
          <span className="text-sm text-gray-500 font-medium">Years</span>
        </div>
      </div>

      {/* Weight */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">What's your current weight?</h2>
        <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm mb-2">
          <input
            type="number"
            value={weight.value}
            onChange={(e) =>
              dispatch(setField({ key: 'weight', value: { ...weight, value: e.target.value } }))
            }
            placeholder="74"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent font-medium"
          />
          <span className="text-sm text-gray-500 font-medium capitalize">{weight.unit}</span>
        </div>
        <div className="flex justify-center">
          <div className="flex rounded-md overflow-hidden bg-white shadow-sm border border-gray-100 p-0.5">
            {['kg', 'lb'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'weight', value: { ...weight, unit: u } }))
                }
                className={`px-4 py-1 text-xs font-bold rounded-sm transition-colors capitalize ${
                  weight.unit === u
                    ? 'bg-[#014c38] text-white'
                    : 'bg-transparent text-gray-500'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Height */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-2">How tall are you?</h2>
        <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm mb-2">
          <input
            type="number"
            value={height.value}
            onChange={(e) =>
              dispatch(setField({ key: 'height', value: { ...height, value: e.target.value } }))
            }
            placeholder={height.unit === 'cm' ? '170' : '5.8'}
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent font-medium"
          />
          <span className="text-sm text-gray-500 font-medium capitalize">
            {height.unit === 'ft' ? 'Ft/In' : 'Cm'}
          </span>
        </div>
        <div className="flex justify-center">
          <div className="flex rounded-md overflow-hidden bg-white shadow-sm border border-gray-100 p-0.5">
            {['ft', 'cm'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'height', value: { ...height, unit: u } }))
                }
                className={`px-4 py-1 text-xs font-bold rounded-sm transition-colors ${
                  height.unit === u
                    ? 'bg-[#014c38] text-white'
                    : 'bg-transparent text-gray-500'
                }`}
              >
                {u === 'ft' ? 'Ft/In' : 'Cm'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="flex justify-center mb-3">
        <button className="flex items-center gap-2 text-[#014c38] font-bold text-xs">
          <Gift size={16} />
          Have a referral code?
        </button>
      </div>

      {error && <p className="text-red-500 text-xs text-center mb-1">{error}</p>}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={!canProceed || loading}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
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