import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const API_URL = "http://localhost:3000/dev";
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 회원가입 처리 로직 추가
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);

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
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    const handleGoogleSignUp = () => {
        // 구글 회원가입 처리 로직 추가
        console.log("Sign up with Google");
    };

    return (
        <div className="container">
            <div className="signup">
                Already have an account? <a href="./signin.html">Login</a>
            </div>
            <h2>Sign Up</h2>
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
            <div className="or">OR</div>
            <button id="googleSignUp" className="social-button" onClick={handleGoogleSignUp}>
                <img src="/img/google-icon.png" alt="Google" width="20" height="20" />
                Sign up with Google
            </button>
        </div>
    );
}

export default SignUp;
