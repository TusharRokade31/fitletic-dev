import React from 'react';

export default function SocialButtons() {
  const handleSocialLogin = (provider) => {
    // Redirects to your backend passport routes
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="flex justify-between gap-4 mt-4">
      <button onClick={() => handleSocialLogin('apple')} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl flex justify-center items-center shadow-sm">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-5" />
      </button>
      <button onClick={() => handleSocialLogin('google')} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl flex justify-center items-center shadow-sm">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5" />
      </button>
      <button onClick={() => handleSocialLogin('facebook')} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl flex justify-center items-center shadow-sm">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="h-5" />
      </button>
    </div>
  );
}