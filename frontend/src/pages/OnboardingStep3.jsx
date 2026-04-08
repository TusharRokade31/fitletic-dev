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
  { value: 'sleep_issues',           label: 'Sleep Issues' },
  { value: 'depression',             label: 'Depression' },
  { value: 'anger_issues',           label: 'Anger Issues' },
  { value: 'loneliness',             label: 'Loneliness' },
  { value: 'relationship_stress',    label: 'Relationship stress' },
];

// Conditions that are displayed in a two-column grid (paired side by side)
const PAIRED_CONDITIONS = [
  ['diabetes', 'pre_diabetes'],
  ['cholesterol', 'hypertension'],
  ['pcos', 'thyroid'],
];

// Conditions displayed in single full-width rows
const SINGLE_CONDITIONS = [
  'physical_injury',
  'excessive_stress',
  'sleep_issues',
  'depression',
  'anger_issues',
  'loneliness',
  'relationship_stress',
];

function RadioCircle({ selected }) {
  return (
    <span
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'border-[#083D2C]' : 'border-gray-300'
      }`}
    >
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#083D2C]" />}
    </span>
  );
}

export default function OnboardingStep3() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { medicalConditions, foodPreference, loading, error } = useSelector((s) => s.onboarding);

  const isNone = medicalConditions.length === 0;
  const isSelected = (val) => medicalConditions.includes(val);

  const canProceed = foodPreference; // medical is optional (can be "none")

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
      <div className="flex justify-center mb-6 relative items-center">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-44 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-[#083D2C] rounded-full" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-base font-bold text-gray-900 mb-4">
        Any Medical Condition we should be aware of?
      </h2>

      {/* None option */}
      <button
        onClick={() => dispatch(toggleMedicalCondition('none'))}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium mb-3 transition-all w-auto self-start ${
          isNone
            ? 'border-[#083D2C] bg-[#083D2C]/5 text-[#083D2C]'
            : 'border-gray-200 bg-white text-gray-700'
        }`}
      >
        <RadioCircle selected={isNone} />
        <span>None</span>
      </button>

      {/* Paired conditions (2 col grid) */}
      <div className="flex flex-col gap-2 mb-2">
        {PAIRED_CONDITIONS.map(([left, right]) => {
          const leftLabel = CONDITIONS.find((c) => c.value === left)?.label;
          const rightLabel = CONDITIONS.find((c) => c.value === right)?.label;
          return (
            <div key={left} className="grid grid-cols-2 gap-2">
              {[{ value: left, label: leftLabel }, { value: right, label: rightLabel }].map((c) => (
                <button
                  key={c.value}
                  onClick={() => dispatch(toggleMedicalCondition(c.value))}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                    isSelected(c.value)
                      ? 'border-[#083D2C] bg-[#083D2C]/5 text-[#083D2C]'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <span>{c.label}</span>
                  <RadioCircle selected={isSelected(c.value)} />
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Single-row conditions */}
      <div className="flex flex-col gap-2 mb-6">
        {SINGLE_CONDITIONS.map((val) => {
          const label = CONDITIONS.find((c) => c.value === val)?.label;
          return (
            <button
              key={val}
              onClick={() => dispatch(toggleMedicalCondition(val))}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isSelected(val)
                  ? 'border-[#083D2C] bg-[#083D2C]/5 text-[#083D2C]'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span>{label}</span>
              <RadioCircle selected={isSelected(val)} />
            </button>
          );
        })}
      </div>

      {/* Food Preference */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">What is your food preference?</h2>
        <div className="flex flex-col gap-2">
          {[
            { value: 'jain',     label: 'Jain' },
            { value: 'non_jain', label: 'Non-Jain' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch(setField({ key: 'foodPreference', value: opt.value }))}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                foodPreference === opt.value
                  ? 'border-[#083D2C] bg-[#083D2C]/5 text-[#083D2C]'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span>{opt.label}</span>
              <RadioCircle selected={foodPreference === opt.value} />
            </button>
          ))}
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
              ? 'bg-[#083D2C] text-white shadow-md'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
}