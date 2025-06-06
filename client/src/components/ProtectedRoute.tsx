import React, { JSX, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in → redirect to login
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;

interface AdminRouteProps {
    children: JSX.Element;
    }

    export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }
    return children;
};
  