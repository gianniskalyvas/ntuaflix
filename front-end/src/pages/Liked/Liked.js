import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './Liked.css'

const Liked = () => {

    const [jsonData, setJsonData] = useState(null);

    const isUserAuthenticated = () => {
    // Check if there is a JWT token in local storage
        return !!localStorage.getItem('token');
    };

  const getLiked = async () => {
    try {

        const token = localStorage.getItem('token')
        console.log(token)
        const decoded = jwtDecode(token)
        console.log(decoded)
        console.log(decoded.user_id)
        const user_id = decoded.user_id

        const endpoint = `https://localhost:9876/ntuaflix_app/userLikes/getUserLikes/${user_id}`;
        console.log(endpoint)

        console.log("Before fetching Liked Movies")
        const response = await axios.get(endpoint);
        console.log("After fetching Liked Movies")

        console.log(response)
        setJsonData(response.data);

    } catch (error) {
      console.error('Error making the request:', error.message);
      setJsonData()
    }
  };
  useEffect(() => {
    // Call getLiked when the component mounts
    getLiked();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount


    return (

        <div>
            {isUserAuthenticated() ? (
                <div id="liked" >
                    <div>
                        <h1>The Movies that you Like</h1>
                    </div>
                    <section>
                        {jsonData && jsonData.map((item, index) => (
                        <Link to={'/movie/' + item.titleID}>
                            <div className="info" style={{minHeight:"630px"}} key={index}>
                            <img
                                src={item.titlePoster ? item.titlePoster.replace("{width_variable}", "original") : 'https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie.jpg'}
                                alt={item.titlePoster ? 'Movie Poster' : 'No Poster Available'}
                            />
                            <h1>{item.originalTitle}</h1>
                            <h2>{item.type}, {item.rating.avRating} <img style={{width:'21px', height:'21px'}} src='/star.png'></img></h2>
                            <h2>{item.genres.map((genre) => genre.genreTitle).join(', ')}</h2>
                            </div>
                        </Link>
                        ))}
                    </section>
                </div>
            ) : (
                <div id="exception">
                    <p>Please log in</p>
                </div>

        )}
    </div>
  );
};

export default Liked;