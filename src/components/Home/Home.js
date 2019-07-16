import React from 'react';
import { Container, Button, Icon } from 'react-materialize';
import { Redirect } from "react-router-dom";
import logo from '../../images/logo.png';
import LoginForm from '../LoginForm/LoginForm';
import './Home.css';
import UserForm from '../UserForm/UserForm';
import axios from 'axios';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogged: false,
            createUser: false
        }

        this.backend = 'http://localhost:5000/api/v1';

        this.backToLogin = this.backToLogin.bind(this);

    }

    componentWillMount() {
        let token = localStorage.getItem('token');
        if (typeof token !== 'undefined') {
            axios.get(`${this.backend}/authentication/isLogged`, {
                headers: {
                    Authorization: token
                }
            }).then((response) => {
                if(response.data){
                    this.setState({
                        isLogged: true
                    })
                }
            });
        }
    }

    backToLogin() {
        this.setState({
            createUser: false
        });
    }

    createUser() {
        this.setState({
            createUser: true
        });
    }

    render() {
        return (
            <Container>
                <div className="logoContainer">
                    <img src={logo} className="ajagoraLogo" alt="logo" />
                </div>
                {this.state.isLogged ? <Redirect to='/dashboard' /> : ''}
                {
                    this.state.createUser ?
                        <div>
                            <Button onClick={this.backToLogin} type="button">
                                <span><Icon left>arrow_back</Icon> Voltar</span>
                            </Button>
                            <UserForm loginCallback={() => { return this.backToLogin() }} />
                        </div> : <LoginForm createUserCallback={() => { return this.createUser() }} />
                }
            </Container>
        );
    }
}

export default Home;