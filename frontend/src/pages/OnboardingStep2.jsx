import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { setField, saveOnboardingStep } from '../features/auth/onboardingSlice';

const GOALS = [
  { value: 'weight_loss',   label: 'Weight Loss' },
  { value: 'muscle_gain',   label: 'Muscle Gain' },
  { value: 'healthy_foods', label: 'Healthy Foods' },
];

const ACTIVITIES = [
  {
    value: 'mostly_sitting',
    label: 'Mostly Sitting',
    sub: 'Seated work, low movement.',
    icon: '🪑',
  },
  {
    value: 'often_standing',
    label: 'Often Standing',
    sub: 'Standing work, occasional walking.',
    icon: '🧍',
  },
  {
    value: 'regularly_walking',
    label: 'Regularly Walking',
    sub: 'Frequent walking, steady activity.',
    icon: '🚶',
  },
  {
    value: 'physically_intense',
    label: 'Physically Intense Work',
    sub: 'Heavy labor, high exertion.',
    icon: '🏋️',
  },
];

export default function OnboardingStep2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { goal, activityLevel, targetWeight, loading, error } = useSelector((s) => s.onboarding);

  const canProceed = goal && activityLevel && targetWeight.value;

  const handleNext = async () => {
    if (!canProceed) return;
    const result = await dispatch(
      saveOnboardingStep({
        goal,
        activityLevel,
        targetWeight: { value: Number(targetWeight.value), unit: targetWeight.unit },
      })
    );
    if (saveOnboardingStep.fulfilled.match(result)) {
      navigate('/onboarding/3');
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
          <div className="w-2/4 h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Goal */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">What are you looking for?</h2>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => dispatch(setField({ key: 'goal', value: g.value }))}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                goal === g.value
                  ? 'border-[#014c38] bg-[#014c38]/5 text-[#014c38]'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span>{g.label}</span>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  goal === g.value ? 'border-[#014c38]' : 'border-gray-300'
                }`}
              >
                {goal === g.value && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#014c38]" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">How active are you?</h2>
        <div className="flex flex-col gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.value}
              onClick={() => dispatch(setField({ key: 'activityLevel', value: a.value }))}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                activityLevel === a.value
                  ? 'border-[#014c38] bg-[#014c38]/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${activityLevel === a.value ? 'text-[#014c38]' : 'text-gray-800'}`}>
                    {a.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.sub}</p>
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  activityLevel === a.value ? 'border-[#014c38]' : 'border-gray-300'
                }`}
              >
                {activityLevel === a.value && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#014c38]" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Weight */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">What's your target weight?</h2>

        {/* Green ideal range banner */}
        <div className="bg-[#0D5941] text-white text-xs text-center py-1.5 px-4 rounded-lg mb-3">
          Based on your BMI, your ideal weight range is 49.2–61 kg
        </div>

        <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <input
            type="number"
            value={targetWeight.value}
            onChange={(e) =>
              dispatch(setField({ key: 'targetWeight', value: { ...targetWeight, value: e.target.value } }))
            }
            placeholder="55.2"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
          />
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-bold">
            {['kg', 'lb'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'targetWeight', value: { ...targetWeight, unit: u } }))
                }
                className={`px-3 py-1 transition-colors ${
                  targetWeight.unit === u
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