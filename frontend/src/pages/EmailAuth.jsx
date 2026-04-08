import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail } from '../features/auth/authSlice';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

export default function EmailAuth() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId]       = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  console.log(error)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      registerWithEmail({ email, password, employeeId: empId || undefined })
    );

    if (registerWithEmail.fulfilled.match(resultAction)) {
      // Registration succeeded + tokens saved in Redux → go collect the user's name
      navigate('/name-step');
    }
  };

  return (
    <div className="min-h-screen bg-brand-green flex flex-col font-sans">

      {/* Top bar */}
      <div className="pt-12 pb-6 px-6 flex justify-between text-white text-sm">
        
      </div>

      {/* Logo */}
      <div className="flex justify-center pb-8">
        <img src={logo} alt="Fetletic" className="h-24" />
      </div>

      {/* Card */}
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
            placeholder="Create a Password (min 8 chars)"
            minLength={8}
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
            disabled={loading || !email || password.length < 8}
            className="w-full py-3.5 mt-2 bg-brand-green rounded-xl font-semibold text-white shadow-md disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-auto mb-4">
          By signing up, I agree to the Terms of Service and<br />
          Privacy Policy, including usage of Cookies
        </p>

        </form>

        <p className="text-center text-xs text-gray-400 mt-auto mb-4">
         Need help? connect@fetleticfactory.com
        </p>
       

      </div>
    </div>
  );
}