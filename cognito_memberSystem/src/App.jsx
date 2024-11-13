import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const handleToSignin = () => {
        navigate("/signin");
    };

    const handleToGoogleSignin = () => {
        navigate("/googlesignin");
    };

    const handleToConfirmSignUp = () => {
        navigate("/confirm");
    };

    const handleToSignup = () => {
        navigate("/signup");
    };

    const handleToSignout = () => {
        navigate("/signout");
    };

    const handleToUserInfo = () => {
        navigate("/userinfo");
    };

    const handleToPasswordReset = () => {
        navigate("/passwordreset");
    };

    const handleToWithdraw = () => {
        navigate("/withdraw");
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={handleToSignin}>Signin</button>
                <button onClick={handleToGoogleSignin}>GoogleSignin</button>
                <button onClick={handleToConfirmSignUp}>ConfirmSignUp</button>
                <button onClick={handleToSignup}>Signup</button>
                <button onClick={handleToSignout}>Signout</button>
                <button onClick={handleToUserInfo}>UserInfo</button>
                <button onClick={handleToPasswordReset}>PasswordReset</button>
                <button onClick={handleToWithdraw}>Withdraw</button>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
