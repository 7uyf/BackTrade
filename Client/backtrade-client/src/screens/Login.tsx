import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const loginUrl = "http://127.0.0.1:8000/auth/login";

const Login: React.FC = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resp = await fetch(loginUrl, {
      // sent to server the info of the user
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await resp.json();
    console.log(data);
    if (data.access_token) navigate("/main"); // after login go to main page
    else alert(data.detail);
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="loginContainer">
      <div className="loginForm">
        <img className="logo-imageL" src={require("../assets/logo.png")} />
        <h3>UNLIMITED STRATEGIES</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputsDiv">
            <input
              type="email"
              placeholder="Email"
              // value={email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              // onChange={(e) => setEmail(e.target.value)}
              required
              className="inputField"
            />
            <input
              type="password"
              placeholder="Password"
              // value={password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="inputField"
            />
          </div>
          <div className="forgotPassword">
            <a href="#">forgot password?</a>
          </div>
          <button type="submit" className="signInB">
            Sign In
          </button>
        </form>
        <div className="signupRedirect">
          <p>Don't have an account yet?</p>
          <button className="signUpB" onClick={handleSignUpClick}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
