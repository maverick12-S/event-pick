import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OperatorRoute: React.FC = () => {
  const { isAuthenticated, isInitialized, isOperator } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0d1b2a',
          color: '#fff',
        }}
      >
        読み込み中...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isOperator) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default OperatorRoute;
