import React, { useState , useEffect , useContext } from 'react';
import axios from 'axios';
import './FlightSearch.css';
import loadingGif from '../../../assets/images/loading.gif';
import Pagination from '../../Common/Pagination';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../contexts/UserContext';




const FlightSearch = () => {
    const [searchParams, setSearchParams] = useState({
        numAdults: '1',
        numChildren: '0',
        cabinType: 'ECONOMY',
        currencyCode: 'USD',
        originLocationCode: '',
        destinationLocationCode: '',
        departureDate1: '',
        flightType: 'OneWay',
        departureDate2: ''
    });

    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // you can adjust this number based on your preference
    

    const [isFormVisible, setIsFormVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [airportOptions, setAirportOptions] = useState([]);
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const getMinReturnDate = () => {
        if (searchParams.departureDate1) {
            return new Date(searchParams.departureDate1).toISOString().split('T')[0];
        }
        return getToday();
    };
    
    
    

    // Helper functions to format date, time, and duration
    const splitDateTime = (datetimeStr) => {
        const [datePart, timePart] = datetimeStr.split('T');
        return { date: datePart, time: timePart.split(':')[0] + ':' + timePart.split(':')[1] };
    };
    
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    const fetchAirportInfo = async (iataCode) => {
        try {
            const response = await axios.get(`https://bingoairlines.com/Api/airport/${iataCode}/`, {
            // const response = await axios.get(`http://127.0.0.1:8000/Api/airport/${iataCode}/`, {

                withCredentials: true,

            });
            return response.data;
        } catch (error) {
            console.error("Error fetching airport information:", error);
            return null;
        }
    };


    const AirportName = ({ iataCode }) => {
        const [airportInfo, setAirportInfo] = useState(null);
    
        useEffect(() => {
            const fetchData = async () => {
                const data = await fetchAirportInfo(iataCode);
                setAirportInfo(data);
            };
            fetchData();
        }, [iataCode]);
    
        return (
            <>
                <strong>{iataCode}</strong> {airportInfo && <small>({airportInfo.name})</small>}
            </>
        );
    };


    const isoToHHMM = (durationStr) => {
        const hoursMatch = durationStr.match(/(\d+)H/);
        const minutesMatch = durationStr.match(/(\d+)M/);
        
        const hours = hoursMatch ? String(hoursMatch[1]).padStart(2, '0') : '00';
        const minutes = minutesMatch ? String(minutesMatch[1]).padStart(2, '0') : '00';
        
        return `${hours}:${minutes}`;
    };

   
    
    const fetchSuggestions = async (inputValue, setInputSuggestions) => {
        try {
            const response = await axios.get('https://bingoairlines.com/Api/autocomplete', {

            // const response = await axios.get('http://127.0.0.1:8000/autocomplete/', {
                params: {
                    q: inputValue
                } , 
                withCredentials: true,
            });
            setAirportOptions(response.data);
            setInputSuggestions(response.data.map(airport => airport.name));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleAirportSelect = (selectedAirportName, type) => {
        const selectedAirport = airportOptions.find(airport => airport.name === selectedAirportName);
        if (selectedAirport) {
            if (type === 'origin') {
                setSearchParams(prev => ({ ...prev, originLocationCode: selectedAirport.iata_code }));
            } else {
                setSearchParams(prev => ({ ...prev, destinationLocationCode: selectedAirport.iata_code }));
            }
        }
    };



    

    const [flightResults, setFlightResults] = useState(null);
    const [loading, setLoading] = useState(false);

    
    

    useEffect(() => {
        console.log(searchParams);
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const daysDifference = (departureDate, arrivalDate) => {
        const start = new Date(departureDate);
        const end = new Date(arrivalDate);
        const timeDiff = end - start;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    };


    


    const isValidForm = () => {
        const requiredFields = ['numAdults', 'currencyCode', 'originLocationCode', 'destinationLocationCode', 'departureDate1', 'flightType'];
        for (let field of requiredFields) {
            if (!searchParams[field]) {
                return false;
            }
        }
        return true;
    };

    const handleSearch = async () => {

        const today = new Date();
        const departureDate1 = new Date(searchParams.departureDate1);
        const departureDate2 = searchParams.departureDate2 ? new Date(searchParams.departureDate2) : null;
        
        
        if (departureDate1 < today) {
            alert("You can't choose a departure date in the past, please try again.");
            return;
        }

        if (departureDate2 && departureDate2 < today) {
            alert("Please choose a return date in the future.");
            return;
        }

        if (searchParams.originLocationCode !== "" && searchParams.destinationLocationCode !== "" && searchParams.originLocationCode === searchParams.destinationLocationCode) {
            alert("You can't fly from and to the same airport!");
            return;
        }

        if (!isValidForm()) {
            alert("Please fill in all the fields!");
            return;
        }
        setIsFormVisible(false);
        setLoading(true); 
        setFadeIn(true);

        try {
            // const response = await axios.post('http://127.0.0.1:8000/Api/flights/search_form_submission/', searchParams, {
            const response = await axios.post('https://bingoairlines.com/Api/flights/search_form_submission/', searchParams, {

                headers: {
                    'Content-Type': 'application/json'
                } , 
                withCredentials: true,
            });
            const responseData = response.data;
            setFlightResults(responseData.results);
        } catch (error) {
            console.error("Error fetching data from API:", error);
        }

        

        setLoading(false);
        setFadeIn(false);
    };





            const handlePurchase = async (flight) => {

                if (user === null) {
                    navigate('/login');  // Redirecting to the login page
                    return;
                }

                const segments = flight.itineraries[0].segments;
                const totalPrice = flight.price.grandTotal;
                const cabin = flight.travelerPricings[0].fareDetailsBySegment[0].cabin;
                const currency = flight.price.currency;
            
                // Construct the payloads for each segment
                const segmentPayloads = segments.map(segment => ({
                    booking_date: new Date().toISOString(),  // Set the current date-time
                    total_price: totalPrice,
                    flight_number: `${segment.carrierCode}${segment.number}`,
                    origin_airport: {
                        iataCode: segment.departure.iataCode,
                    },
                    destination_airport: {
                        iataCode: segment.arrival.iataCode,
                    },
                    departure_time: segment.departure.at,
                    landing_time: segment.arrival.at,
                    departure_terminal: segment.departure.terminal,
                    arrival_terminal: segment.arrival.terminal,
                    airline: {
                        iataCode: segment.carrierCode
                    },
                    cabin: cabin,
                    adult_traveler_count: flight.travelerPricings.filter(tp => tp.travelerType === "ADULT").length,
                    child_traveler_count: flight.travelerPricings.filter(tp => tp.travelerType === "CHILD").length,
                    currency: currency,
                    remaining_tickets: flight.numberOfBookableSeats
                }));
            
                // Send the array of segment payloads as a single POST request
                try {
                    // const response = await axios.post('http://127.0.0.1:8000/Api/customer/create_booking/', {segments: segmentPayloads}, {
                    const response = await axios.post('https://bingoairlines.com/Api/customer/create_booking/', {segments: segmentPayloads}, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    });
                    if (response.status === 200 || response.status === 201) {
                        alert('Booking successful!');
                    } else {
                        alert('Booking failed. Please try again.');
                    }
                } catch (error) {
                    console.error("Error making a booking:", error);
            
                    // Check if the error response has a data property and an error property inside it
                    if (error.response && error.response.data && error.response.data.error) {
                        alert(error.response.data.error);  // Display the error message from the server
                    } else {
                        alert('Error occurred while making the booking.');
                    }
                }
            };
            
            
            
            














    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };
    
    const goToPreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    let totalPages = 0;
    if (flightResults && flightResults.data) {
        totalPages = Math.ceil(flightResults.data.length / itemsPerPage);
    }

    return (
        <div className="flight-search-wrapper">
    
            {isFormVisible ? (
                <div className="flight-search-container">
                    <h1>Flight Search</h1>
                    <input type="number" name="numAdults" min="1" max="9" placeholder="Number of Adults" onChange={handleInputChange} />
                    <input type="number" name="numChildren" min="0" max="9" placeholder="Number of Children" onChange={handleInputChange} />
                    <select name="cabinType" onChange={handleInputChange} defaultValue="ECONOMY">
                        <option value="ECONOMY">Economy</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FIRST">First Class</option>
                    </select>
                    <select name="currencyCode" onChange={handleInputChange} defaultValue="USD">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="ILS">ILS</option>
                    </select>
                    <input
                        type="text"
                        name="originLocationCode"
                        placeholder="From (e.g., Tel Aviv)"
                        onChange={(e) => {
                            handleInputChange(e);
                            fetchSuggestions(e.target.value, setOriginSuggestions);
                        }}
                        onBlur={(e) => handleAirportSelect(e.target.value, 'origin')}
                        list="originSuggestions"
                    />
                    <datalist id="originSuggestions">
                        {originSuggestions.map((suggestion, index) => (
                            <option key={index} value={suggestion} />
                        ))}
                    </datalist>
                    <input
                        type="text"
                        name="destinationLocationCode"
                        placeholder="To (e.g., Mykonos)"
                        onChange={(e) => {
                            handleInputChange(e);
                            fetchSuggestions(e.target.value, setDestinationSuggestions);
                        }}
                        onBlur={(e) => handleAirportSelect(e.target.value, 'destination')}
                        list="destinationSuggestions"
                    />
                    <datalist id="destinationSuggestions">
                        {destinationSuggestions.map((suggestion, index) => (
                            <option key={index} value={suggestion} />
                        ))}
                    </datalist>           
                    <select name="flightType" onChange={handleInputChange} defaultValue="OneWay">
                        <option value="OneWay">One Way</option>
                        <option value="Return">Return</option>
                    </select>
                    <div className="input-with-label">
                            <label className="inner-label" htmlFor="departureDate1">Departure</label>
                            <input type="date" name="departureDate1" id="departureDate1" min={getToday()} onChange={handleInputChange} />
                    </div>

                    {searchParams.flightType === "Return" && (
                        <div className="input-with-label">
                        <label htmlFor="departureDate2" className="inner-label">Return</label>
                        <input 
                            id="departureDate2"
                            type="date" 
                            name="departureDate2" 
                            min={getMinReturnDate()}
                            placeholder="Return Date (if applicable)" 
                            onChange={handleInputChange} 
                        />
                    </div>

                    )}
                    <button onClick={handleSearch}>Search</button>
                </div>
            ) : null}
    
            {loading ? (
                <div className={`loading-container ${fadeIn ? 'fade-in' : 'fade-out'}`}>                    <img src={loadingGif} alt="Loading..." />                </div>
            ) : null}
    
            {!loading && !isFormVisible && flightResults ? (
                <div className="flight-results-container">


                    {flightResults.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((flight, index) => {
                        
                        const currency = flight.price.currency;
                        const grandTotal = flight.price.grandTotal;
                        const flightRef = `${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number}`;
                        const adultCount = flight.travelerPricings.reduce((acc, traveler) => {
                            if (traveler.travelerType === "ADULT") {
                                acc += 1;
                            }
                            return acc;
                        }, 0);
                    
                        const childCount = flight.travelerPricings.reduce((acc, traveler) => {
                            if (traveler.travelerType === "CHILD") {
                                acc += 1;
                            }
                            return acc;
                        }, 0);
                        
                        
                            return (
                                <div className="single-flight" key={index}>
                                    <h2>Flight Ref: {flightRef}</h2>
    
                                    {flight.itineraries.map((itinerary, itIndex) => (
                                            <div key={itIndex}>
                                                {/* Display "Return Flight" separator for the second itinerary */}
                                                {itIndex === 1 && (
                                                    <div className="flight-separator">
                                                        <h3>Return Flight</h3>
                                                    </div>
                                                )}
                                                
                                                {itinerary.segments.map((segment, segIndex) => {
                                                    const { date: depDate, time: depTime } = splitDateTime(segment.departure.at);
                                                    const { date: arrDate, time: arrTime } = splitDateTime(segment.arrival.at);
                                                    const dayDiff = daysDifference(depDate, arrDate);
    
                                                    return (
                                                        <div key={segIndex}>
                                                            {itinerary.segments.length > 1 && <h4>{getOrdinal(segIndex + 1)} Flight</h4>}
                                                            <div className="airport-info-container">
                                                                <div className="airport-detail">
                                                                    <AirportName iataCode={segment.departure.iataCode} />
                                                                    {segment.departure.terminal && ` Terminal ${segment.departure.terminal}`}
                                                                </div>
                                                                <div className="to-divider">to</div>
                                                                <div className="airport-detail">
                                                                    <AirportName iataCode={segment.arrival.iataCode} />
                                                                    {segment.arrival.terminal && ` Terminal ${segment.arrival.terminal}`}
                                                                </div>
                                                            </div>

                                                            <p>Departure Date: {depDate}</p>
                                                            <p>Departure Time: {depTime}</p>
                                                            <p>Arrival Date: {arrDate}</p>
                                                            <p>Arrival Time: {arrTime} {dayDiff === 1 && '⁺¹'} {dayDiff === 2 && '⁺²'}</p>
                                                            {/* Display flight duration only if there are multiple segments */}
                                                            {itinerary.segments.length > 1 && <p>Flight Duration: {isoToHHMM(segment.duration)}</p>}
                                                        </div>
                                                    );
                                                })}

                                                    <p><strong>Total Flight Duration:</strong> {isoToHHMM(itinerary.duration)}</p>
                                                </div>
                                            ))}



                                        <p>
                                            Passengers:{" "}  
                                            <span>
                                                {adultCount} {adultCount === 1 ? "Adult" : "Adults"}
                                            </span>
                                            {childCount > 0 && (
                                                <span>, {childCount} {childCount === 1 ? "Child" : "Children"}</span>
                                            )}
                                        </p>
                                             
                                    
                                    <p>Cabin: {" "}{flight.travelerPricings[0].fareDetailsBySegment[0].cabin}</p>
                                    <p>Price: {grandTotal} {currency} </p>               
                                    <button className='purchase_ticket' onClick={() => handlePurchase(flight)}>Purchase</button>
                                </div>
                            );
                        })}
                            

                                    <Pagination 
                                        currentPage={currentPage} 
                                        totalPages={totalPages} 
                                        goToNextPage={goToNextPage} 
                                        goToPreviousPage={goToPreviousPage} 
                                        goToPage={goToPage} 
                                    />


                    </div>
                ) : null}
            </div>
        );
    };
    
    export default FlightSearch;
   
    
 