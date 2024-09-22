import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assests/logo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const toastOpts = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { username, email, password } = values;
            const { data } = await axios.post(registerRoute, {
                email,
                username,
                password
            });

            if (data.status === false) {
                toast.error(data.message, toastOpts);
            }
            if (data.status === true) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/setAvatar');
            }
        }
    };

    const handleValidation = () => {
        const { username, email, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            toast.error('Passwords must match', toastOpts);
            return false;
        } else if (username.length < 3) {
            toast.error('Username must be longer than 3 characters', toastOpts);
            return false;
        } else if (password.length < 8) {
            toast.error('Password must be at least 8 characters', toastOpts);
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>Howdy</h1>
                    </div>
                    <input
                        type="text"
                        name="username"
                        onChange={handleInputChange}
                        placeholder="Username"
                        autoComplete="off"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                        placeholder="Email"
                        autoComplete="off"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        placeholder="Password"
                        autoComplete="off"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        autoComplete="off"
                        required
                    />
                    <button type="submit">Create User</button>
                    <span>
                        Already have an account? <Link to="/login">Login</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #131324;
    padding: 1rem;

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    img {
        height: 5rem;
        border-radius: 50%;
        border: 2px solid #4e0eff;
    }

    h1 {
        color: white;
        text-transform: uppercase;
        font-size: 2rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: #00000076;
        border-radius: 1.5rem;
        padding: 3rem 4rem;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 100%;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            color: white;
            border-radius: 0.4rem;
            width: 100%;
            font-size: 1.2rem;
            transition: 0.3s ease;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }

        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1.2rem;
            text-transform: uppercase;
            transition: 0.3s ease-in-out;

            &:hover {
                background-color: #4e0eff;
            }
        }

        span {
            color: white;
            text-transform: uppercase;
            font-size: 1rem;

            a {
                font-weight: bold;
                text-decoration: none;
                color: #4e0eff;

                &:hover {
                    color: #997af0;
                }
            }
        }
    }

    @media (max-width: 768px) {
        form {
            padding: 2rem;
            gap: 1rem;
        }

        .brand h1 {
            font-size: 1.5rem;
        }

        button {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        form {
            padding: 1.5rem;
            gap: 1rem;
        }

        .brand h1 {
            font-size: 1.2rem;
        }

        input, button {
            font-size: 0.9rem;
        }
    }
`;

export default Register;
