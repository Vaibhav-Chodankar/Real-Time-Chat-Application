import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../assests/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

function SetAvatar(props) {

    const Api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOpts = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem('user')) {
                navigate('/login');
            }
        }
        checkUser();
    }, []);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOpts);
        } else {
            const user = await JSON.parse(localStorage.getItem('user'));
            await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            })
                .then((data) => {
                    console.log(data);
                    if (data.data.isSet) {
                        user.isAvatarImageSet = true;
                        user.avatarImage = data.data.image;
                        localStorage.setItem('user', JSON.stringify(user));
                        navigate('/')
                    } else {
                        toast.error('Error setting avatar. Please try again!', toastOpts);
                    }
                })
        }
    };

    useEffect(() => {
        async function fetchData() {
            const data = [];
            for (let i = 0; i < 4; i++) {
                await axios.get(`${Api}/${Math.round(Math.random() * 1000)}`)
                    .then((result) => {
                        const buffer = new Buffer(result.data);
                        data.push(buffer.toString('base64'));
                    })
                    .catch((err) => console.log("Error while fetching data", err));
            }
            setAvatars(data);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className='loader' />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((value, index) => {
                            return (
                                <div
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                    key={index}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${value}`}
                                        alt="avatar"
                                        onClick={() => setSelectedAvatar(index)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button className='submit-btn' onClick={() => setProfilePicture()}>
                        Set as profile picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: #131313;
    height: 100vh;
    width: 100vw;
    padding: 1rem;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
            text-align: center;
            font-size: 2rem;
        }
    }

    .avatars {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;

        .avatar {
            border: 0.3rem solid transparent;
            padding: 0.3rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            cursor: pointer;

            img {
                height: 5rem;
                width: 5rem;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        .selected {
            border-color: #4e0eff;
        }
    }

    .submit-btn {
        background-color: #997af0;
        color: white;
        padding: 0.8rem 1.5rem;
        font-weight: bold;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
            background-color: #4e0eff;
        }
    }

    @media screen and (max-width: 768px) {
        gap: 1.5rem;

        .title-container h1 {
            font-size: 1.5rem;
        }

        .avatars {
            gap: 0.5rem;
            
            .avatar img {
                height: 4rem;
                width: 4rem;
            }
        }

        .submit-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
        }
    }

    @media screen and (max-width: 480px) {
        .title-container h1 {
            font-size: 1.2rem;
        }

        .avatars {
            gap: 0.5rem;

            .avatar img {
                height: 3.5rem;
                width: 3.5rem;
            }
        }

        .submit-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }
    }
`;

export default SetAvatar;
