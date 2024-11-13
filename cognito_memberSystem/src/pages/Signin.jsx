import { useState } from "react";

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        // 로그인 처리 로직 추가
        console.log("Username:", username);
        console.log("Password:", password);
    };

    return (
        <div>
            <h2>Log In</h2>
            <form id="loginForm" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" id="username" placeholder="Username" value={username} onChange={handleUsernameChange} required />
                </div>
                <div className="input-group">
                    <input type="password" id="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
                </div>
                <div className="forgot-password">
                    <a href="./reset.html">Forgot your password?</a>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Signin;
