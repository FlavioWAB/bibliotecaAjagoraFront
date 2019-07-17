import React from 'react';
import { Container, Button, Icon } from 'react-materialize';
import { Redirect } from "react-router-dom";

import Logo from '../../images/logo.png';
import LoginForm from '../LoginForm/LoginForm';
import UserForm from '../UserForm/UserForm';
import Utils from '../../Utils';

import './Home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogged: false,
            createUser: false
        }

        this.backToLogin = this.backToLogin.bind(this);

    }

    componentWillMount() {
        Utils.isLogged().then(isLogged => {            
            this.setState({
                isLogged: isLogged
            });
        });
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
                    <img src={Logo} className="ajagoraLogo" alt="logo" />
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