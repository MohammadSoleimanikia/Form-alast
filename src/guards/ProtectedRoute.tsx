import { tokenKey } from '@/config';
import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute() {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}