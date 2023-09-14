import React, { useState } from 'react';
import axios from 'axios';
import GenericTable from '../../Common/GenericTable';
import '../../Common/GenericTable.css'

const fieldMappingsArray = [
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport", key: "origin_airport__iata_code" },
    { label: "Destination Airport", key: "destination_airport__iata_code" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" },
    { label: "Remaining Tickets", key: "remaining_tickets" }
    
];

function GetFlightByParams() {
    const [originAirport, setOriginAirport] = useState('');
    const [destinationAirport, setDestinationAirport] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [data, setData] = useState([]);
    // const endpoint = "http://127.0.0.1:8000/Api/flights/search/";
    const endpoint = "https://bingoairlines.com/Api/flights/search/";

    const handleSearch = () => {

        setData([]); // Clear the table on every search i make

        const payload = {
            origin_airport: originAirport,
            destination_airport: destinationAirport,
            departure_date: departureDate
        };


        axios.post(endpoint, payload)
        .then(response => {
            // If the response directly contains an array of flights
            if (Array.isArray(response.data)) {
                setData(response.data);
            }
            // If the response contains a message and data property
            else if (response.data && Array.isArray(response.data.data)) {
                if (response.data.data.length === 0) {
                    window.alert(response.data.message || "No flights found for the given parameters.");
                } else {
                    setData(response.data.data);
                }
            } else {
                console.error("Unexpected response structure:", response.data);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    };

    return (
        <div className="search-wrapper">
            <GenericTable data={data} fields={fieldMappingsArray} />
            <div className="search-bar">
                <input 
                    type="text" 
                    value={originAirport} 
                    onChange={e => setOriginAirport(e.target.value)} 
                    placeholder="Enter Origin Airport e.g. 'JFK'"
                />
                <input 
                    type="text" 
                    value={destinationAirport} 
                    onChange={e => setDestinationAirport(e.target.value)} 
                    placeholder="Enter Destination Airport e.g. 'MAD'"
                />
                <input 
                    type="date" 
                    value={departureDate} 
                    onChange={e => setDepartureDate(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
}

export default GetFlightByParams;
