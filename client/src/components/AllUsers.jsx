import React, { useEffect, useState } from 'react';
import $api from '../utils/api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        age: '',
        email: ''
    });
    const [newUser, setNewUser] = useState({
        name: '',
        age: '',
        email: ''
    });

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
            const response = await axios.post('http://localhost:3000/api/auth/token', {
                token: localStorage.getItem('refreshToken'),
            });

            if (response.status === 200) {
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
    };

    const handleDeleteUser = async (userId) => {
        try {
            await $api.delete(`/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUpdateFormData({
            name: user.name,
            age: user.age,
            email: user.email
        });
        setShowUpdateModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await $api.patch(`/users/${selectedUser._id}`, updateFormData);
            if (response.status === 200) {
                setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
                setShowUpdateModal(false);
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddUser = async () => {
        try {
            const response = await $api.post('/users', newUser);
            if (response.status === 201) {
                setUsers([...users, response.data]);
                setNewUser({ name: '', age: '', email: '' });
            }
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    };

    return (
        <div>
            <div style={styles.card}>
                <h2>Add New User</h2>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleNewUserChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="text"
                            name="age"
                            value={newUser.age}
                            onChange={handleNewUserChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                            className="form-control"
                        />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                </form>
            </div>

            <div className='row'>
                {users.map(user => (
                    <div className='col-3 p-3 gap-2' key={user._id} style={styles.card}>
                        <h2>{user.name}</h2>
                        <p>Age: {user.age}</p>
                        <p>Email: {user.email}</p>
                        <button onClick={() => handleEditUser(user)} className='btn btn-info'>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDeleteUser(user._id)} className='btn btn-danger'>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <button className='btn btn-danger' onClick={handleLogOut}>Log out</button>
                <button className='btn btn-primary' onClick={handleIncrement}>Click {count}</button>
                <button className='btn btn-success' onClick={handleRefreshToken}>Refresh Token</button>
            </div>

            {showUpdateModal && (
                <div style={styles.modal}>
                    <h2>Update User</h2>
                    <form>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={updateFormData.name}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="text"
                                name="age"
                                value={updateFormData.age}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updateFormData.email}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>Update</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                    </form>
                </div>
            )}
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
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        width: '300px',
    }
};
