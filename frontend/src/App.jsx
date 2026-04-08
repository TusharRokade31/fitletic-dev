import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PhoneAuth       from './pages/PhoneAuth';
import OtpVerification from './pages/OtpVerification';
import EmailAuth       from './pages/EmailAuth';   // Step 1: email + password + empId
import NameScreen      from './pages/NameScreen';  // Step 2: name (final step)

function App() {
  return (
    <Router>
      <Routes>
        {/* Default → phone auth */}
        <Route path="/"           element={<Navigate to="/auth" replace />} />

        {/* Phone OTP flow */}
        <Route path="/auth"       element={<PhoneAuth />} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* Email registration flow:
              /email-auth  →  /name-step  →  /dashboard            */}
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/name-step"  element={<NameScreen />} />

        {/* Dashboard placeholder */}
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen flex items-center justify-center bg-brand-green text-white font-bold text-2xl">
              Welcome! You're in. 🎉
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;