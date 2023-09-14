import React, { useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../contexts/UserContext';
import FlightsTable from './FlightsTable';  // Ensure you have this component created

// Function to get the CSRF token from cookies
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}

// Axios instance configuration
const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'https://bingoairlines.com/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        'csrftoken': getCookie('csrftoken'),
    },
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken"
});

const endpoint = "/Api/airline/flights/";

const fieldMappings = [
    { label: "Airline", key: "airline_company.name" },
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport", key: "origin_airport.name" },
    { label: "Destination Airport", key: "destination_airport.name" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Remaining Tickets", key: "remaining_tickets" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" },
];

function GetAirlineFlights() {
    const { user } = useContext(UserContext);
    
    // Ensure that only users with the role 'Airline Company' can view this page
    if (!user || user.user_role !== 'Airline Company') {
        return <p>You are not authorized to view this page.</p>;
    }

    return (
        <div>
            <h2>My Flights</h2>
            <FlightsTable endpoint={endpoint} fields={fieldMappings} axiosInstance={axiosInstance} isRowClickable={true} />
        </div>
    );
}

export default GetAirlineFlights;