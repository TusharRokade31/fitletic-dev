import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all your screens
import PhoneAuth from './pages/PhoneAuth';
import OtpVerification from './pages/OtpVerification';
import EmailAuth from './pages/EmailAuth';
import NameScreen from './pages/NameScreen';
import EmailRegisterScreen from './pages/EmailRegisterScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* Phone / Base Auth Entry */}
        <Route path="/auth" element={<PhoneAuth />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        
        {/* Email Login Flow */}
        <Route path="/email-auth" element={<EmailAuth />} />
        
        {/* Email Registration Flow (Multi-step) */}
        <Route path="/name-step" element={<NameScreen />} />
        <Route path="/register-email" element={<EmailRegisterScreen />} />
        
        {/* Success / Notice Pages */}
        <Route 
          path="/verify-email-notice" 
          element={<div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#F8F9FA] text-brand-dark font-bold text-xl">Registration complete! Please check your email to verify your account.</div>} 
        />
        <Route 
          path="/dashboard" 
          element={<div className="min-h-screen flex items-center justify-center p-6 text-center bg-brand-green text-white font-bold text-2xl">Welcome to the Dashboard! Successfully Logged In.</div>} 
        />
      </Routes>
    </Router>
  );
}

export default App;