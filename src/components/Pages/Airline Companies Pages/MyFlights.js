import React from 'react';
import GenericTable from '../../Common/GenericTable';


function MyFlights() {
    return (
        <div>
            <h2>My Flights</h2>
            {/* <GenericTable endpoint="http://127.0.0.1:8000/Api/airline/flights/" /> */}
            <GenericTable endpoint="https://bingoairlines.com/Api/airline/flights/" />
        </div>
    );
}

export default MyFlights;
