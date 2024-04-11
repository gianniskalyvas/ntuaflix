import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (remove token from local storage, update state, etc.)
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/');
  };
  
  const isUserAuthenticated = () => {
    // Check if there is a JWT token in local storage
    return !!localStorage.getItem('token');
  };



  return (
    <div id="navbar">

      {isUserAuthenticated() ? (
          <button id="search" onClick={handleLogout} >Log Out</button> 
        ) : (
          <div id="sign">
            <button onClick={() => navigate('/')} >Sign In</button> 
            <button onClick={() => navigate('/signUp')}>Sign Up</button>
          </div>
      )}



      <Link to="/home">
      <div id="logo">Ntuaflix</div>
      </Link>

      <Popup
        trigger={<button id="search">Search</button>}
        position="bottom"
        arrow={false}
        closeOnDocumentClick
      >

        <div id="popup-2" className='popup-content' >
          <ul>
            <li>
              <Link to="/searchTitle">
              <button id="option">Movies</button>
              </Link>
            </li>
            <li>
              <Link to="/bygenre">
              <button id="option">Movies by Genre</button>
              </Link>
            </li>
            <li>
              <Link to="/actorName">
              <button id="option">Actors</button>
              </Link>
            </li>
            {isUserAuthenticated() && (
              <>
                <li>
                  <Link to="/liked">
                    <button id="option">Liked Movies</button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </Popup>

    </div>
  );
};

export default Navbar;
