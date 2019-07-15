import React from 'react';
import { Container } from 'react-materialize';
import { Redirect } from "react-router-dom";
import axios from "axios";
import logo from '../../images/logo.png';
import LoginForm from '../LoginForm/LoginForm';
import './Home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false
        }
        axios.get(this.backend + '/authentication/logged', {
            withCredentials: true
        }).then((response) => {
            let data = response.data;
            if (data) {
                this.setState({
                    isLogged: true
                });
            }
        });
    }

    render() {
        return (
            <Container>
                {this.state.isLogged ? <Redirect to='/dashboard' /> : ''}
                <img src={logo} className="App-logo" alt="logo" />
                <LoginForm />
            </Container>
        );
    }
}

export default Home;