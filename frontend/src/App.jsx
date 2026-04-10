// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PhoneAuth       from './pages/PhoneAuth';
import OtpVerification from './pages/OtpVerification';
import EmailAuth       from './pages/EmailAuth';   
import NameScreen      from './pages/NameScreen';  
import SplashScreen    from './components/SplashScreen';
import AuthCallback    from './components/AuthCallback';
import OnboardingStep1 from './pages/OnboardingStep1'; 
import OnboardingStep2 from './pages/OnboardingStep2'; 
import OnboardingStep3 from './pages/OnboardingStep3'; 
import OnboardingStep4 from './pages/OnboardingStep4'; 

// Import the ProtectedRoute wrapper
import ProtectedRoute  from './components/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/"           element={<Navigate to="/auth" replace />} />
        <Route path="/auth"       element={<PhoneAuth />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/name-step"  element={<ProtectedRoute><NameScreen /></ProtectedRoute>} />
        <Route path="/onboarding/1" element={<ProtectedRoute><OnboardingStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/2" element={<ProtectedRoute><OnboardingStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/3" element={<ProtectedRoute><OnboardingStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/4" element={<ProtectedRoute><OnboardingStep4 /></ProtectedRoute>} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center bg-brand-green text-white font-bold text-2xl">
                Welcome! You're in. 🎉
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;