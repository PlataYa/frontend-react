import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';

export default function AppRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container">
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        <Route path="/*" element={<MainRoutes />} />
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      )}
    </Routes>
  );
} 