import axios from "axios";
import { BASE_URL, $axios } from ".";

const $api = axios.create({
    withCredentials: true,
    baseURL: `${BASE_URL}/api`
});

// Setting interceptors
$api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Setting response interceptor for handling token expiration and refreshing tokens
$api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error) {
           handleRefreshToken();
        }
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            console.log('Attempting to refresh token');

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${BASE_URL}/api/auth/token`, { token: refreshToken });

                if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    console.log('Token refreshed successfully');
                    
                    // Update the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    return $api.request(originalRequest);
                } else {
                    console.error('Failed to refresh token');
                    throw new Error('Failed to refresh token');
                }
            } catch (err) {
                console.log('Refresh token expired or invalid', err);
                // Handle logout or other actions here
            }
        }

        return Promise.reject(error);
    }
);

const handleRefreshToken = async () => {
    try {
        // Send the refresh token to the server to get a new access token
        const response = await axios.post('http://localhost:3000/api/auth/token', {
            token: localStorage.getItem('refreshToken'),
        });

        if (response.status === 200) {
            // Store the new access token
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Access token refreshed successfully');
        } else {
            console.error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        console.log('Refreshing token failed, logging out.');
    }
}

export default $api;
