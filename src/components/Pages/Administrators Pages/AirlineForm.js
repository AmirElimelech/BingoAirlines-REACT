import React, { useState } from 'react';
import { axiosInstance } from '../../../utils/axiosUtils';
import './FormStyles.css';




function AirlineForm() {  
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
        userRole: '',  // set default role if needed
        iataCode: '',
        name: '',
        countryCode: '',
    });

    console.log("Rendering AirlineForm");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the data for submission
        const dataToSubmit = {
            'user[id]': formData.userId,
            'user[username]': formData.username,
            'user[password]': formData.password,
            'user[email]': formData.email,
            'user[user_role]': formData.userRole,
            'airline[iata_code]': formData.iataCode,
            'airline[name]': formData.name,
            'airline[country_code]': formData.countryCode
        };

        // Send POST request
        axiosInstance.post('http://127.0.0.1:8000/Api/admin/register/', dataToSubmit)
            .then(response => {
                alert('Airline successfully added.');
            })
            .catch(error => {
                alert('Failed to add airline.');
                console.error(error);
            });
    };

    return (
            <div className="airline-form-container">
                <form onSubmit={handleSubmit}>
                    <label>User ID:</label>
                    <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />

                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>IATA Code:</label>
                    <input type="text" name="iataCode" value={formData.iataCode} onChange={handleChange} required />

                    <label>Airline Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Country Code:</label>
                    <input type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} required />

                    <button type="submit">Submit</button>
                </form>
            </div>
    );
}

export default AirlineForm;
