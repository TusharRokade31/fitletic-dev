import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateName, clearError } from '../features/auth/authSlice';
import { ArrowLeft } from 'lucide-react';

export default function NameScreen() {
  const [name, setName] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear any existing errors when the user starts typing
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [name, dispatch, error]);

  const handleFinish = async () => {
    if (name.trim().length === 0) return;

    // This calls the exact thunk found in your authSlice.js
    const resultAction = await dispatch(updateName(name.trim()));

    if (updateName.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col px-6 pt-12 pb-8 font-sans">
      {/* Progress bar — step 2 of 2 (full) */}
      <div className="flex justify-center mb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute left-0 -top-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-brand-dark" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Hey there!</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          We're happy you've taken the first step towards a healthier you.
          What should we call you?
        </p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">What is your name?</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none focus:border-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all"
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleFinish}
          disabled={name.trim().length === 0 || loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-colors duration-200 ${
            name.trim().length > 0 && !loading
              ? 'bg-brand-dark shadow-lg'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
}