import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from "../pages/Auth/SignIn/SignIn.jsx";
import SignUp from "../pages/Auth/SignUp/SignUp.jsx";
import ResetPasswordEmail from "../pages/Auth/ResetPassword/ResetPasswordEmail.jsx";
import ResetPasswordDone from "../pages/Auth/ResetPassword/ResetPasswordDone.jsx";
import ResetPasswordConfirm from "../pages/Auth/ResetPassword/ResetPasswordConfirm.jsx";
import SignUpCode from "../pages/Auth/SignUp/SignUpCode.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Feed from "../pages/Feed/Feed.jsx";
import Notifications from "../pages/Notifications/Notifications.jsx";
import SearchPage from "../pages/SearchPage/SearchPage.jsx";
import Chats from "../pages/Chats/Chats.jsx";
import OrganizationProfile from "../pages/OrganizationProfile/OrganizationProfile.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard.jsx";
import AdminReports from "../pages/Admin/AdminReports/AdminReports.jsx";
import AdminUsers from "../pages/Admin/AdminUsers/AdminUsers.jsx";
import AdminOrganizations from "../pages/Admin/AdminOrganizations/AdminOrganizations.jsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";
import AdminRoute from "../components/AdminRoute/AdminRoute.jsx";
export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-up/code" element={<SignUpCode />} />
                <Route path="/password/reset" element={<ResetPasswordEmail />} />
                <Route path="/password/reset/done" element={<ResetPasswordDone />} />
                <Route path="/password/reset/:uid/:token" element={<ResetPasswordConfirm />} />

                <Route path="/feed" element={
                    <ProtectedRoute>
                        <Feed />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/profile/:userId" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/organization/:orgId" element={
                    <ProtectedRoute>
                        <OrganizationProfile />
                    </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                } />
                <Route path="/search" element={
                    <ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>
                } />
                <Route path="/chats" element={
                    <ProtectedRoute>
                        <Chats />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />
                <Route path="/admin/reports" element={
                    <AdminRoute>
                        <AdminReports />
                    </AdminRoute>
                } />
                <Route path="/admin/users" element={
                    <AdminRoute>
                        <AdminUsers />
                    </AdminRoute>
                } />
                <Route path="/admin/organizations" element={
                    <AdminRoute>
                        <AdminOrganizations />
                    </AdminRoute>
                } />

                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
        </>
    );
}
