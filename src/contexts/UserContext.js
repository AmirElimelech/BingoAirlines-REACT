

import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();



export const UserProvider = ({ children }) => {
    // Check if user data is in local storage on initial render
    const initialUser = JSON.parse(localStorage.getItem('user')) || null;
    console.log("Initial User from Local Storage:", initialUser);

    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        // Store user data in local storage whenever it changes
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
