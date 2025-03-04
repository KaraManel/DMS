import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import "../assets/styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Hardcoded users with roles
    const users = [
        { username: "admin", password: "123", role: "admin" },
        { username: "user", password: "456", role: "user" },
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            dispatch(login(user)); // Store user in Redux
            navigate(user.role === "admin" ? "/users" : "/NormalUser"); // Redirect based on role
        } else {
            setError("Username or password is incorrect");
        }
    };

    return (
        <div className="login-container">
            <h2 className="h2-login">Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="input-container">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="username" className={username ? "filled" : ""}>
                        Username
                    </label>
                </div>

                <div className="input-container">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className={password ? "filled" : ""}>
                        Password
                    </label>
                </div>

                <button type="submit" name="loginButton">Login</button>
            </form>
        </div>
    );
};

export default Login;
