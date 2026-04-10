import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { setField, completeOnboarding } from '../features/auth/onboardingSlice';

export default function OnboardingStep4() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { referralCode, loading, error } = useSelector((s) => s.onboarding);

  const handleNext = async () => {
    const result = await dispatch(
      completeOnboarding({ referralCode: referralCode.trim() })
    );
    if (completeOnboarding.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col px-6 pt-10 pb-8 font-sans">

      {/* Progress bar */}
      <div className="flex justify-center mb-6 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-44 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Enter Your Referral Code</h1>
        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
          Enter your friend's referral code to get up to 30 days free on your chosen plan.
        </p>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-10">
        <div className="w-28 h-28 rounded-full bg-[#0D5941] flex items-center justify-center shadow-lg">
          <span className="text-5xl">🤝</span>
        </div>
      </div>

      {/* Referral Code Input */}
      <div className="mb-3">
        <input
          type="text"
          value={referralCode}
          onChange={(e) =>
            dispatch(setField({ key: 'referralCode', value: e.target.value.toUpperCase() }))
          }
          placeholder="Enter Referral Code"
          maxLength={20}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm text-gray-800 outline-none focus:border-[#0D5941] shadow-sm transition-all tracking-widest font-mono uppercase"
        />
      </div>

      {/* Skip hint */}
      <p className="text-xs text-center text-gray-400 mb-4">
        Don't have a referral code?{' '}
        <button
          onClick={handleNext}
          className="text-[#0D5941] font-semibold underline underline-offset-2"
        >
          Skip
        </button>
      </p>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            !loading
              ? 'bg-[#014c38] text-white shadow-md'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {loading ? 'Finishing...' : 'Next'}
        </button>
      </div>
    </div>
  );
}