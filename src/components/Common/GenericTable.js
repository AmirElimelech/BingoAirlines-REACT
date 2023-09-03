
import React, { useState, useEffect } from 'react';
import './GenericTable.css';
import { axiosInstance } from '../../utils/axiosUtils';



    
const defaultFieldMappings = {
    "http://127.0.0.1:8000/Api/flights/": [
        { label: "Flight Number", key: "flight_number" },
        { label: "Airline", key: "airline_company.name" },
        { label: "Origin Airport", key: "origin_airport.name" },
        { label: "Destination Airport", key: "destination_airport.name" },
        { label: "Departure Time", key: "departure_time" },
        { label: "Landing Time", key: "landing_time" },
        { label: "Remaining Tickets", key: "remaining_tickets" },
        { label: "Departure Terminal", key: "departure_terminal" },
        { label: "Arrival Terminal", key: "arrival_terminal" }
    ],
    "http://127.0.0.1:8000/Api/countries/": [
        { label: "Country Name", key: "name" },
        { label: "Country Code" , key: "country_code" },
    ],
    "http://127.0.0.1:8000/Api/airlines/": [
        { label: "IATA Code", key: "iata_code" },
        { label: "Airline Name", key: "name" },
        { label: "Country", key: "country.name" },
        { label: "Country Code", key: "country.country_code" }
    ],
    "http://127.0.0.1:8000/Api/airports/": [
        { label: "IATA Code", key: "iata_code" },
        { label: "Airport Name", key: "name" },
        { label: "Country Code", key: "country_code" }
    ],
    "http://127.0.0.1:8000/Api/customer/bookings/": [
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
        { label: "Child Travelers", key: "child_traveler_count" },
        
    ] ,
    "http://127.0.0.1:8000/Api/admin/customers/": [
        { label: "Customer ID", key: "id" },
        { label: "User ID", key: "user_id" },
        { label: "First Name", key: "first_name" },
        { label: "Last Name", key: "last_name" },
        { label: "Phone No.", key: "phone_no" },
        { label: "Credit Card No.", key: "credit_card_no" },
        { label: "Email", key: "user.email" },
        { label: "Address", key: "address" },
        
    ],
    "http://127.0.0.1:8000/Api/airline/flights/": [
    { label: "Airline", key: "airline_company.name" },
    { label: "Flight Number", key: "flight_number" },
    { label: "Origin Airport", key: "origin_airport.name" },
    { label: "Destination Airport", key: "destination_airport.name" },
    { label: "Departure Time", key: "departure_time" },
    { label: "Landing Time", key: "landing_time" },
    { label: "Remaining Tickets", key: "remaining_tickets" },
    { label: "Departure Terminal", key: "departure_terminal" },
    { label: "Arrival Terminal", key: "arrival_terminal" },
    ],




};



function getValueByPath(obj, path) {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    if (path === "credit_card_no" && typeof value === "string") {
        return value.length > 4 ? `**** **** **** ${value.slice(-4)}` : value;
    }
    return value || value === 0 ? value : "-";
}




function GenericTable({ endpoint, data: externalData, fields: externalFields }) {
    const [data, setData] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [animationKey, setAnimationKey] = useState(0);
    const fields = externalFields || defaultFieldMappings[endpoint] || [];


    useEffect(() => {
        const axiosToUse = axiosInstance;
    
        if (!externalData && endpoint) {
            axiosToUse.get(endpoint)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setData(response.data);
                    } else if (response.data.results && Array.isArray(response.data.results)) {
                        setData(response.data.results);
                    } else {
                        console.error("Unexpected data format from API:", response.data);
                        setData([]); // set an empty array to avoid further errors
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setData([]); // set an empty array to avoid further errors
                });
        } else if (externalData) {
            setData(externalData);
        }
    }, [endpoint, externalData]);
    

    useEffect(() => {
        if (sortField) {
            const sorted = [...data].sort((a, b) => {
                const aValue = getValueByPath(a, sortField);
                const bValue = getValueByPath(b, sortField);
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            setData(sorted);
        }
    }, [sortField, sortDirection, data]);

    const handleSort = (fieldKey) => {
        if (sortField === fieldKey) {
            setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(fieldKey);
            setSortDirection('asc');
        }
        
        setTimeout(() => {
            setAnimationKey(prevKey => prevKey + 1);
        }, 100);

    };


    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {fields.map((field, index) => (
                                <th key={index} onClick={() => handleSort(field.key)}>
                                    {field.label}
                                    {sortField === field.key && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                style={{ animationDelay: `${animationKey}s` }} 
                                className={item.remaining_tickets <= 2 ? 'flashing-row' : ''}
                            >
                                {fields.map((field, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        onClick={e => e.stopPropagation()}
                                        className={field.key === "credit_card_no" ? "nowrap" : ""}
                                    >
                                        {getValueByPath(item, field.key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    





}

export default GenericTable;



