import {Routes, Route} from 'react-router-dom'
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

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-up/code" element={<SignUpCode />} />
                <Route path="/password/reset" element={<ResetPasswordEmail />} />
                <Route path="/password/reset/done" element={<ResetPasswordDone />} />
                <Route path="/password/reset/confirm" element={<ResetPasswordConfirm />} />

                <Route path="/feed" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/chats" element={<Chats />} />
            </Routes>
        </>
    );
}
