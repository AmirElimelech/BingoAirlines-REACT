

import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../contexts/UserContext';
import axiosInstance from '../../../utils/axiosConfig';




function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { setUser } = useContext(UserContext);

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const loginResponse = await axiosInstance.post('Api/login_view_api/', formData);


            if (loginResponse.data && loginResponse.data.status === "success") {
                localStorage.setItem('username', username);
                // Set both username and id in the user state
                setUser({ 
                    username: loginResponse.data.username,
                    id: loginResponse.data.id,
                    customer_id: loginResponse.data.customer_id, 
                    first_name: loginResponse.data.first_name || "",
                    last_name: loginResponse.data.last_name || "",
                    address: loginResponse.data.address || "",
                    phone_no: loginResponse.data.phone_no || "",
                    credit_card_no: loginResponse.data.credit_card_no || "" , 
                    user_role: loginResponse.data.user_role // <-- Capture the user_role from the API response

                      });

                    try {
                        await axiosInstance.get('Api/initialize_session/');
                        console.log("Session initialized successfully");
                    } catch (err) {
                        console.error("Error during session initialization:", err);
                    }

                    navigate('/');
                

            } else {
                setError(loginResponse.data.error || 'Invalid login credentials');
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError('An error occurred during login.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="login-input"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Login
                </button>
                <div className="register-section">
                    <p>Don't have an account?</p>
                    <button onClick={handleRegisterRedirect} className="register-button">Register</button>
                </div>
            </form>
            {error && <p className="login-error">{error}</p>}
        </div>
    );
}

export default Login;



