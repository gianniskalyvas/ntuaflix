import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'
import axios from 'axios';
import AuthenticationService from '../../AuthenticationService';
import CryptoJS from 'crypto-js'

// const navigate = useNavigate();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  let [password_hash, setPassword] = useState('');

  const navigate = useNavigate(); // Import useNavigate from 'react-router-dom'

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submiting:', { email, password_hash });

    try {

      password_hash = CryptoJS.SHA256(password_hash).toString(CryptoJS.enc.Hex);

      const response = await axios.post('https://localhost:9876/ntuaflix_app/login', 
        JSON.stringify({ email, password_hash }),{
        headers: {
          'Content-Type': 'application/json',
        },
      }); 


      console.log(response)
      console.log(response.data)



    // Check the status code for success
    if (response.data !== "Invalid data") {
      
      // Successful login
      console.log('Login successful');

      // Store the token securely (you might want to use more secure storage options)
      localStorage.setItem('token', response.data);

      // Update the authentication state
      AuthenticationService.isAuthenticated = true;

      navigate('/home');     

      // Return true to indicate a successful login
      return true;

    } else {
      // Handle the case where the login request was not successful
      console.log('Login Failed')
      return false;
    }


    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

return (
  <div id="authContainer">
    <form id="authForm" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        name="email"
        value={email}
        onChange={handleEmailChange}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password_hash}
        onChange={handlePasswordChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
);

};

export default LoginPage;
