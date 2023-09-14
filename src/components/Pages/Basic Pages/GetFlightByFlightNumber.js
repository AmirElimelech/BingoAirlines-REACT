import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenericTable from '../../Common/GenericTable';
import '../../Common/GenericTable.css'

const fieldMappingsArray = [
    { label: "Flight Number", key: "flight_number" },
    { label: "Airline Company", key: "airline_company.name" },
    { label: "Origin Airport", key: "origin_airport.name" },
    { label: "Destination Airport", key: "destination_airport.name" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Remaining Tickets", key: "remaining_tickets" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" }
];

function GetFlightByFlightNumber() {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    // const baseEndpoint = "http://127.0.0.1:8000/Api/flights/";
    const baseEndpoint = "https://bingoairlines.com/Api/flights/";

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
                    placeholder="Enter Flight Number e.g. 'LY556'"
                    className={isError ? 'error-input' : ''}
                />
            </div>
        </div>
    );
}

export default GetFlightByFlightNumber;
