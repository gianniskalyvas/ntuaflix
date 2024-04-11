import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import './SearchTitle.css'
import axios from 'axios';



const SearchTitle = () => {

  const [inputValue, setInputValue] = useState('');
  const [jsonData, setJsonData] = useState(null);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    console.log('Input Value:', inputValue);
    setInputValue(inputValue);
  };

  const getDataName = async (titlePart) => {
    try {
      const endpoint = `https://localhost:9876/ntuaflix_app/searchTitle?titlePart=${encodeURIComponent(titlePart)}`;
      const response = await axios.post(endpoint);
      console.log(response)
      setJsonData(response.data);
    } catch (error) {
      console.error('Error making the request:', error.message);
      setJsonData()
    }
  };

  // Use local storage to persist state
  useEffect(() => {
    // Save to local storage
    localStorage.setItem('searchTitleInput', inputValue);

    // Note: You might need to serialize jsonData before saving it to local storage
    // Check if jsonData is not null before stringifying
    if (jsonData !== null) {
      localStorage.setItem('searchTitleData', JSON.stringify(jsonData));
    }
  }, [inputValue, jsonData]);

  // Retrieve state from local storage on component mount
  useEffect(() => {
    const storedTitleValue = localStorage.getItem('searchTitleInput');
    const storedTitleData = localStorage.getItem('searchTitleData');

    if (storedTitleValue) {
      setInputValue(storedTitleValue);
    }

    if (storedTitleData) {
      //setJsonData(JSON.parse(storedTitleData));

      try {
        setJsonData(JSON.parse(storedTitleData));
        // Your code handling the parsed data
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []); // Empty dependency array means this effect runs once on mount



  return (
    <div id="searchtitle" >
        
        <h1>Search Movie</h1>
        
        <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type the title"
        />

        <button style={{width:'auto'}} onClick={() => getDataName(inputValue)}>Show Movies</button>


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
  );
};

export default SearchTitle;