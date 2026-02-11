import { Routes, Route } from 'react-router-dom'
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
import AdminStats from "../pages/Admin/Stats/Stats.jsx";
import AdminComplaints from "../pages/Admin/Complaints/Complaints.jsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";

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

                <Route path="/admin/stats" element={
                    <ProtectedRoute>
                        <AdminStats />
                    </ProtectedRoute>
                } />
                <Route path="/admin/complaints" element={
                    <ProtectedRoute>
                        <AdminComplaints />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}
