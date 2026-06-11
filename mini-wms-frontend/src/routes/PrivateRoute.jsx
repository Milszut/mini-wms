import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from "../components/LoadingSpinner";

export default function PrivateRoute({ redirectTo = '/login' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <LoadingSpinner />
      </div>
    );
  } 

  return user ? <Outlet /> : <Navigate to={redirectTo} replace/>;
}