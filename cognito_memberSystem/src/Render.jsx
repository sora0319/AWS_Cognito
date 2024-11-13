import { Route, Routes } from "react-router-dom";
import App from "./App";
import Signin from "./pages/Signin";
import GoogleSignin from "./pages/GoogleSignin";
import PasswordReset from "./pages/PasswordReset";
import Signout from "./pages/Signout";
import Signup from "./pages/Signup";
import UserInfo from "./pages/UserInfo";
import Withdraw from "./pages/Withdraw";
import ConfirmSignUp from "./pages/ConfirmSignUp";

function Render() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/confirm" element={<ConfirmSignUp />} />
            <Route path="/googlesignin" element={<GoogleSignin />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/userinfo" element={<UserInfo />} />
            <Route path="/withdraw" element={<Withdraw />} />
        </Routes>
    );
}

export default Render;
