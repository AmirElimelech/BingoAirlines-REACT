

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropDown.css';


function DropDown({ userRole, onOptionClick }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleMouseHover = () => {
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        setShowDropdown(false);
    };



    let options = [];
    let links = {};  // Placeholder for the links based on user role

    if (userRole === 'Administrator') {
        options = [
            'View All Customers',
            'Add User',
           
        ];
        links = {
            'View All Customers': '/customers',  
        };
    } else if (userRole === 'Customer') {
        options = [
            'My Bookings',
        ];
        links = {
            'My Bookings': '/my-bookings',
        };
    } else if (userRole === 'Airline Company') {
        options = [
            'Flights',  
            'Add Flight',
        ];
        links = {
            'Flights': '/my-flights', 
            'Add Flight': '/add-flight',
        };
    }

    return (
        <div 
            className={`dropdown ${showDropdown ? 'show' : ''}`} 
            onMouseOver={handleMouseHover} 
            onMouseLeave={handleMouseLeave}
        >
            {options.map((option, index) => {
                        switch (option) {
                            case 'Add User':
                                return <Link key={index} to="/add-user">{option}</Link>;
                            default:
                                return (
                                    <Link 
                                        key={index} 
                                        to={links[option] || '/'} 
                                        className={["Tickets", "Flights", "View all customers"].includes(option) ? "top-space" : ""}
                                    >
                                        {option}
                                    </Link>
                                );
                        }
                    })}

        </div>
    );
}

export default DropDown;
