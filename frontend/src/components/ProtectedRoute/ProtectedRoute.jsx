import { Navigate } from 'react-router-dom';
import authService from '../../api/authService';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
}
