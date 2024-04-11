import React, { useState, useEffect } from 'react';
import './Name.css'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';



const Name = () => {


    const { nameID } = useParams();
    console.log(nameID);
    
    const [jsonData, setActorData] = useState(null);
    const [originalTitles, setOriginalTitles] = useState({});

    useEffect(() => {
        const fetchData = async () => {
        try {
            const endpoint = `https://localhost:9876/ntuaflix_app/name/${nameID}`;
            console.log(endpoint)

            const response = await axios.get(endpoint);
            console.log(response.data)
            setActorData(response.data);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    };  
        fetchData();
    }, [nameID]); // Dependency on movieId, so it refetches when the ID changes


    useEffect(() => {
        const fetchTitles = async () => {
            if (!jsonData) return;

            const titles = {};
            await Promise.all(jsonData.nameTitles.map(async (title) => {
                try {
                    const response = await axios.get(`https://localhost:9876/ntuaflix_app/title/${title.titleID}`);
                    titles[title.titleID] = response.data.originalTitle;
                } catch (error) {
                    console.error('Error fetching title data:', error);
                    titles[title.titleID] = '';
                }
            }));
            setOriginalTitles(titles);
        };
        fetchTitles();
    }, [jsonData]);

    return (          
    
        <div>
            {jsonData ? (
                <div className="actorDetails">

                    <div>
                    <img 
                        src={jsonData.namePoster ? jsonData.namePoster.replace("{width_variable}", "original") : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'}
                        alt="No Poster Available"
                    />

                    </div>
                    <div>

                    <h1>{jsonData.name}</h1>
                    <h4>Name ID: {jsonData.nameID}</h4>

                    { jsonData.birthYr && ( <h4>Birth Year: {jsonData.birthYr}</h4> )}
                    { jsonData.deathYr && ( <h4>Death Year: {jsonData.deathYr}</h4> )}

                    {jsonData.profession && (
                        <div>
                            <h4 style={{marginBottom:0}}>Professions:</h4>
                            <ul style={{marginTop:0}}>
                            {jsonData.profession.map((prof, index) => (
                                <li key={index}>{prof.replace(/_/g, ' ')}</li>
                            ))}
                            </ul>
                        </div>
                    )}

                    {jsonData.nameTitles && (
                        <div>
                            <h4 style={{marginBottom:0}}>Known for:</h4>
                            <ul style={{ marginTop: 0 }}>
                                {jsonData.nameTitles.map((title, index) => (
                                    <li id='actortitles' key={index}>
                                        <Link to={`/movie/${title.titleID}`}>
                                            {originalTitles[title.titleID] || 'Loading...'}, {title.category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    </div>

                </div>
            ) : (
            <p>Loading...</p>
            )}


        </div>
  );
};


export default Name;