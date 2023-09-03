import React, { useState } from 'react';
// import { axiosInstance } from '../../../utils/axiosUtils';
import './FormStyles.css';
import axios from 'axios';




function CustomerForm() {
    
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
        userRole: '',  
        firstName: '',
        lastName: '',
        address: '',
        phoneNo: '',
        creditCardNo: '',
    });

    console.log("Rendering CustomerForm");

    
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
            'customer[first_name]': formData.firstName,
            'customer[last_name]': formData.lastName,
            'customer[address]': formData.address,
            'customer[phone_no]': formData.phoneNo,
            'customer[credit_card_no]': formData.creditCardNo,
        };

        // Send POST request
        axios.post('http://127.0.0.1:8000/Api/admin/register/', dataToSubmit)
            .then(response => {
                alert('Customer successfully added.');
            })
            .catch(error => {
                alert('Failed to add customer.');
                console.error(error);
            });
    };
    
    return (
        <div className="customer-form-container">
            <form onSubmit={handleSubmit}>
                <label>User ID:</label>
                <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />

                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>User Role:</label>
                <input type="text" name="userRole" value={formData.userRole} onChange={handleChange} required />

                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />

                <label>Phone Number:</label>
                <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />

                <label>Credit Card Number:</label>
                <input type="text" name="creditCardNo" value={formData.creditCardNo} onChange={handleChange} required />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CustomerForm;

