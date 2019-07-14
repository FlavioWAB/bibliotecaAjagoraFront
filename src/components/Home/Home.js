import React from 'react';
import { Container } from 'react-materialize';
import logo from '../../images/logo.png';
import './Home.css';
import LoginForm  from '../LoginForm/LoginForm';

class Home extends React.Component {
    render() {
        return (
            <Container>
                <img src={logo} className="App-logo" alt="logo" />
                <LoginForm />
            </Container>
        );
    }
}

export default Home;