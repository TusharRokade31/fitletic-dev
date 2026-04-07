import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../features/auth/authSlice';
import { ArrowLeft, Mail } from 'lucide-react';
import SocialButtons from '../components/SocialButtons';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(22);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempPhone, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!tempPhone) navigate('/'); // Prevent direct access without phone
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [tempPhone, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) return;
    
    const resultAction = await dispatch(verifyOtp({ phone: tempPhone, countryCode: '+91', otp: otpCode }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      navigate('/dashboard'); // Replace with your actual home route
    }
  };

  return (
    <div className="min-h-screen bg-brand-green flex flex-col font-sans">
       <div className="pt-12 pb-6 px-6 flex justify-between text-white text-sm">
        <button className="">Corporate User?</button>
        <button className="">Already a User?</button>
      </div>
      <div className="flex justify-center pb-8">
        <img src="/src/assets/logo.png" alt="Fetletic" className="h-24" />
      </div>

      <div className="bg-[#F8F9FA] flex-1 rounded-t-[2rem] p-6 flex flex-col">
        <div className="flex items-center justify-center relative mb-8">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Enter the OTP received on</p>
            <p className="font-bold text-gray-900">+91 {tempPhone}</p>
          </div>
        </div>

        <div className="flex justify-between gap-4 mb-6 px-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 bg-white border border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-800 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={otp.join('').length < 4 || loading}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-colors mb-4 ${
            otp.join('').length === 4 ? 'bg-brand-green' : 'bg-gray-300 text-gray-500'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <p className="text-center text-gray-500 text-sm mb-8">
          Waiting for OTP - <span className="font-semibold">{timer} Sec</span>
        </p>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full py-3.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 flex justify-center items-center gap-2 shadow-sm mb-4">
          <Mail className="w-5 h-5" /> Email
        </button>

        <SocialButtons />
      </div>
    </div>
  );
}