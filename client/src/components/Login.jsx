import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $api from '../utils/api';
import { $axios } from '../utils';

export default function Login() {
    const [email, setEmail] = React.useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await $axios.post('/auth/login', {
                email
            });
            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                navigate('/');
            } 
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className='d-flex align-items-center' style={{ height: '100vh' }}>
            <main className="form-signin px-5 w-50 m-auto">
                <form onSubmit={handleLogin}>
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating">
                        <input
                            type="email"
                            onChange={({ target }) => setEmail(target.value)}
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Remember me
                        </label>
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
                </form>
            </main>
        </div>
    );
}
