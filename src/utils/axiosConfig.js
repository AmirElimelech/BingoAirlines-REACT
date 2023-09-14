



import axios from 'axios';

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        const tokenValue = parts.pop().split(";").shift();
        console.log(`Found cookie ${name} with value:`, tokenValue); // Debugging line
        return tokenValue;
    }
    console.warn(`Cookie ${name} not found!`); // Debugging line
    return null;
}

const csrfToken = getCookie('csrftoken');

// Create an Axios instance with configurations
const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'https://bingoairlines.com/',
    headers: {
        'X-CSRFToken': csrfToken 
    },
    withCredentials: true,
    xsrfHeaderName: "X-CSRFToken",  // This is the name of the HTTP header that carries the CSRF token value.
    xsrfCookieName: "csrftoken"    // This is the name of the cookie where the CSRF token is stored.
});

axiosInstance.interceptors.request.use((config) => {
    console.log("Inside Axios request interceptor."); // Debugging line
    const tokenFromFunction = getCookie('csrftoken');
    console.log("Token fetched inside interceptor:", tokenFromFunction); // Debugging line
    config.headers['X-CSRFToken'] = tokenFromFunction;
    return config;
}, error => {
    console.error("Error in Axios request interceptor:", error); // Debugging line
    return Promise.reject(error);
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
