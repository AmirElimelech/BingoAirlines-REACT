
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenericTable from '../../Common/GenericTable';
import '../../Common/GenericTable.css'

const fieldMappingsArray = [
    { label: "IATA Code", key: "iata_code" },
    { label: "Airline Name", key: "name" },
    { label: "Country", key: "country.name" },
    { label: "Country Code", key: "country.country_code" }
];



function SearchAirlineById() {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    // const baseEndpoint = "http://127.0.0.1:8000/Api/airlines/";
    const baseEndpoint = "https://bingoairlines.com/Api/airlines/";

    useEffect(() => {

        setIsError(false);

        if (inputValue.length > 2) {
            setIsError(true);
            setData([]);
            return;
        }

        if (inputValue) {
            const endpoint = `${baseEndpoint}${inputValue}/`;
            axios.get(endpoint)
                .then(response => {
                    if (response.data) {
                        setData([response.data]);
                    } else {
                        setIsError(true);
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setIsError(true);
                    setData([]);
                });
        } else {
            setData([]);
        }
    }, [inputValue]);
    

   
    return (
        <div className="search-wrapper">
            <GenericTable data={data} fields={fieldMappingsArray} />
            <div className="search-bar">
            <input 
                type="text" 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)} 
                placeholder="Enter Airline IATA Code e.g. 'AA'"
                className={isError ? 'error-input' : ''}
                maxLength={2}  // This restricts the input to a maximum of 2 characters
            />
            </div>
        </div>
    );
}

export default SearchAirlineById;
