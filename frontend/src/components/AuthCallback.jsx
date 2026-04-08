import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSocialCredentials } from '../features/auth/authSlice';


export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Extract tokens from the URL
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const provider = searchParams.get('provider');

    if (accessToken) {
      // 1. Update Redux and Cookies
      dispatch(setSocialCredentials({ accessToken }));
      
      // Note: If your app uses refresh tokens on the frontend, save it here too.
      // localStorage.setItem('refreshToken', refreshToken);

      // 2. Redirect the user to the protected area of your app
      // Using replace: true prevents them from hitting the 'back' button to this callback route
      navigate('/', { replace: true }); 
    } else {
      // Handle the case where the callback fails
      navigate('/login?error=social_auth_failed', { replace: true });
    }
  }, [dispatch, navigate, searchParams]);

  // Render a simple loading screen while processing the URL
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <p className="text-gray-500 text-lg">Completing secure login...</p>
    </div>
  );
}