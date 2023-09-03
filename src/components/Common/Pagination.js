import React from 'react';
import './Pagination.css'; // Assuming you have a separate CSS file for styles

function Pagination(props) {
    return (
        <div className="fixed-pagination-bar">
            <button onClick={props.goToPreviousPage} disabled={props.currentPage === 1}>Previous</button>
            
            {[...Array(props.totalPages)].map((_, idx) => (
                <button key={idx} onClick={() => props.goToPage(idx + 1)}>{idx + 1}</button>
            ))}
            
            <button onClick={props.goToNextPage} disabled={props.currentPage === props.totalPages}>Next</button>
        </div>
    );
}

export default Pagination;
