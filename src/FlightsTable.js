import React, { useState, useEffect } from 'react';
import '../src/components/Common/GenericTable.css';
import { useNavigate } from 'react-router-dom';

function getValueByPath(obj, path) {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return value || value === 0 ? value : "-";
}

const flightFields = [
    { label: "Airline", key: "airline_company.name" },
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport", key: "origin_airport.name" },
    { label: "Destination Airport", key: "destination_airport.name" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Remaining Tickets", key: "remaining_tickets" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" }
];

function FlightsTable({ axiosInstance }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const axiosToUse = axiosInstance;
        axiosToUse.get("http://127.0.0.1:8000/Api/airline/flights2/")
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
                            {flightFields.map((field, index) => (
                                <th key={index}>{field.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                onClick={() => {
                                    console.log("Row clicked!", item.id);
                                    navigate(`/flight/${item.id}`);
                                }}
                            >
                                {flightFields.map((field, colIndex) => (
                                    <td key={colIndex}>{getValueByPath(item, field.key)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FlightsTable;
