import React, { useState, useEffect } from 'react';
import './ActorName.css'
import axios from 'axios';
import { Link } from 'react-router-dom';


const ActorName = () => {


    const [inputValue, setInputValue] = useState('');
    const [jsonData, setJsonData] = useState(null);


    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        console.log('Input Value:', inputValue);
        setInputValue(inputValue);
    };

    const getData = async (namePart) => {
        try {
            const endpoint = `https://localhost:9876/ntuaflix_app/searchName?namePart=${encodeURIComponent(namePart)}`;
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
        localStorage.setItem('searchActorInput', inputValue);

        // Note: You might need to serialize jsonData before saving it to local storage
        // Check if jsonData is not null before stringifying
        if (jsonData !== null) {
            localStorage.setItem('searchActorData', JSON.stringify(jsonData));
        }
    }, [inputValue, jsonData]);

    // Retrieve state from local storage on component mount
    useEffect(() => {
        const storedActorValue = localStorage.getItem('searchActorInput');
        const storedActorData = localStorage.getItem('searchActorData');

        if (storedActorValue) {
            setInputValue(storedActorValue);
        }

        if (storedActorData) {
            //setJsonData(JSON.parse(storedActorData));

            try {
                setJsonData(JSON.parse(storedActorData));;
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
              
        }
    }, []); // Empty dependency array means this effect runs once on mount


    return (

        <div id="searchname">
            
            <h1>Search Actor</h1>
            
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type the name"
            />

            <button onClick={() => getData(inputValue)}>Show Actors</button>

            <section>
                {jsonData && jsonData.map((item, index) => (
                    <Link to={'/name/' + item.nameID} key={index}>
                        <div className="info" key={index}>
                            <img
                                src={item.namePoster ? item.namePoster.replace("{width_variable}", "original") : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'}
                                alt={item.namePoster ? 'Movie Poster' : 'No Poster Available'}
                            />
                            <h2 >{item.name}</h2>
                        </div>
                        </Link>
                    ))}
            </section>
        </div>
    );
};

export default ActorName;