import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Logo from '../assests/logo.jpg'

function Register(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("fsldk");
    }

    const handleInputChange = (e) => {

    }

    return (
        <>
            <FormContainer>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>HOWDY</h1>
                    </div>
                    <input type="text" name="username" onChange={e => handleInputChange(e)} placeholder='Username' />
                    <input type="email" name="email" onChange={e => handleInputChange(e)} placeholder='Email' />
                    <input type="password" name="password" onChange={e => handleInputChange(e)} placeholder='Password' />
                    <input type="password" name="confirmPassword" onChange={e => handleInputChange(e)} placeholder='Confirm Password' />
                    <button type='submit'>Create User</button>
                    <span>Already have an account ? <Link to='/login'>Login</Link> </span>
                </form>
            </FormContainer>
        </>
    );
}

const FormContainer = styled.div``;

export default Register;