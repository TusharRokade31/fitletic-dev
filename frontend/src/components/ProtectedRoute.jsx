// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { logout } from '../features/auth/authSlice';


const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = Cookies.get('accessToken');

  // If there's no token or not authenticated in state, force logout and redirect
  if (!isAuthenticated || !token) {
    dispatch(logout()); // Ensures state and cookies are fully cleared
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;