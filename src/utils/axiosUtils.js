

import axios from 'axios';

// Function to get the CSRF token from cookies
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}

// Axios instance configuration
export const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'https://bingoairlines.com/',

    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        'csrftoken': getCookie('csrftoken'),
    },
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken"
});
