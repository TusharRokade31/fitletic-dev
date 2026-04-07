import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp, setTempPhone } from '../features/auth/authSlice';
import SocialButtons from '../components/SocialButtons';
import { Mail } from 'lucide-react';
import logo from '../assets/logo.png'; // Ensure you have this image

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleContinue = async () => {
    if (phone.length < 10) return;
    dispatch(setTempPhone(phone));
    const resultAction = await dispatch(sendOtp({ phone, countryCode: '+91' }));
    if (sendOtp.fulfilled.match(resultAction)) {
      navigate('/verify-otp');
    }
  };

  return (
    <div className="min-h-screen bg-brand-green flex flex-col font-sans">
      {/* Header Area */}
      <div className="pt-12 pb-6 px-6 flex justify-between text-white text-sm">
        <button className="opacity-80">Corporate User?</button>
        <button onClick={() => setIsLogin(!isLogin)} className="">
          {isLogin ? 'New User?' : 'Already a User?'}
        </button>
      </div>
      <div className="flex justify-center pb-8">
        <img src={logo} alt="Fetletic Factory" className="h-24" />
      </div>

      {/* Bottom Sheet */}
      <div className="bg-[#F8F9FA] flex-1 rounded-t-[2rem] p-6 flex flex-col">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Welcome Back, Log in to Continue' : "Let's Create Your Account"}
        </h2>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center font-medium text-gray-700 shadow-sm">
            +91 <span className="ml-2 text-xs">▼</span>
          </div>
          <input
            type="tel"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green shadow-sm"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="flex items-center gap-2 mb-6">
          <input type="checkbox" className="rounded text-brand-green w-4 h-4" defaultChecked />
          <span className="text-sm text-gray-500">Receive updates and reminders on Whatsapp</span>
        </label>

        <button
          onClick={handleContinue}
          disabled={phone.length < 10 || loading}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-colors ${
            phone.length >= 10 ? 'bg-brand-green' : 'bg-gray-300 text-gray-500'
          }`}
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>

        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          // If they are logging in, go to email-auth. If creating account, go to name-step.
          onClick={() => navigate(isLogin ? '/email-auth' : '/name-step')}
          className="w-full py-3.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 flex justify-center items-center gap-2 shadow-sm"
        >
          <Mail className="w-5 h-5" /> Email
        </button>
        
        <SocialButtons />

        <div className="mt-auto pt-8 text-center">
          <p className="text-xs text-gray-400 mb-4">
            By signing up, I agree to the Terms of Service and<br/>Privacy Policy, including usage of Cookies
          </p>
          <p className="text-xs text-gray-400">
            Need help? connect@fetleticfactory.com
          </p>
        </div>
      </div>
    </div>
  );
}