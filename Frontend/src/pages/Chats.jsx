import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AllUsers, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import io from 'socket.io-client';

function Chats(props) {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [currentChat, setCurrentChat] = useState(undefined);

    useEffect(() => {
        const checkUser = async () => {
            const user = await JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
            } else {
                setCurrentUser(user);
            }
        }
        checkUser();
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    try {
                        const { data } = await axios.get(`${AllUsers}/${currentUser._id}`);
                        setContacts(data);
                    } catch (error) {
                        console.error('Error fetching contacts:', error);
                    }
                } else {
                    navigate('/setAvatar');
                }
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, [currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Container>
            <div className="chat-container">
                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                        {currentChat === undefined ? (
                            <Welcome currentUser={currentUser} />
                        ) : (
                            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                        )}
                    </>
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  padding: 1rem;

  .chat-container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 0.5rem;
    overflow: hidden;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 100%;
      grid-template-rows: 40% 60%;
      height: 90vh;
    }

    @media screen and (max-width: 480px) {
      grid-template-columns: 100%;
      grid-template-rows: 45% 55%;
      width: 95vw;
    }
  }

  .loading {
    font-size: 1.5rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

export default Chats;
