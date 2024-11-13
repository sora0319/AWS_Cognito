import { useState } from "react";

function ConfirmSignUp() {
    const [username, setUsername] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleConfirmationCodeChange = (e) => setConfirmationCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Confirm sign-up 처리 로직 추가
            setMessage("Confirmation successful");
            setError("");
        } catch (err) {
            setError("Confirmation failed. Please try again.");
            setMessage("");
            console.error("Confirmation error:", err);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Confirm Sign Up</h2>
                <form id="confirmForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Username" value={username} onChange={handleUsernameChange} required />
                    </div>
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
                </form>
                {message && <div id="message">{message}</div>}
                {error && <div id="error">{error}</div>}
            </div>
        </div>
    );
}

export default ConfirmSignUp;
