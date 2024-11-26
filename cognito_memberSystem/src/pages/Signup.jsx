import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isSignUpComplete, setIsSignUpComplete] = useState(false); // 회원가입 완료 상태 추가
    const API_URL = "http://localhost:3000/dev";
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const handleConfirmationCodeChange = (e) => setConfirmationCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username,
                email,
                password,
            });

            console.log(response);
            if (response.status === 200) {
                setIsSignUpComplete(true); // 회원가입 성공 시 상태 변경
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response.data.error);
        }
    };

    const handleGoogleSignUp = async () => {
        console.log("Sign up with Google");

        try {
            const response = await axios.get(`${API_URL}/auth/google?mode=signup`, {
                withCredentials: true,
            });

            console.log(response);
            if (response.status === 200) {
                console.log("get url ok");
                if (response.data.requiredUrl) {
                    window.location.href = response.data.requiredUrl;
                }
            }
        } catch (error) {
            console.error("Error during Google login redirect:", error);
            alert("Failed to initiate Google login. Please try again.");
        }
    };

    const handleConfirmationSubmit = async (e) => {
        e.preventDefault();
        // 확인 코드 제출 처리 로직 추가

        try {
            const response = await axios.post(`${API_URL}/confirm`, {
                username,
                confirmationCode,
            });

            console.log(response);
            navigate("/");
        } catch (error) {
            console.error("confirm code error:", error);
            alert(error.response.data.error);
        }
    };

    const handleResnedConfirmCode = async () => {
        try {
            const response = await axios.post(`${API_URL}/resend`, {
                username,
            });

            console.log(response);
            alert(response.data.message);
        } catch (error) {
            console.error("resend confirm code error:", error);
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>

            {!isSignUpComplete ? (
                <form id="signupForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Username" value={username} onChange={handleUsernameChange} required />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            ) : (
                <form id="confirmForm" onSubmit={handleConfirmationSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="confirmationCode"
                            placeholder="Confirmation Code"
                            value={confirmationCode}
                            onChange={handleConfirmationCodeChange}
                            required
                        />
                    </div>
                    <button type="submit">Confirm Sign Up</button>
                    <button onClick={handleResnedConfirmCode}>Resend Confirm Code</button>
                </form>
            )}

            {!isSignUpComplete && (
                <>
                    <div className="or">OR</div>
                    <button id="googleSignUp" className="social-button" onClick={handleGoogleSignUp}>
                        <img src="/img/google-icon.png" alt="Google" width="20" height="20" />
                        Sign up with Google
                    </button>
                    <div className="signup">
                        Already have an account? <a href="./signin.html">Login</a>
                    </div>
                </>
            )}
        </div>
    );
}

export default SignUp;
