
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css'; 

function SideBar() {
    const [showSidebar, setShowSidebar] = useState(false);

    // Function to handle mouse hover
    const handleMouseHover = () => {
        setShowSidebar(true);
    };

    // Function to handle mouse leave
    const handleMouseLeave = () => {
        setShowSidebar(false);
    };

    return (
        <div 
            className={`sidebar ${showSidebar ? 'show' : ''}`} 
            onMouseOver={handleMouseHover} 
            onMouseLeave={handleMouseLeave}
        >
            <Link to="/flights">Get All Flights</Link>
            <Link to="/search-flight-by-flight-number">Search Flight by Flight Number</Link>
            <Link to="/search-flight-by-params">Search Flight by Params</Link>
            <Link to="/countries">Get All Countries</Link>
            <Link to="/search-country-by-id">Search Country by ID</Link>
            <Link to="/airlines">Get All Airlines</Link>
            <Link to="/search-airline-by-id">Search Airline by ID</Link>
            <Link to="/airports">Get All Airports</Link>
            <Link to="/search-airport-by-iata-code">Search Airport by IATA Code</Link>
            
            
            
            
            

        </div>
    );
}

export default SideBar;
