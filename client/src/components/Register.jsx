import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import $api from '../utils/api';

export default function Register() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [age, setAge] = React.useState('');

    const navigate = useNavigate()

    useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			navigate('/')
		}
	}, [])

    const handleRegister = async (e) => {
        e.preventDefault();
        // Send registration data to the server
        const optionBody = {
            name,
            email,
            age
        }
        try {
            const respons = await $api.post('/auth/register', optionBody);
            console.log(respons);
        }
        catch (error) {
            console.error(error);
            // Handle registration errors
        }
        setName('');
        setEmail('');
        setAge('');
    }

    return (
        <div className='d-flex align-items-center ' style={{ height:'100vh' }}>
            <main class="form-signin w-50 m-auto px-5">
                <form onSubmit={handleRegister}>
                    <h1 class="h3 mb-3 fw-normal">Please sign up</h1>

                    <div class="form-floating">
                        <input type="text" onChange={({target}) => setName(target.value)} class="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label for="floatingInput">name</label>
                    </div>
                    <div class="form-floating">
                        <input type="email" onChange={({target}) => setEmail(target.value)} class="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label for="floatingInput">Email address</label>
                    </div>
                    <div class="form-floating">
                        <input type="number" onChange={({target}) => setAge(target.value)}  class="form-control" id="floatingPassword" placeholder="Password" />
                        <label for="floatingPassword">Age</label>
                    </div>

                    <div class="form-check text-start my-3">
                        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label class="form-check-label" for="flexCheckDefault">
                            Remember me
                        </label>
                    </div>
                    <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                    <p class="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
                </form>
            </main>
        </div>
    )
}
