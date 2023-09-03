

import React, { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import './UserProfileUpdate.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to get the CSRF token from cookies
function getCookie(name) {
    console.log("Raw cookies inside getCookie:", document.cookie);

    console.log("Fetching CSRF token...");
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        const token = parts.pop().split(";").shift();
        console.log("Fetched CSRF token:", token);
        return token;
    }
    return null;
}

// Axios instance configuration
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') ,
        'csrftoken': getCookie('csrftoken') ,
    },
    withCredentials: true,
    xsrfCookieName: "csrftoken",    // This is the name of the cookie where the CSRF token is stored.
    xsrfHeaderName: "X-CSRFToken" 
});

console.log("Axios instance configuration:", axiosInstance.defaults);

const UserProfileUpdate = () => {
    console.log("UserProfileUpdate component rendered.");

    const { user, setUser } = useContext(UserContext);
    console.log("User context:", user);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        address: user.address || "",
        phone_no: user.phone_no || "",
        credit_card_no: user.credit_card_no || "",
    });

    const handleChange = (e) => {
        console.log("handleChange triggered for field:", e.target.name);
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        console.log("handleSubmit triggered.");

        e.preventDefault();

        // Frontend validation for credit card
        const cardLength = formData.credit_card_no.length;
        if (![13, 15, 16].includes(cardLength) || isNaN(formData.credit_card_no)) {
            alert("Credit card number should be 13, 15, or 16 digits long.");
            return;
        }

        const updatedData = new FormData();
        
        updatedData.append('id', user.customer_id); // Use customer_id directly from UserContext
        for (const key in formData) {
            updatedData.append(key, formData[key]);
        }

        console.log("Form data:", formData);
        console.log("Updated data:", [...updatedData.entries()]);
        console.log("Headers before request:", axiosInstance.defaults.headers);

        try {
            // Update customer details
            const response = await axiosInstance.put('Api/customer/update_customer_api/', updatedData);
            console.log("Received response:", response);

            if (response.data.error) {
                alert(response.data.error);
                return;
            } else {
                
                setUser(prevUser => ({
                    ...prevUser,
                    ...response.data
                }));
                

               
                alert("Profile updated successfully!");

                navigate('/');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
                console.error("Error data:", error.response.data);
            }
            alert("Error updating profile.");
        }
    };
    
    return (
        <div className="user-profile-update-container">
            <div className="user-profile-update">
                <h2>Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                    </label>
                    <label>
                        Address:
                        <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" name="phone_no" value={formData.phone_no} onChange={handleChange} />
                    </label>
                    <label>
                        Credit Card No:
                        <input type="text" name="credit_card_no" value={formData.credit_card_no} onChange={handleChange} />
                    </label>
            
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfileUpdate;



