import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import { jwtDecode } from "jwt-decode";

const Movie = () => {

  const [userLiked, setUserLiked] = useState(null);
  const [user_id, setUserId] = useState(null);
  const { movieID } = useParams();
  const [jsonData, setMovieData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const endpoint = `https://localhost:9876/ntuaflix_app/title/${movieID}`;

      const response = await axios.get(endpoint);
      console.log(response.data);
      setMovieData(response.data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };  
    fetchData();
  }, [movieID]); // Dependency on movieId, so it refetches when the ID changes


  useEffect(() => {
    
    const fetchUserLikedStatus = async () => {

      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.user_id;
      setUserId(user_id);

      try {
        const endpoint = `https://localhost:9876/ntuaflix_app/userLikes/userlikesmovie/${user_id}/${movieID}`;
        console.log(endpoint)
        const response = await axios.get(endpoint);
        console.log(response)
        if (response.data == 1) {
          setUserLiked(true)
        }
        else {
          setUserLiked(false)
        }
      } catch (error) {
        console.error('Error checking user likes:', error);
        return false;
      }
    };

    if (!!localStorage.getItem('token')) {
      fetchUserLikedStatus();
    }
  }, [userLiked]); 

  const handleLikeClick = async () => {

    console.log("Click")

    try {
      const data = {
        title_id: movieID,
        user_id: user_id
      }; 
      console.log(data)
      if (userLiked) {
        console.log("movie is already liked")
        // If the movie is already liked, perform unlike action
        const endpoint = `https://localhost:9876/ntuaflix_app/userLikes/userunliked`;

        console.log("Before Deleting Like");
        const response = await axios.post(endpoint, data);
        console.log("After Deleting Like");

        console.log(response.data)
        console.log(response)
        setUserLiked(false);
      } else {
        // If the movie is not liked, perform like action
        console.log("movie is not liked")
        const endpoint = `https://localhost:9876/ntuaflix_app/userlikes/userliked`;

        console.log("Before Adding Like");
        const response =  await axios.post(endpoint,data);
        console.log("After Adding Like")

        console.log(response.data);
        console.log(response)

        setUserLiked(true);
      }
    } catch (error) {
      console.error('Error handling like click:', error);
    }
  };

  return (          
    
    <div>
      {jsonData ? (
        <div id="movie">
          <div></div>
          <div style={{marginRight:'40px'}}>
            <h1>{jsonData.originalTitle}</h1>

            <h4>TitleID: {jsonData.titleID}</h4>
            <h4>Type: {jsonData.type}</h4>
            {jsonData.startYear && (
            <h4>Start Year: {jsonData.startYear}</h4>
            )}
            {jsonData.endYear && (
            <h4>End Year: {jsonData.endYear}</h4>
            )}
            {jsonData.genres && (
              <div>
                <h4 style={{marginBottom:0}}>Genres:</h4>
                <ul>
                  {jsonData.genres.map((genre, index) => (
                    <li key={index}>{genre.genreTitle}</li>
                  ))}
                </ul>
              </div>
            )}

            {jsonData.titleAkas && (
              <div>
                <h4 style={{marginBottom:0}}>Title AKAs:</h4>
                <ul>
                  {jsonData.titleAkas.map((aka, index) => (
                    <li key={index}>
                      {aka.akaTitle} 
                      {aka.regionAbbrev && <span> - {aka.regionAbbrev}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div style={{marginRight:'40px'}}>
            <img 
              src={jsonData.titlePoster ? jsonData.titlePoster.replace("{width_variable}", "original") : 'https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie.jpg'}
                alt="No Poster Available"
            />
            {user_id && (
              <div>
                <button id='like' onClick={handleLikeClick}>
                    {userLiked ? 'Liked' : 'Like'}
                </button>
              </div>
            )}


          </div>
          
          

          <div>
          

            {jsonData.principals && (
              <div>
                <h4 style={{margin:0}}>Principals:</h4>
                <ul>
                  {jsonData.principals.map((principal, index) => (
                    <Link to={`/name/${principal.nameID}`}>
                      <li id='principals' key={index}>
                        {principal.name} ({principal.category.replace(/_/g, ' ')})
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}

            {jsonData.rating && (
              <div>
                <h4 style={{marginBottom:0}} >Rating:</h4>
                <ul>
                    <li>
                      <div style={{alignItems:'center'}}>
                        Average Rating: {jsonData.rating.avRating}
                        <img style={{width:'19px', height:'19px', marginLeft:'2px'}} src='/star.png'></img>
                      </div>
                    </li>
                    <li>Number of Votes: {jsonData.rating.nVotes}</li>
                </ul>
              </div>
            )}


            

          </div> 
          <div></div>
        </div>

        ) : (
          <p>Loading...</p>
      )}
    </div>
  );
};



export default Movie;
