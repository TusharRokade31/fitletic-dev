import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { setField, toggleMedicalCondition, saveOnboardingStep } from '../features/auth/onboardingSlice';

const CONDITIONS = [
  { value: 'diabetes',               label: 'Diabetes' },
  { value: 'pre_diabetes',           label: 'Pre-Diabetes' },
  { value: 'cholesterol',            label: 'Cholesterol' },
  { value: 'hypertension',           label: 'Hypertension' },
  { value: 'pcos',                   label: 'PCOS' },
  { value: 'thyroid',                label: 'Thyroid' },
  { value: 'physical_injury',        label: 'Physical Injury' },
  { value: 'excessive_stress',       label: 'Excessive stress/anxiety' },
  { value: 'sleep_issues',           label: 'Sleep issues' },
  { value: 'depression',             label: 'Depression' },
  { value: 'anger_issues',           label: 'Anger issues' },
  { value: 'loneliness',             label: 'Loneliness' },
  { value: 'relationship_stress',    label: 'Relationship stress' },
];

function RadioCircle({ selected }) {
  return (
    <span
      className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'border-[#014c38]' : 'border-gray-400'
      }`}
    >
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#014c38]" />}
    </span>
  );
}

export default function OnboardingStep3() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { medicalConditions, foodPreference, loading, error } = useSelector((s) => s.onboarding);

  const isNone = medicalConditions.length === 0;
  const isSelected = (val) => medicalConditions.includes(val);

  const canProceed = foodPreference; 

  const handleNext = async () => {
    if (!canProceed) return;
    const result = await dispatch(
      saveOnboardingStep({ medicalConditions, foodPreference })
    );
    if (saveOnboardingStep.fulfilled.match(result)) {
      navigate('/onboarding/4');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col px-6 pt-10 pb-8 font-sans overflow-y-auto">

      {/* Progress bar */}
      <div className="flex justify-center mb-8 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="w-32 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-[#014c38] rounded-full" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-sm font-bold text-gray-900 mb-5 leading-tight">
        Any Medical Condition we should be aware of?
      </h2>

      {/* None option */}
      <button
        onClick={() => dispatch(toggleMedicalCondition('none'))}
        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white shadow-sm transition-all w-fit mb-4"
      >
        <span className="text-sm font-bold text-gray-800">None</span>
        <RadioCircle selected={isNone} />
      </button>

      <hr className="border-gray-200 my-4" />

      {/* Dynamic Grid / Flow Layout for Conditions */}
      <div className="flex flex-wrap gap-x-3 gap-y-3 mb-8">
        {CONDITIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => dispatch(toggleMedicalCondition(c.value))}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white shadow-sm transition-all w-fit"
          >
            <span className="text-sm font-bold text-gray-800">{c.label}</span>
            <RadioCircle selected={isSelected(c.value)} />
          </button>
        ))}
      </div>

      {/* Food Preference */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-900 mb-4">What is your food preference?</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'jain',     label: 'Jain' },
            { value: 'non_jain', label: 'Non-Jain' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch(setField({ key: 'foodPreference', value: opt.value }))}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white shadow-sm transition-all w-fit"
            >
              <span className="text-sm font-bold text-gray-800">{opt.label}</span>
              <RadioCircle selected={foodPreference === opt.value} />
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

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