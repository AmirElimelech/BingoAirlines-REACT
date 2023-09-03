// // src/EntityRegistrationForm.js

// import React, { useState } from 'react';
// import axios from 'axios';
// import './EntityRegistrationForm.css';




// const EntityRegistrationForm = () => {
//     const [entityType, setEntityType] = useState(''); // customer, airline_company, administrator
//     const [userData, setUserData] = useState({
//         id: '',
//         username: '',
//         password: '',
//         email: '',
//         user_role: ''
//     });
//     const [entityData, setEntityData] = useState({});
//     const [message, setMessage] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/Api/admin/register/', {
//             entity_type: entityType,
//             user: userData,
//             [entityType]: entityData
//         });

//             setMessage(response.data.message);
//         } catch (error) {
//             setMessage(error.response.data.error);
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 {/* Entity Type Selection */}
//                 <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
//                     <option value="">Select Entity Type</option>
//                     <option value="customer">Customer</option>
//                     <option value="airline_company">Airline Company</option>
//                     <option value="administrator">Administrator</option>
//                 </select>

//                 <h3>User Data</h3>
//                 <input type="text" placeholder="ID" value={userData.id} onChange={(e) => setUserData({ ...userData, id: e.target.value })} />
//                 <input type="text" placeholder="Username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
//                 <input type="password" placeholder="Password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
//                 <input type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
//                 <input type="text" placeholder="User Role" value={userData.user_role} onChange={(e) => setUserData({ ...userData, user_role: e.target.value })} />

//                 {/* Entity Specific Fields */}
//                 {entityType === 'customer' && (
//                     <div>
//                         <h3>Customer Data</h3>
//                         <input type="text" placeholder="First Name" value={entityData.first_name || ''} onChange={(e) => setEntityData({ ...entityData, first_name: e.target.value })} />
//                         <input type="text" placeholder="Last Name" value={entityData.last_name || ''} onChange={(e) => setEntityData({ ...entityData, last_name: e.target.value })} />
//                         {/* Add other customer fields similarly... */}
//                     </div>
//                 )}

//                 {entityType === 'airline_company' && (
//                     <div>
//                         <h3>Airline Company Data</h3>
//                         <input type="text" placeholder="IATA Code" value={entityData.iata_code || ''} onChange={(e) => setEntityData({ ...entityData, iata_code: e.target.value })} />
//                         <input type="text" placeholder="Name" value={entityData.name || ''} onChange={(e) => setEntityData({ ...entityData, name: e.target.value })} />
//                         {/* Add other airline company fields similarly... */}
//                     </div>
//                 )}

//                 {entityType === 'administrator' && (
//                     <div>
//                         <h3>Administrator Data</h3>
//                         <input type="text" placeholder="First Name" value={entityData.first_name || ''} onChange={(e) => setEntityData({ ...entityData, first_name: e.target.value })} />
//                         <input type="text" placeholder="Last Name" value={entityData.last_name || ''} onChange={(e) => setEntityData({ ...entityData, last_name: e.target.value })} />
//                     </div>
//                 )}

//                 <button type="submit">Register</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default EntityRegistrationForm;







// src/EntityRegistrationForm.js

import React, { useState } from 'react';
import './EntityRegistrationForm.css'; // Import the new CSS file
// import {axiosInstance}  from './utils/axiosUtils'; // Import the UserContext
import axiosInstance from './utils/axiosConfig';

const EntityRegistrationForm = () => {
    const [entityType, setEntityType] = useState(''); // customer, airline_company, administrator
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        password: '',
        email: '',
        user_role: ''
    });
    const [entityData, setEntityData] = useState({});
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('http://127.0.0.1:8000/Api/admin/register/', {
                entity_type: entityType,
                user: userData,
                [entityType]: entityData
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label className="form-label">Entity Type</label>
                <select className="form-input" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                    <option value="">Select Entity Type</option>
                    <option value="customer">Customer</option>
                    <option value="airline_company">Airline Company</option>
                    <option value="administrator">Administrator</option>
                </select>

                <h3>User Data</h3>
                <label className="form-label">ID</label>
                <input className="form-input" type="text" placeholder="ID" value={userData.id} onChange={(e) => setUserData({ ...userData, id: e.target.value })} />
                <label className="form-label">Username</label>
                <input className="form-input" type="text" placeholder="Username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                <label className="form-label">User Role</label>
                <input className="form-input" type="text" placeholder="User Role" value={userData.user_role} onChange={(e) => setUserData({ ...userData, user_role: e.target.value })} />

                {/* Entity Specific Fields */}
                {entityType === 'customer' && (
                    <div>
                        <h3>Customer Data</h3>
                        <label className="form-label">First Name</label>
                        <input className="form-input" type="text" placeholder="First Name" value={entityData.first_name || ''} onChange={(e) => setEntityData({ ...entityData, first_name: e.target.value })} />
                        <label className="form-label">Last Name</label>
                        <input className="form-input" type="text" placeholder="Last Name" value={entityData.last_name || ''} onChange={(e) => setEntityData({ ...entityData, last_name: e.target.value })} />
                        {/* Add other customer fields similarly... */}
                    </div>
                )}

                {entityType === 'airline_company' && (
                    <div>
                        <h3>Airline Company Data</h3>
                        <label className="form-label">IATA Code</label>
                        <input className="form-input" type="text" placeholder="IATA Code" value={entityData.iata_code || ''} onChange={(e) => setEntityData({ ...entityData, iata_code: e.target.value })} />
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" placeholder="Name" value={entityData.name || ''} onChange={(e) => setEntityData({ ...entityData, name: e.target.value })} />
                        {/* Add other airline company fields similarly... */}
                    </div>
                )}

                {entityType === 'administrator' && (
                    <div>
                        <h3>Administrator Data</h3>
                        <label className="form-label">First Name</label>
                        <input className="form-input" type="text" placeholder="First Name" value={entityData.first_name || ''} onChange={(e) => setEntityData({ ...entityData, first_name: e.target.value })} />
                        <label className="form-label">Last Name</label>
                        <input className="form-input" type="text" placeholder="Last Name" value={entityData.last_name || ''} onChange={(e) => setEntityData({ ...entityData, last_name: e.target.value })} />
                    </div>
                )}

                <button className="form-button" type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EntityRegistrationForm;
