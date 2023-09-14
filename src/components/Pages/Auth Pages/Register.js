
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        password: '',
        email: '',
        user_role: 3 // Assuming 3 is the ID for Customer
    });

    const [customerData, setCustomerData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        phone_no: '',
        credit_card_no: ''
    });


    const [userImage, setUserImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateInput = () => {
        for (const key in userData) {
            if (!userData[key]) {
                alert(`Please fill in the ${key} field.`);
                return false;
            }
        }

        for (const key in customerData) {
            if (!customerData[key]) {
                alert(`Please fill in the ${key} field.`);
                return false;
            }
        }

       

        const israeli_mobile = '(05\\d(\\-)?\\d{7}|05\\d\\d{8})';
        const israeli_all = '(0\\d{1,2}\\-?\\d{7})';
        const israeli_mobile_with_code = '(\\+9725\\d(\\-)?\\d{7}|\\+9725\\d\\d{8})';
        const custom_format = '(1\\-801\\-700\\-700)';
        const international_pattern = (
            '(\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|'
            + '8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)'
            + '(?:[0-9\\-\\(\\)\\/\\.]\\s?){6,15}[0-9]{1})'
        );
        const phonePattern = new RegExp(`^(${israeli_mobile}|${israeli_all}|${israeli_mobile_with_code}|${custom_format}|${international_pattern})$`);
        if (!phonePattern.test(customerData.phone_no)) {
            alert ('Invalid phone number.');
            return false;

        }

        if (userData.id.length !== 9) {
            alert('ID must be exactly 9 digits long.');
            return false;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordPattern.test(userData.password)) {
            alert('Password should be at least 6 characters, contain an uppercase and lowercase letter, a digit, and a special character.');
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(userData.email)) {
            alert('Invalid email format.');
            return false;
        }

        if (customerData.address.length > 255) {
            alert('Address should not exceed 255 characters.');
            return false;
        }

        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(customerData.first_name) || !namePattern.test(customerData.last_name)) {
            alert('First name and last name should not be empty and should not contain numbers.');
            return false;
        }

        const cardLength = customerData.credit_card_no.length;
        if (cardLength !== 13 && cardLength !== 15 && cardLength !== 16) {
            alert('Credit card number can be 13, 15, or 16 digits long only.');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInput()) {
            return; // Exit the function if validation fails
        }
        const formData = new FormData();
                formData.append('user[id]', userData.id);
                formData.append('user[username]', userData.username);
                formData.append('user[password]', userData.password);
                formData.append('user[email]', userData.email);
                formData.append('user[user_role]', userData.user_role);
                if (userImage) {
                    formData.append('user[image]', userImage);
                }
                formData.append('customer[first_name]', customerData.first_name);
                formData.append('customer[last_name]', customerData.last_name);
                formData.append('customer[address]', customerData.address);
                formData.append('customer[phone_no]', customerData.phone_no);
                formData.append('customer[credit_card_no]', customerData.credit_card_no);

        try {
            // const response = await fetch('http://127.0.0.1:8000/Api/user_registration_api/', {
            const response = await fetch('https://bingoairlines.com/Api/user_registration_api/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);


            } else {
                navigate('/login');  // Redirecting to login page
            }
        } catch (e) {
            setError('Failed to register. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>

            {/* User Data */}
            <input 
                type="text" 
                placeholder="ID" 
                value={userData.id} 
                onChange={e => setUserData(prev => ({ ...prev, id: e.target.value }))}
                maxLength={9}
            />
            <input 
                type="text" 
                placeholder="Username" 
                value={userData.username} 
                onChange={e => setUserData(prev => ({ ...prev, username: e.target.value }))}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={userData.password} 
                onChange={e => setUserData(prev => ({ ...prev, password: e.target.value }))}
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={userData.email} 
                onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
            />

            {/* Customer Data */}

            <input 
                type="file" 
                onChange={e => setUserImage(e.target.files[0])}
            />

            <input 
                type="text" 
                placeholder="First Name" 
                value={customerData.first_name} 
                onChange={e => setCustomerData(prev => ({ ...prev, first_name: e.target.value }))}
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                value={customerData.last_name} 
                onChange={e => setCustomerData(prev => ({ ...prev, last_name: e.target.value }))}
            />
            <input 
                type="text" 
                placeholder="Address" 
                value={customerData.address} 
                onChange={e => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
            />
            <input 
                type="text" 
                placeholder="Phone Number" 
                value={customerData.phone_no} 
                onChange={e => setCustomerData(prev => ({ ...prev, phone_no: e.target.value }))}
            />
            <input 
                type="text" 
                placeholder="Credit Card Number" 
                value={customerData.credit_card_no} 
                onChange={e => setCustomerData(prev => ({ ...prev, credit_card_no: e.target.value }))}
            />

            <button onClick={handleRegister}>Register</button>
            
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default Register;
