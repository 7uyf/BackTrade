import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // הוסף כאן את הקוד להרשמה
    console.log('Signup', { firstName, lastName, email, password, confirmPassword });
    navigate('/main'); // after signup go to main page
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="signupContainer">
      <div className="signupForm">
        <img className="logo-imageS" src={require('../assets/logo.png')} alt="Logo" />
        <h3>UNLIMITED STRATEGIES</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <div className="shortinputContainer">
              <input 
                type="text" 
                placeholder="First Name"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                className="shortinputField"
              />
              <input 
                type="text" 
                placeholder="Last Name"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                className="shortinputField"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="longinputField"
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
          <button type="submit" className="signUpButton">Sign Up</button>
        </form>
        <div className="signInRedirect">
          <p>Already have an account?</p>
          <button className="signInButton" onClick={handleLoginClick}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
