

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Common/GenericTable.css';
import { useNavigate } from 'react-router-dom';



function getValueByPath(obj, path) {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return value || value === 0 ? value : "-";
}

const bookingFields = [
    
    { label: "Booking Date", key: "booking_date" },
    { label: "Total Price", key: "total_price" },
    { label: "Currency", key: "currency" },
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport IATA", key: "origin_airport.iata_code" },
    { label: "Origin Airport Country", key: "origin_airport.country_code" },
    { label: "Destination Airport IATA", key: "destination_airport.iata_code" },
    { label: "Destination Airport Country", key: "destination_airport.country_code" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" },
    { label: "Airline Name", key: "airline.name" },
    { label: "Airline IATA Code", key: "airline.iata_code" },
    { label: "Cabin", key: "cabin" },
    { label: "Adult Travelers", key: "adult_traveler_count" },
    { label: "Child Travelers", key: "child_traveler_count" }
];

function BookingTable({ axiosInstance }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const axiosToUse = axiosInstance || axios;
        // axiosToUse.get("http://127.0.0.1:8000/Api/customer/bookings/")
        axiosToUse.get("https://bingoairlines.com/Api/customer/bookings/")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else if (response.data.results && Array.isArray(response.data.results)) {
                    setData(response.data.results);
                } else {
                    console.error("Unexpected data format from API:", response.data);
                    setData([]);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setData([]);
            });
    }, [axiosInstance]);



    const navigate = useNavigate();


    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {bookingFields.map((field, index) => (
                                <th key={index}>{field.label}</th>
                            ))}
                        </tr>
                    </thead>
                        <tbody>
                            {data.map((item, rowIndex) => {
                                console.log("Item:", item);  // Add this line

                                return (
                                    <tr 
                                        key={rowIndex} 
                                        onClick={() => {
                                            console.log("Row clicked!", item.id);
                                            navigate(`/booking/${item.id}`);
                                        }}
                                    >
                                        {bookingFields.map((field, colIndex) => (
                                            <td key={colIndex}>{getValueByPath(item, field.key)}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingTable;

