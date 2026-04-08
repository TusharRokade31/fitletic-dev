import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PhoneAuth       from './pages/PhoneAuth';
import OtpVerification from './pages/OtpVerification';
import EmailAuth       from './pages/EmailAuth';   
import NameScreen      from './pages/NameScreen';  
import SplashScreen    from './components/SplashScreen'; // Import Splash Screen
import AuthCallback from './components/AuthCallback';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // If showSplash is true, render the Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Navigate to="/auth" replace />} />
        <Route path="/auth"       element={<PhoneAuth />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/name-step"  element={<NameScreen />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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