import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRegistrationData } from '../features/auth/authSlice';
import { Gift } from 'lucide-react';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim().length === 0) return;
    
    // Save the name to Redux so the next screen can use it
    dispatch(setRegistrationData({ name: name.trim(), referralCode }));
    
    // Navigate to the next step (Email/Password registration)
    navigate('/register-email');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col px-6 pt-12 pb-8 font-sans">
      
      {/* Progress Bar */}
      <div className="flex justify-center mb-8">
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          {/* Step 1 of 2 progress indicator */}
          <div className="w-1/3 h-full bg-brand-dark"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Hey there!</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          We're happy that you've taken the first step towards a healthier you. 
          We need a few details to kickstart your journey.
        </p>
      </div>

      {/* Input Form */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">What is your name?</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none focus:border-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-4 transition-all"
        />
        
        {!showReferral ? (
          <button 
            onClick={() => setShowReferral(true)}
            className="flex items-center justify-center w-full gap-2 text-brand-dark font-semibold text-sm"
          >
            <Gift className="w-4 h-4" /> Have a referral code?
          </button>
        ) : (
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter Referral Code (Optional)"
            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none focus:border-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all"
          />
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={name.trim().length === 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-colors duration-200 ${
            name.trim().length > 0 
              ? 'bg-brand-dark shadow-lg' 
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}