import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, clearRegistrationData } from '../features/auth/authSlice';
import { ArrowLeft } from 'lucide-react';

export default function EmailRegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Pull the data we saved in the previous screen
  const { registrationData, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Security check: If they somehow got here without entering a name, send them back
    if (!registrationData.name) {
      navigate('/name-step');
    }
  }, [registrationData.name, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Combine state from Redux with state from this component
    const payload = {
      name: registrationData.name,
      email: email,
      password: password
    };

    const resultAction = await dispatch(registerWithEmail(payload));
    
    if (registerWithEmail.fulfilled.match(resultAction)) {
      // Clear the temporary name state since we are done with it
      dispatch(clearRegistrationData());
      
      // Navigate to a "Please check your email to verify" success screen
      navigate('/verify-email-notice'); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans px-6 pt-12 pb-8">
      
      {/* Progress Bar */}
      <div className="flex justify-center mb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute left-0 -top-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          {/* Step 2 of 2 progress indicator */}
          <div className="w-full h-full bg-brand-dark"></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-sm text-gray-500">
          Nice to meet you, {registrationData.name}! Let's secure your account.
        </p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none focus:border-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a Password (min 8 chars)"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none focus:border-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          minLength={8}
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading || !email || password.length < 8}
          className="w-full py-4 mt-4 bg-brand-dark rounded-xl font-bold text-white shadow-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          {loading ? 'Creating Account...' : 'Finish Registration'}
        </button>
      </form>
    </div>
  );
}