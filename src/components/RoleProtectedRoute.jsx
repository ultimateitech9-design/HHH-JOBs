import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasRole, isAuthenticated } from '../utils/auth';

const RoleProtectedRoute = ({ roles, children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  if (!hasRole(roles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
