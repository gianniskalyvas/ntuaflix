import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ByGenre.css'

const ByGenre = () => {

  const [jsonData, setJsonData] = useState(null);
  const [qgenre, setQGenre] = useState('');
  const [minrating, setMinRating] = useState('');
  const [yrFrom, setYrFrom] = useState('');
  const [yrTo, setYrTo] = useState('');

  const fetchData = async () => {

    try {

      if (!qgenre || !minrating) {
        console.error('Please provide values for qgenre and minrating');
        return; // Stop further execution if qgenre or minrating is empty
      }

      const dataToSend = {
        qgenre: qgenre,
        minrating: minrating,
        ...(yrFrom !== '' && { yrFrom: yrFrom }), // Include yrFrom only if it's not an empty string
        ...(yrTo !== '' && { yrTo: yrTo }),     // Include yrTo only if it's not an empty string
      };

      console.log(dataToSend)

      const queryString = Object.keys(dataToSend)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(dataToSend[key])}`)
        .join('&');


      const endpointGenre = `https://localhost:9876/ntuaflix_app/byGenre?${queryString}`;

      console.log(endpointGenre)

      const requestInterceptor = axios.interceptors.request.use((request) => {
        console.log('Starting Request', request);
        return request;
      });


      const response = await axios.post(endpointGenre, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      axios.interceptors.request.eject(requestInterceptor);

      console.log(response);

      setJsonData(response.data);

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };



    // Use local storage to persist state
  useEffect(() => {
  // Save to local storage
  localStorage.setItem('qgenre', qgenre);
  localStorage.setItem('minrating', minrating);
  if(yrFrom !== null){
    localStorage.setItem('yrFrom', yrFrom);
  }
  if(yrTo !== null){
    localStorage.setItem('yrTo', yrTo);
  }

  // Note: You might need to serialize jsonData before saving it to local storage
  // Check if jsonData is not null before stringifying
  if (jsonData !== null) {
      localStorage.setItem('searchGenreData', JSON.stringify(jsonData));
  }

  }, [qgenre,minrating,yrFrom,yrTo,jsonData]);

  // Retrieve state from local storage on component mount
  useEffect(() => {

  const storedGenreData = localStorage.getItem('searchGenreData');

  if (storedGenreData) {
      setJsonData(JSON.parse(storedGenreData));
  }
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <div id='bygenre'>
      <div>
      <h1 style={{marginBottom:0}}>Genre and Rating Search</h1>
      <p >Year restrition is not necessary</p>

      <input
        type="text"
        value={qgenre}
        onChange={(e) => setQGenre(e.target.value)}
        placeholder="Genre"
      />

      <input
        type="text"
        value={minrating}
        onChange={(e) => setMinRating(e.target.value)}
        placeholder="Rating Above"
      />

      <input
        type="text"
        value={yrFrom}
        onChange={(e) => setYrFrom(e.target.value)}
        placeholder="From Year"
      />

      <input
        style={{marginRight:0}}
        type="text"
        value={yrTo}
        onChange={(e) => setYrTo(e.target.value)}
        placeholder="To Year"
      />
      </div>

      <button style={{marginTop: '20px'}} onClick={fetchData}>Show Movies</button>

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

export default ByGenre;
