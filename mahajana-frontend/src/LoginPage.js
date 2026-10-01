import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";


function LoginPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      alert("Invalid Username or Password");
    }
  };
  

  return (
    <div className="auth-page">

      {/* HEADER */}
      <div className="auth-header">
        <h1>Mahajana Grinding Mill</h1>
<p>Seller Portal</p>
      </div>

      {/* CENTER */}
      <div className="auth-center">

        <div className="auth-card">

          <h2>{isLogin ? "Login" : "Create Account"}</h2>

          {/* CREATE ACCOUNT FIELDS */}
          {!isLogin && (
            <input type="text" placeholder="Full Name" />
          )}

          {!isLogin && (
            <input type="text" placeholder="Location" />
          )}

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* PASSWORD WITH EYE */}
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            className="btn-primary"
            onClick={isLogin ? handleLogin : () => alert("Account Created")}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          {/* TOGGLE */}
          <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Create one"
              : "Already have an account? Login"}
          </p>

          {/* LINKS */}
          <p className="forgot">Forgot Password?</p>

          <p className="home" onClick={onBack}>
            ⬅ Back to Selection
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;