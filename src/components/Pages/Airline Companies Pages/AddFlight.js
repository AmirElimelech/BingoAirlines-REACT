import React, { useState , useEffect } from 'react';
import { axiosInstance } from '../../../utils/axiosUtils';
import './AddFlight.css';
import { useNavigate } from 'react-router-dom';





function AddFlight() {
    const [formData, setFormData] = useState({
        origin_airport: '',
        destination_airport: '',
        departure_time: '',
        landing_time: '',
        remaining_tickets: '',
        flight_number: '',
        departure_terminal: '',
        arrival_terminal: ''
    });

    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        // Fetch airports from the API when the component mounts
        // axiosInstance.get('http://127.0.0.1:8000/Api/airports/')
        axiosInstance.get('https://bingoairlines.com/Api/airports/')
            .then(response => {
                setAirports(response.data);
            })
            .catch(error => {
                console.error("Error fetching airports:", error);
            });
    }, []);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const offset = date.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset < 0 ? '+' : '-';
        const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
        return `${date.toISOString().slice(0, -5)}${offsetString}`;
    };
    


    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        
        e.preventDefault();

    
        




    // Validations:
    if (formData.origin_airport === formData.destination_airport) {
        alert("Origin and destination airports cannot be the same.");
        return;
    }

    if (new Date(formData.departure_time) >= new Date(formData.landing_time)) {
        alert("Departure time must be before landing time.");
        return;
    }

    if (new Date(formData.departure_time) <= new Date()) {
        alert("You cannot add a flight in the past.");
        return;
    }

    if (formData.remaining_tickets < 0) {
        alert("You cannot add a flight with no remaining tickets.");
        return;
    }



    if (!/^\d+$/.test(formData.flight_number)) {
        alert("Flight number must contain only integers.");
        return;
    }






        const formattedData = {
            ...formData,
            departure_time: formatDateTime(formData.departure_time),
            landing_time: formatDateTime(formData.landing_time)
        };

        console.log("Sending the following data to the backend:", formattedData);
        // axiosInstance.post('http://127.0.0.1:8000/Api/airline/flights/add/', formattedData)
        axiosInstance.post('https://bingoairlines.com/Api/airline/flights/add/', formattedData)
            .then(response => {
                setMessage('Successfully added flight.');
                setFormData({
                    origin_airport: '',
                    destination_airport: '',
                    departure_time: '',
                    landing_time: '',
                    remaining_tickets: '',
                    flight_number: '',
                    departure_terminal: '',
                    arrival_terminal: ''
                });
            })
            .catch(error => {
                setMessage('Error adding flight.');
                console.error("Error adding flight:", error);
            });
            navigate('/'); // Redirect to home page
    };

    const handleCancel = () => {
        navigate('/'); // Redirect to home page
    };
    

    return (
        <div className="table-wrapper">
            <h2>Add Flight</h2>
            <div className="table-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                            <label>Origin Airport:</label>
                            <select 
                                name="origin_airport"
                                value={formData.origin_airport} 
                                onChange={handleChange} 
                                required 
                            >
                                <option value="">Select an Airport</option>
                                {airports.map(airport => (
                                    <option key={airport.iata_code} value={airport.iata_code}>{airport.name} ({airport.iata_code})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Destination Airport:</label>
                            <select 
                                name="destination_airport"
                                value={formData.destination_airport} 
                                onChange={handleChange} 
                                required 
                            >
                                <option value="">Select an Airport</option>
                                {airports.map(airport => (
                                    <option key={airport.iata_code} value={airport.iata_code}>{airport.name} ({airport.iata_code})</option>
                                ))}
                            </select>
                        </div>
                    <div className="form-group">
                        <label>Departure Time:</label>
                        <input 
                            type="datetime-local" 
                            name="departure_time" 
                            value={formData.departure_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Landing Time:</label>
                        <input 
                            type="datetime-local" 
                            name="landing_time" 
                            value={formData.landing_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Remaining Tickets:</label>
                        <input 
                            type="number" 
                            name="remaining_tickets" 
                            value={formData.remaining_tickets} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Flight Number:</label>
                        <input 
                            type="text" 
                            name="flight_number" 
                            placeholder="Enter only the numeric part (e.g., 1234)"
                            value={formData.flight_number} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Departure Terminal:</label>
                        <input 
                            type="text" 
                            name="departure_terminal" 
                            value={formData.departure_terminal} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Terminal:</label>
                        <input 
                            type="text" 
                            name="arrival_terminal" 
                            value={formData.arrival_terminal} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit">Add Flight</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>

                </form>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
    
}

export default AddFlight;
