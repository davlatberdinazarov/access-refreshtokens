import React, { useEffect } from 'react';
import $api from '../utils/api';
import axios from 'axios';

export default function AllUsers() {
    const [users, setUsers] = React.useState([]);
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        fetchData();
    }, [count]);

    const handleIncrement = () => {
        setCount(prev => prev + 1);
    };

    const fetchData = async () => {
        try {
            const response = await $api.get('/users');
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            console.log('Fetching data failed, using cached data instead.');
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };

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
                handleLogOut(); // Log out if refreshing token fails
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            console.log('Refreshing token failed, logging out.');
            handleLogOut(); // Log out if there's an error
        }
    }

    return (
        <div>
            {users.map(user => (
                <div key={user._id} style={styles.card}>
                    <h2>{user.name}</h2>
                    <p>Age: {user.age}</p>
                    <p>Email: {user.email}</p>
                </div>
            ))}

            <div>
                <button className='btn btn-danger' onClick={handleLogOut}>Log out</button>
                <button className='btn btn-primary' onClick={handleIncrement}>Click {count}</button>
                <button className='btn btn-success' onClick={handleRefreshToken}>Refresh Token</button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
};
