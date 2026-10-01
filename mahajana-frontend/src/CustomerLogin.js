import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "./api";
import "./CustomerLogin.css";

function CustomerLogin({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= LOGIN ================= */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* ================= REGISTER ================= */
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ================= LOGIN ================= */
 const handleLogin = async () => {
  console.log("LOGIN CLICKED");

  try {
    const data = await api.loginCustomer({
      email: loginEmail,
      password: loginPassword,
    });

    console.log(" FULL RESPONSE:", data);

    if (!data || !data.user) {
      alert("Invalid login response or wrong credentials");
      return;
    }

    localStorage.setItem("customer", JSON.stringify(data.user));

    onLogin(data.user);

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    alert(err.message);
  }
};

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    console.log("REGISTER CLICKED");

    if (!fullName || !registerEmail || !phone || !location || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.registerCustomer({
        customer_name: fullName,
        email: registerEmail,
        phone,
        address: location,
        password,
      });

      alert("Account created successfully!");

      setIsLogin(true);

      // reset fields
      setFullName("");
      setRegisterEmail("");
      setPhone("");
      setLocation("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="customer-auth-page">
      <div className="customer-header">
        <h1> Customer Portal</h1>
        <p>Welcome to Mahajana Grinding Mill</p>
      </div>

      <div className="customer-card">
        <h2>{isLogin ? "Customer Login" : "Create Account"}</h2>

        {/* ================= REGISTER ================= */}
        {!isLogin && (
          <>
            <input
              placeholder=" Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              placeholder=" Email Address"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <input
              placeholder=" Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              placeholder=" Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder=" Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        {/* ================= LOGIN ================= */}
        {isLogin && (
          <>
            <input
              type="email"
              placeholder=" Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </>
        )}

        {/* ================= BUTTON ================= */}
       <button
  type="button"
  className="login-btn"
  onClick={isLogin ? handleLogin : handleRegister}
>
  {isLogin ? "Login" : "Create Account"}
</button>

        {/* ================= TOGGLE ================= */}
        <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create New Account" : "Already have an account? Login"}
        </p>

        <p className="back" onClick={onBack}>
          ⬅ Back to Selection
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;