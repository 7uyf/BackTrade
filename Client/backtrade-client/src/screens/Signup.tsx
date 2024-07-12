import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const signupUrl = "http://127.0.0.1:8000/auth/signup";

const Signup: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (confirmPassword === user.password) {
  //     const resp = await fetch(signupUrl, {
  //       // sent to server the info of the user
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(user),
  //     });
  //     navigate("/main");
  //   } else alert("Diffrent password, please try again");
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user.password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      const resp = await fetch(signupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user), // שליחת פרטי המשתמש כ-JSON לשרת
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log('Signup successful', data);
        navigate('/main'); // מעבר לעמוד הראשי לאחר התחברות מוצלחת
      } else {
        const errorData = await resp.json();
        alert(errorData.detail || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="signupContainer">
      <div className="signupForm">
        <img
          className="logo-imageS"
          src={require("../assets/logo.png")}
          alt="Logo"
        />
        <h3>UNLIMITED STRATEGIES</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <div className="shortinputContainer">
              <input
                type="text"
                placeholder="First Name"
                value={user.first_name} 
                onChange={(e) =>
                  setUser({ ...user, first_name: e.target.value })
                }
                required
                className="shortinputField"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.last_name}
                onChange={(e) =>
                  setUser({ ...user, last_name: e.target.value })
                }
                required
                className="shortinputField"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="longinputField"
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password} 
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="longinputField"
            />
            <input
              type="password"
              placeholder="Verify Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="longinputField"
            />
          </div>
          <button type="submit" className="signUpButton">
            Sign Up
          </button>
        </form>
        <div className="signInRedirect">
          <p>Already have an account?</p>
          <button className="signInButton" onClick={handleLoginClick}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
