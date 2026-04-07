import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../features/auth/authSlice';
import { ArrowLeft } from 'lucide-react';

export default function EmailAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginWithEmail({ email, password }));
    if (loginWithEmail.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-brand-green flex flex-col font-sans">
      <div className="pt-12 pb-6 px-6 flex justify-between text-white text-sm">
        <button className="opacity-80">Corporate User?</button>
      </div>
      <div className="flex justify-center pb-8">
        <img src="/src/assets/logo.png" alt="Fetletic" className="h-24" />
      </div>

      <div className="bg-[#F8F9FA] flex-1 rounded-t-[2rem] p-6 flex flex-col">
        <div className="flex items-center justify-center relative mb-8">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Let's Create Your Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-green shadow-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a Password"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-green shadow-sm"
            required
          />
          <input
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            placeholder="Enter your Employee ID (optional)"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-green shadow-sm"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 mt-2 bg-brand-green rounded-xl font-semibold text-white shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
          <button 
          type="button" 
          onClick={() => navigate('/name-step')}
          className="mt-4 text-sm text-brand-dark font-semibold text-center"
        >
          Don't have an account? Sign up here
        </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-auto mb-4">
          By signing up, I agree to the Terms of Service and<br/>Privacy Policy, including usage of Cookies
        </p>
        <p className="text-center text-xs text-gray-400">
          Need help? connect@fetleticfactory.com
        </p>
      </div>
    </div>
  );
}