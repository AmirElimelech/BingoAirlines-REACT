

import React, { useState, useEffect , useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import FlightSearch from './components/Pages/FlightSearch';
import WelcomePage from './components/Pages/WelcomePage';
import TopBar from './components/Layout/TopBar';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import { UserProvider } from './contexts/UserContext';
import UserProfileUpdate from './components/Pages/UserProfileUpdate';
import SideBar from './components/Layout/SideBar';
import GenericTable from './components/Common/GenericTable';
import GetAirlineById from './components/Pages/GetAirlineById';
import GetCountryById from './components/Pages/GetCountryById';
import GetFlightByFlightNumber from './components/Pages/GetFlightByFlightNumber';
import GetAirportByIATACode from './components/Pages/GetAirportByIATACode';
import GetFlightByParams from './components/Pages/GetFlightByParams';
import UserContext from './contexts/UserContext';
import GetCustomerBookings from './components/Pages/GetCustomerBookings';
import BookingDetail from './components/Pages/BookingDetail';
import CustomerForm from './components/Pages/Administrators Pages/CustomerForm';
import EntityRegistrationForm from './EntityRegistrationForm';
import AddFlight from './components/Pages/Airline Companies Pages/AddFlight';
import FlightDetail from './FlightDetail';
import GetAirlineFlights from './GetAirlineFlights';






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
        }, 4000); // Keep the welcome page for 4 seconds before starting fade-out
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
                        <Route path="/flights" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/flights/" />} />
                        <Route path="/countries" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/countries/" />} />
                        <Route path="/airlines" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/airlines/" />} />
                        <Route path="/airports" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/airports/" />} />
                        <Route path="/customers" element={<GenericTable endpoint="http://127.0.0.1:8000/Api/admin/customers/" />} />
                        <Route path="/search-airline-by-id" element={<GetAirlineById />} />
                        <Route path="/search-country-by-id" element={<GetCountryById />} />
                        <Route path="/search-flight-by-flight-number" element={<GetFlightByFlightNumber />} />
                        <Route path="/search-airport-by-iata-code" element={<GetAirportByIATACode />} />
                        <Route path="/search-flight-by-params" element={<GetFlightByParams />} />
                        <Route path="/my-bookings" element={<GetCustomerBookings />} />
                        <Route path="/booking/:id" element={<BookingDetail />} />
                        <Route path="/add-customer" element={<CustomerForm />} />
                        <Route path="/register-entity" element={<EntityRegistrationForm />} />
                        


                        
                        <Route path="/flight/:id" element={<FlightDetail />} />
                        <Route path="/my-flights" element={<GetAirlineFlights />} />
                        <Route path="/add-flight" element={<AddFlight />} />

                        




                        

                        


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
