import React, { useState , useEffect} from 'react';
import { axiosInstance } from '../../../utils/axiosUtils';
import './FormStyles.css';
import { useNavigate } from 'react-router-dom';




const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        email: '',
        password: '',
        user_role: 'Customer', // default role
        image: null,
        // Fields for Customer
        address: '',
        phone_no: '',
        credit_card_no: '',
        // Fields for Airline Company
        iata_code: '',
        name: '',
        country_id: '',  // Assuming this is a dropdown with country ids
        logo: null,
        // Common Fields for Administrator and Customers 
        first_name: '',
        last_name: '',
        
    });

    const [countries, setCountries] = useState([]);  // State for storing countries



    useEffect(() => {
        // axiosInstance.get('http://127.0.0.1:8000/Api/countries/')
        axiosInstance.get('https://bingoairlines.com/Api/countries/')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch countries:', error);
            });
    }, []);



    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const validateUser = (user) => {
        // ID Validity
        if (!/^\d{9}$/.test(user.id)) {
            return "ID should be exactly 9 digits.";
        }
        // Username Validity
        if (!(3 <= user.username.length && user.username.length <= 20) || !/^\w+$/.test(user.username)) {
            return "Username should be between 3 and 20 characters and contain only alphanumeric characters and underscores.";
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordPattern.test(user.password)) {
            return "Password should be at least 6 characters, contain an uppercase and lowercase letter, a digit, and a special character.";
        }
        
        return null;  // -> this Means NO errors found
    };

    


    const handleChange = (e) => {
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateUser(formData);

        if (validationError) {
            setError(validationError);
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            // const response = await axiosInstance.post('http://127.0.0.1:8000/Api/admin/register/', data);
            const response = await axiosInstance.post('https://bingoairlines.com/Api/admin/register/', data);
            if (response.status === 201) {
                console.log('Registration successful', response.data);
                alert('User successfully added.');
                navigate('/');
            } else {
                console.error('Registration failed', response.data);
            }
        } catch (error) {
            console.error('Error during registration:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register new User</h1>
            <label className="form-label">User Role:</label>
            <select name="user_role" onChange={handleChange} className="form-input">
                <option value="Customer">Customer</option>
                <option value="AirlineCompany">Airline Company</option>
                <option value="Administrator">Administrator</option>
            </select>
            <input type="text" name="id" onChange={handleChange} placeholder="ID" className="form-input" maxLength={9} />
            <input type="text" name="username" onChange={handleChange} placeholder="Username" className="form-input" />
            <input type="email" name="email" onChange={handleChange} placeholder="Email" className="form-input" />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" className="form-input" />
            <input type="file" name="image" onChange={handleChange} className="form-input" />
        
            {/* Fields for Customer */}
            {formData.user_role === "Customer" && (
                <>
                    <input type="text" name="first_name" onChange={handleChange} placeholder="First Name" className="form-input" />
                    <input type="text" name="last_name" onChange={handleChange} placeholder="Last Name" className="form-input" />
                    <input type="text" name="address" onChange={handleChange} placeholder="Address" className="form-input" />
                    <input type="text" name="phone_no" onChange={handleChange} placeholder="Phone Number" className="form-input" />
                    <input type="text" name="credit_card_no" onChange={handleChange} placeholder="Credit Card Number" className="form-input" maxLength={16} />
                </>
            )}
            
            {/* Fields for Airline Company */}
            {formData.user_role === "AirlineCompany" && (
                <>
                    <input type="text" name="iata_code" onChange={handleChange} placeholder="IATA Code" className="form-input" />
                    <input type="text" name="name" onChange={handleChange} placeholder="Company Name" className="form-input" />
                    <label className="form-label">Country:</label>
                    <select name="country_id" value={formData.country_id} onChange={handleChange} className="form-input">
                        <option value="">Select a country</option>
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    <input type="file" name="logo" onChange={handleChange} className="form-input" />
                </>
            )}
            
            {/* Fields for Administrator */}
            {formData.user_role === "Administrator" && (
                <>
                    <input type="text" name="first_name" onChange={handleChange} placeholder="First Name" className="form-input" />
                    <input type="text" name="last_name" onChange={handleChange} placeholder="Last Name" className="form-input" />
                </>
)}
        
            <button type="submit" className="form-button">Register</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
    
    
}

export default RegistrationForm;
