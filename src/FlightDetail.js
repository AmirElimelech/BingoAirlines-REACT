

import React, { useState, useEffect } from 'react';
import { axiosInstance } from './utils/axiosUtils'; 
import { useParams } from 'react-router-dom';
import './FlightDetail.css'; 
import { useNavigate } from 'react-router-dom';

function FlightDetail() {
    const [flight, setFlight] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

   
    const isValidIataCode = (iataCode) => {
        return iataCode.length === 3;
    };

    const isDateInPast = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date < today;
    };
    
    const isArrivalBeforeDeparture = (departureDate, arrivalDate) => {
        return new Date(arrivalDate) < new Date(departureDate);
    };


    const isSameAirport = (origin, destination) => {
        return origin === destination;
    };


         


    useEffect(() => {
        axiosInstance.get(`/Api/airline/flights2/${id}/`)
            .then(response => {
                setFlight(response.data);
            })
            .catch(error => {
                console.error("Error fetching flight data:", error);
            });
    }, [id]);

    const handleDelete = (flightId) => {
        const userConfirmation = window.confirm("Are you sure you want to delete this flight?");
        if (userConfirmation) {
            axiosInstance.delete(`/Api/airline/flights2/${flightId}/remove/`)
            .then(response => {
                console.log("Flight deleted successfully", response.data);
                navigate('/');
            })
            .catch(error => {
                console.error("Error deleting flight:", error);
            });
        } else {
            console.log("User cancelled the delete action");
        }
    };

    const handleUpdate = () => {


        if (isSameAirport(flight.origin_airport.name, flight.destination_airport.name)) {
            alert("Origin and destination airports cannot be the same.");
            return;
        }

        if (!isValidIataCode(flight.origin_airport.name) || !isValidIataCode(flight.destination_airport.name)) {
            alert("Please enter a valid 3-character IATA code for the airports.");
            return;
        }
    
        if (isDateInPast(flight.departure_time)) {
            alert("The departure date cannot be in the past.");
            return;
        }
    
        if (isArrivalBeforeDeparture(flight.departure_time, flight.landing_time)) {
            alert("The arrival date cannot be before the departure date.");
            return;
        }


        const updatedFlight = {
            id: flight.id,
            // flight_number: flight.flight_number,
            // airline_company_id: flight.airline_company.name,
            origin_airport: flight.origin_airport.name,
            destination_airport: flight.destination_airport.name,
            departure_time: flight.departure_time,
            landing_time: flight.landing_time,
            remaining_tickets: flight.remaining_tickets,
            departure_terminal: flight.departure_terminal,
            arrival_terminal: flight.arrival_terminal
        };

        axiosInstance.put(`/Api/airline/flights/update/`, updatedFlight)
            .then(response => {
                console.log("Flight updated successfully", response.data);
                setIsEditing(false);
                setFlight(response.data);
            })
            .catch(error => {
                console.error("Error updating flight:", error);
            });
    };

    if (!flight) {
        return <p>Loading flight details...</p>;
    }

    return (
        <div className="table-wrapper">
            <h2>Flight Details</h2>
            {isEditing ? (
                <div className="flight-edit-container">
                        {/* Render input fields for editing flight details */}
                        {/* <div className="flight-edit-row">
                            <label>Airline:</label>
                            <input type="text" value={flight.airline_company.name} onChange={e => setFlight({...flight, airline_company: {...flight.airline_company, name: e.target.value}})} />
                        </div> */}
                        {/* <div className="flight-edit-row">
                            <label>Flight Number:</label>
                            <input type="text" value={flight.flight_number} onChange={e => setFlight({...flight, flight_number: e.target.value})} />
                        </div> */}
                        <div className="flight-edit-row">
                            <label>Origin Airport:</label>
                            <input type="text" value={flight.origin_airport.name} onChange={e => setFlight({...flight, origin_airport: {...flight.origin_airport, name: e.target.value}})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Destination Airport:</label>
                            <input type="text" value={flight.destination_airport.name} onChange={e => setFlight({...flight, destination_airport: {...flight.destination_airport, name: e.target.value}})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Departure Time:</label>
                            <input type="text" value={flight.departure_time} onChange={e => setFlight({...flight, departure_time: e.target.value})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Landing Time:</label>
                            <input type="text" value={flight.landing_time} onChange={e => setFlight({...flight, landing_time: e.target.value})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Remaining Tickets:</label>
                            <input type="number" value={flight.remaining_tickets} onChange={e => setFlight({...flight, remaining_tickets: e.target.value})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Departure Terminal:</label>
                            <input type="text" value={flight.departure_terminal} onChange={e => setFlight({...flight, departure_terminal: e.target.value})} />
                        </div>
                        <div className="flight-edit-row">
                            <label>Arrival Terminal:</label>
                            <input type="text" value={flight.arrival_terminal} onChange={e => setFlight({...flight, arrival_terminal: e.target.value})} />
                        </div>
                        <button onClick={handleUpdate}>Confirm Update</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="flight-detail-container">
                    <div className="flight-detail-row">
                        <span><strong>Airline:</strong> {flight.airline_company.name}</span>
                        <span><strong>Flight Number:</strong> {flight.flight_number}</span>
                    </div>
                    <div className="flight-detail-row">
                        <span><strong>Origin Airport:</strong> {flight.origin_airport.name}</span>
                        <span><strong>Destination Airport:</strong> {flight.destination_airport.name}</span>
                    </div>
                    <div className="flight-detail-row">
                        <span><strong>Departure Time:</strong> {flight.departure_time}</span>
                        <span><strong>Landing Time:</strong> {flight.landing_time}</span>
                    </div>
                    <div className="flight-detail-row">
                        <span><strong>Remaining Tickets:</strong> {flight.remaining_tickets}</span>
                        <span><strong>Departure Terminal:</strong> {flight.departure_terminal}</span>
                    </div>
                    <div className="flight-detail-row">
                        <span><strong>Arrival Terminal:</strong> {flight.arrival_terminal}</span>
                    </div>
                   
                </div>
            )}
            <button className="delete-button" onClick={() => handleDelete(id)}>Delete Flight</button>
            <button className="update-button" onClick={() => setIsEditing(true)}>Update Flight</button>
        </div>
    );
}

export default FlightDetail;

