import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../LoadingState';
import type { PropsWithChildren } from 'react';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return <PageLoader />;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
