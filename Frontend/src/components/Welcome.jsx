import React from 'react';
import styled from 'styled-components';
import robot from '../assests/robot.gif';
import Logout from './Logout';

function Welcome(currentUser) {
    return (
        <Container>
            <div className="logout">
                <Logout />
            </div>
            <div className="welcome">
                <img src={robot} alt="robot" />
                <h1>
                    Welcome, <span>{currentUser.currentUser.username}!</span>
                </h1>
                <h3>Please select a chat to start messaging</h3>
            </div>

        </Container>
    );
}

const Container = styled.div`
    .logout{
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: end;
        padding: 2rem;
    }
    .welcome{
        display:flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
        img{
            height: 20rem;
        }    
        span{
                color: #4e0eff !important;
            }
    }
`;

export default Welcome;