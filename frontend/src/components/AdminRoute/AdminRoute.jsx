import { Navigate } from 'react-router-dom';
import authService from '../../api/authService';

export default function AdminRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    if (!user?.is_staff) {
        return <Navigate to="/feed" replace />;
    }

    return children;
}
