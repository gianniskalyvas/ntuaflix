import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {

  const [jsonData, setJsonData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {

      try {


        const endpointGenre = 'https://localhost:9876/ntuaflix_app/byGenre?qgenre=Drama&minrating=8'

        const response = await axios.post(endpointGenre, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
          });
        console.log(response);

        setJsonData(response.data);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div id="home">
      <h1>Some Recommendations</h1>
      <section>
        {jsonData?.map((item, index) => (
          <Link to={'/movie/' + item.titleID}>
            <div className="info" key={index}>
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

export default Home;
