import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import Message from './Message';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
import { sendMessageRoute, getAllMessageRoute } from '../utils/APIRoutes';

function ChatContainer({ currentChat, currentUser, socket }) {

    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const getMessage = async () => {
            await axios.post(getAllMessageRoute, {
                from: currentChat._id,
                to: currentChat._id
            })
                .then((res) => {
                    setMessages(res.data);
                }).catch((err) => {
                    console.log('Error fetching messages ', err);
                });
        }
        if (currentChat) {
            getMessage();
        }
    }, [currentChat])

    const handleSendMsg = async (msg) => {
        axios.post(sendMessageRoute, {
            message: msg,
            from: currentUser._id,
            to: currentChat._id
        }).catch((err) => console.log(err));

        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        });

        const msgs = [...messages];
        msgs.push({ fromself: true, message: msg });
        setMessages(msgs);
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromself: false, message: msg })
            })
        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>

            <div className='chat-messages'>
                {messages.map((msg) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${msg.fromself ? "sended" : "recieved"}`}>
                                <div className="content">
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />

        </Container>
    );
}

const Container = styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px){
    grid-template-rows: 15% 70% 15%;
}
.chat-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details{
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar{
            img{
                height: 3rem;
            }
        }
        .username{
            h3{
                color:white;
            }
        }
    }
}

.chat-messages{
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar{
        width: 0.2rem;
        &-thumb{
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }
    .message{
        display: flex;
        align-items: center;
        .content{
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
            color: #d1d1d1;
        }
    }
    .sended{
        justify-content: flex-end;
        .content{
            background-color: #4f04ff21;
        }
    }.recieved{
        justify-content: start;
        .content{
            background-color: #9900ff20;
        }
    }
} 
`;

export default ChatContainer;