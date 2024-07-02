import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // הוסף כאן את הקוד להתחברות
    console.log('Login', { email, password });
    navigate('/main'); // after login go to main page
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="loginContainer">
      <div className="loginForm">
      <img className="logo-imageL" src={require('../assets/logo.png')} />
        <h3>UNLIMITED STRATEGIES</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputsDiv">
          <input 
            type="email" 
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="inputField"
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="inputField"
          />
          </div>
          <div className="forgotPassword">
            <a href="#">forgot password?</a>
          </div>
          <button type="submit" className="signInB">Sign In</button>
        </form>
        <div className="signupRedirect">
          <p>Don't have an account yet?</p>
          <button className="signUpB" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
