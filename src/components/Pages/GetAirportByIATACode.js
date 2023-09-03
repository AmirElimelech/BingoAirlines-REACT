import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenericTable from '../Common/GenericTable';
import '../Common/GenericTable.css'

const fieldMappingsArray = [
    { label: "IATA Code", key: "iata_code" },
    { label: "Airport Name", key: "name" },
    { label: "Country Code", key: "country_code" }
];

function GetAirportByIATACode() {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const baseEndpoint = "http://127.0.0.1:8000/Api/airport/";

    useEffect(() => {

        setIsError(false);

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
                    placeholder="Enter Airport IATA Code e.g. 'TLV'"
                    className={isError ? 'error-input' : ''}
                />
            </div>
        </div>
    );
}

export default GetAirportByIATACode;
