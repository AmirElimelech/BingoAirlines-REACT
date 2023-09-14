

import React, { useState, useEffect , useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import UserContext from './contexts/UserContext'; // <<< not sure if it's needed here at all ! 
import './App.css';
import TopBar from './components/Layout/TopBar';
import SideBar from './components/Layout/SideBar';
import GenericTable from './components/Common/GenericTable';
import FlightSearch from './components/Pages/Basic Pages/FlightSearch';
import GetAirlineById from './components/Pages/Basic Pages/GetAirlineById';
import GetCountryById from './components/Pages/Basic Pages/GetCountryById';
import GetFlightByFlightNumber from './components/Pages/Basic Pages/GetFlightByFlightNumber';
import GetAirportByIATACode from './components/Pages/Basic Pages/GetAirportByIATACode';
import GetFlightByParams from './components/Pages/Basic Pages/GetFlightByParams';
import WelcomePage from './components/Pages/Auth Pages/WelcomePage';
import Login from './components/Pages/Auth Pages/Login';
import Register from './components/Pages/Auth Pages/Register';
import UserProfileUpdate from './components/Pages/Customers Pages/UserProfileUpdate';
import GetCustomerBookings from './components/Pages/Customers Pages/GetCustomerBookings';
import BookingDetail from './components/Pages/Customers Pages/BookingDetail';
import AddFlight from './components/Pages/Airline Companies Pages/AddFlight';
import FlightDetail from './components/Pages/Airline Companies Pages/FlightDetail';
import GetAirlineFlights from './components/Pages/Airline Companies Pages/GetAirlineFlights';
import RegistrationForm from './components/Pages/Administrators Pages/RegistrationForm';






function MainContent() { 
    const [showWelcome, setShowWelcome] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const location = useLocation();


    const { user } = useContext(UserContext);

    useEffect(() => {
        if ( user || location.pathname !== '/') {
            setShowWelcome(false);
            return;
        }

        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setShowWelcome(false);
            }, 1000); // 1 second for fade-out transition to complete
        }, 4000); // I used this to keep the welcome page for 4 seconds before starting fade-out
    }, [location.pathname , user]);



    
    console.log("User in App.js:", user);
    return (
        <div className="App">
            {showWelcome ? 
                <div className={fadeOut ? "fade-out" : ""}><WelcomePage /></div> :
                <>
                    <SideBar />
                    <TopBar />
                    

                    <Routes>
                        <Route path="/" element={<FlightSearch />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/update-profile" element={<UserProfileUpdate />} />
                        {/* <Route path="/flights" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/flights/" />} /> */}
                        <Route path="/flights" element={<GenericTable endpoint="https://bingoairlines.com/Api/flights/" />} />

                        {/* <Route path="/countries" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/countries/" />} /> */}
                        <Route path="/countries" element={<GenericTable endpoint="https://bingoairlines.com/Api/countries/" />} />


                        {/* <Route path="/airlines" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/airlines/" />} /> */}
                        <Route path="/airlines" element={<GenericTable endpoint="https://bingoairlines.com/Api/airlines/" />} />


                        {/* <Route path="/airports" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/airports/" />} /> */}
                        <Route path="/airports" element={<GenericTable endpoint="https://bingoairlines.com/Api/airports/" />} />


                        {/* <Route path="/customers" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/admin/customers/" />} /> */}
                        <Route path="/customers" element={<GenericTable endpoint="https://bingoairlines.com/Api/admin/customers/" />} />


                        <Route path="/search-airline-by-id" element={<GetAirlineById />} />
                        <Route path="/search-country-by-id" element={<GetCountryById />} />
                        <Route path="/search-flight-by-flight-number" element={<GetFlightByFlightNumber />} />
                        <Route path="/search-airport-by-iata-code" element={<GetAirportByIATACode />} />
                        <Route path="/search-flight-by-params" element={<GetFlightByParams />} />
                        <Route path="/my-bookings" element={<GetCustomerBookings />} />
                        <Route path="/booking/:id" element={<BookingDetail />} />
                        <Route path="/flight/:id" element={<FlightDetail />} />
                        <Route path="/my-flights" element={<GetAirlineFlights />} />
                        <Route path="/add-flight" element={<AddFlight />} />
                        <Route path="/add-user" element={<RegistrationForm />} />

                    </Routes>
                </>}
        </div>
    );
}


    

    function App() {
        return (
            <UserProvider>  
                <Router>
                    <MainContent /> 
                </Router>
            </UserProvider>
        );
    }

    
export default App;
