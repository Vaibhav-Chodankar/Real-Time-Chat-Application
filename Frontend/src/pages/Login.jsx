import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assests/logo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

function Login(props) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        password: ''
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
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password
            });
            if (data.status === false) {
                toast.error(data.message, toastOpts);
            }
            if (data.status === true) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            }
        }
    };

    const handleValidation = () => {
        const { username, password } = values;
        if (username === '') {
            toast.error('Username is required', toastOpts);
            return false;
        } else if (password === '') {
            toast.error('Password is required', toastOpts);
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
                        <h1>HOWDY</h1>
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
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        placeholder="Password"
                        autoComplete="off"
                        required
                    />
                    <button type="submit">Login</button>
                    <span>
                        Don't have an account? <Link to="/register">Register</Link>
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
        gap: 1rem;
        justify-content: center;

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
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 4rem;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.6);

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

    @media only screen and (max-width: 768px) {
        form {
            padding: 2rem;
        }

        .brand h1 {
            font-size: 1.5rem;
        }

        button {
            font-size: 1rem;
        }
    }

    @media only screen and (max-width: 480px) {
        form {
            padding: 1.5rem;
        }

        .brand h1 {
            font-size: 1.2rem;
        }

        input, button {
            font-size: 0.9rem;
        }
    }
`;

export default Login;
