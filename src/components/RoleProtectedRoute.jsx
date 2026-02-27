import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasRole, isAuthenticated } from '../utils/auth';

// Temporary local bypass: allows direct access to student portal without login.
const BYPASS_STUDENT_AUTH = true;

const RoleProtectedRoute = ({ roles, children }) => {
  const location = useLocation();
  const isStudentPortalRoute = location.pathname.startsWith('/portal/student');
  const routeAllowsStudent = Array.isArray(roles) && roles.includes('student');

  if (BYPASS_STUDENT_AUTH && isStudentPortalRoute && routeAllowsStudent) {
    return children;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasRole(roles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
