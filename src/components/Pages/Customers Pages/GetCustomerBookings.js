

import React, { useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../contexts/UserContext';
import BookingsTable from './BookingsTable';

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

const endpoint = "/Api/customer/bookings/";

const fieldMappings = [
    { label: "Booking Date", key: "booking_date" },
    { label: "Total Price", key: "total_price" },
    { label: "Currency", key: "currency" },
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport", key: "origin_airport.iata_code" },
    { label: "Destination Airport", key: "destination_airport.iata_code" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" },
    { label: "Airline", key: "airline.name" },
    { label: "Cabin", key: "cabin" },
    { label: "Adult Travelers", key: "adult_traveler_count" },
    { label: "Child Travelers", key: "child_traveler_count" },
    
];

function GetCustomerBookings() {
    const { user } = useContext(UserContext);
    if (!user || user.user_role !== 'Customer') {
        return <p>You are not authorized to view this page.</p>;
    }

    return (
        <div>
            <h2>My Bookings</h2>
            <BookingsTable endpoint={endpoint} fields={fieldMappings} axiosInstance={axiosInstance} isRowClickable={true} />
        </div>
    );
}

export default GetCustomerBookings;
