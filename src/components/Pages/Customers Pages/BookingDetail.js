

import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../utils/axiosUtils'; 
import { useParams } from 'react-router-dom';
import './BookingDetail.css' ; 
import { useNavigate } from 'react-router-dom';


function BookingDetail() {
    const [bookings, setBookings] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        axiosInstance.get(`/Api/customer/bookings/${id}/`)
            .then(response => {
                setBookings(Array.isArray(response.data) ? response.data : [response.data]);
            })
            .catch(error => {
                console.error("Error fetching booking data:", error);
            });
    }, [id]);

    const handleDelete = (bookingId) => {
        const userConfirmation = window.confirm("Are you sure you want to delete this booking?");
        if (userConfirmation) {
            axiosInstance.delete(`/Api/customer/bookings/${bookingId}/remove/`)
            .then(response => {
                console.log("Booking deleted successfully", response.data);
                // Optionally, you can remove the deleted booking from the UI by filtering out the deleted booking from the bookings state.
                setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
                navigate('/');
            })
            .catch(error => {
                console.error("Error deleting booking:", error);
            });
        } else {
            console.log("User cancelled the delete action");
        }
    };


    return (
        <div className="table-wrapper">
            <h2>Booking Details</h2>
            {bookings.map((booking, index) => (
                <div key={index} className="booking-detail-container">
                    <div className="booking-detail-row">
                        <span><strong>Booking Date:</strong> {booking.booking_date}</span>
                        <span><strong>Flight Number:</strong> {booking.flight_number}</span>
                    </div>
                    <div className="booking-detail-row">
                        <span><strong>Origin Airport:</strong> {booking.origin_airport.iata_code}</span>
                        <span><strong>Destination Airport:</strong> {booking.destination_airport.iata_code}</span>
                    </div>
                    <div className="booking-detail-row">
                        <span><strong>Departure Time:</strong> {booking.departure_time}</span>
                        <span><strong>Landing Time:</strong> {booking.landing_time}</span>
                    </div>
                    <div className="booking-detail-row">
                        <span><strong>Airline:</strong> {booking.airline.name}</span>
                    </div>
                    {/* Add more fields as needed */}
                </div>
            ))}
            <button className="delete-button" onClick={() => handleDelete(id)}>Delete Booking</button>

        </div>
    );
}

export default BookingDetail;

