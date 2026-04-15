import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Armchair, ArrowLeft, Footprints, HardHat, SportShoe } from 'lucide-react';
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
    icon: <Armchair />,
  },
  {
    value: 'often_standing',
    label: 'Often Standing',
    sub: 'Standing work, occasional walking.',
    icon: <Footprints />,
  },
  {
    value: 'regularly_walking',
    label: 'Regularly Walking',
    sub: 'Frequent walking, steady activity.',
    icon: <SportShoe className="scale-x-[-1]"  />,
  },
  {
    value: 'physically_intense',
    label: 'Physically Intense Work',
    sub: 'Heavy labor, high exertion.',
    icon: <HardHat />,
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
    <div className="h-[100dvh] bg-[#F8F9FA] flex flex-col px-5 pt-6 pb-6 font-sans overflow-hidden">

      {/* Progress bar */}
      <div className="flex justify-center mb-5 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="w-32 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-2/4 h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Goal */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-2">What are you looking for?</h2>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => dispatch(setField({ key: 'goal', value: g.value }))}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm transition-all duration-200"
            >
              <span className="text-sm font-bold text-gray-800">{g.label}</span>
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
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-2">How active are you?</h2>
        <div className="flex flex-col gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.value}
              onClick={() => dispatch(setField({ key: 'activityLevel', value: a.value }))}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{a.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.sub}</p>
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
        <h2 className="text-sm font-bold text-gray-900 mb-2">What's your target weight?</h2>

        {/* Green ideal range banner */}
        <div className="bg-[#2A9D8F] text-white text-[11px] font-medium text-center py-2 px-3 rounded-lg mb-3 shadow-sm">
          Based on your BMI of 27.85, your Ideal Weight range is 49.2-61.1 kg
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm mb-2">
          <input
            type="number"
            value={targetWeight.value}
            onChange={(e) =>
              dispatch(setField({ key: 'targetWeight', value: { ...targetWeight, value: e.target.value } }))
            }
            placeholder="55.2"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent font-medium"
          />
          <span className="text-sm text-gray-500 font-medium capitalize">{targetWeight.unit}</span>
        </div>
        
        <div className="flex justify-center">
          <div className="flex rounded-md overflow-hidden bg-white shadow-sm border border-gray-100 p-0.5">
            {['kg', 'lb'].map((u) => (
              <button
                key={u}
                onClick={() =>
                  dispatch(setField({ key: 'targetWeight', value: { ...targetWeight, unit: u } }))
                }
                className={`px-4 py-1 text-xs font-bold rounded-sm transition-colors capitalize ${
                  targetWeight.unit === u
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

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

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