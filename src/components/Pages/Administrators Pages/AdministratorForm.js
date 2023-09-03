import React, { useState } from 'react';
import { axiosInstance } from '../../../utils/axiosUtils';
import './FormStyles.css';




function AdministratorForm() { 
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
        userRole: '',  // set default role if needed
        firstName: '',
        lastName: ''
    });

    console.log("Rendering AdministratorForm");

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
            'administrator[first_name]': formData.firstName,
            'administrator[last_name]': formData.lastName
        };

        // Send POST request
        axiosInstance.post('http://127.0.0.1:8000/Api/admin/register/', dataToSubmit)
            .then(response => {
                alert('Administrator successfully added.');
            })
            .catch(error => {
                alert('Failed to add administrator.');
                console.error(error);
            });
    };

    return (
            <div className="administrator-form-container">    
                <form onSubmit={handleSubmit}>
                    <label>User ID:</label>
                    <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />

                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

                    <button type="submit">Submit</button>
                </form>
            </div>
    );
}

export default AdministratorForm;



