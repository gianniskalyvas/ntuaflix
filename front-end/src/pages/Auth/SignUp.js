import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'
import axios from 'axios';
import AuthenticationService from '../../AuthenticationService';
import CryptoJS from 'crypto-js'

// const navigate = useNavigate();

const SignUpPage = () => {

  const [email, setEmail] = useState('');
  const [password_hash, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate(); // Import useNavigate from 'react-router-dom'

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submiting:', { email, username ,password_hash });

    const data =  {
      username: username,
      email: email,
      password_hash: CryptoJS.SHA256(password_hash).toString(CryptoJS.enc.Hex),
      isAdmin: 0
    }



    try {

      const response = await axios.post('https://localhost:9876/ntuaflix_app/admin/userConf/addUser', 
        data ,{
        headers: {
          'Content-Type': 'application/json',
        },
      }); 


      console.log(response)
      console.log(response.data)



    // Check the status code for success
    if (response.data !== "Invalid data") {
      
      // Successful login
      console.log('Sign Up successful');

      // Store the token securely (you might want to use more secure storage options)
      localStorage.setItem('token', response.data);

      // Update the authentication state
      AuthenticationService.isAuthenticated = true;

      navigate('/');     

      // Return true to indicate a successful login
      return true;

    } else {
      // Handle the case where the login request was not successful
      console.log('Sign Up Failed')
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

      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={handleUsernameChange}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  </div>
);

};

export default SignUpPage;
