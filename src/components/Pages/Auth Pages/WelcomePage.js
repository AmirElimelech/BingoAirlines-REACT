

import React, { useContext } from 'react';
import './WelcomePage.css';
import logo from '../../../assets/images/BingoAirlinesLogo.png';
import loadingGif from '../../../assets/images/welcome_loading.gif';

import UserContext from '../../../contexts/UserContext';  // <-- Import the UserContext

const WelcomePage = () => {
    const { user } = useContext(UserContext);  // <-- Use the UserContext

    // Check if the user is logged in. If they are, return null or redirect.
    if (user) {
        // You can return null to render nothing.
        return null;
    }

    return (
        <div className="welcome-container">
            <img src={logo} alt="Company Logo" className="welcome-logo" />
            <img src={loadingGif} alt="Loading..." className="welcome-loading-gif" />
        </div>
    );
}

export default WelcomePage;
