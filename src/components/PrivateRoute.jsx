import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to access denied if not an admin
  if (user && !user.isAdmin) {
    return <div className="text-red-500">Access Denied</div>;
  }

  return children;
};

export default PrivateRoute;
