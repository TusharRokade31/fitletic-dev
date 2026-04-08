import React, { useEffect } from 'react';
import logo from '../assets/logo.png'; // Using your existing logo

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Show the splash screen for 2.5 seconds before calling onFinish
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-brand-green flex items-center justify-center transition-opacity duration-500">
      <img 
        src={logo} 
        alt="Loading..." 
        className="w-48 h-auto animate-pulse" 
      />
    </div>
  );
}