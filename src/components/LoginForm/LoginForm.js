import React from 'react';
import { CardPanel, Icon, TextInput, Button, Preloader } from 'react-materialize';
import './LoginForm.css';
import axios from "axios";
import { Redirect } from "react-router-dom";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isSubmitting: false,
            logged: false,
            loginFailed: false
        };

        this.backend = 'http://localhost:5000/api/v1';

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            isSubmitting: true
        });

        axios.post(`${this.backend}/authentication/login`, {
            username: this.state.username,
            password: this.state.password
        }).then((d) => {
            localStorage.setItem('token',`Bearer ${d.data.token}`);
            this.setState({
                isSubmitting: false,
                logged: true,
                loginFailed: false
            });
        }).catch(() => {
            this.setState({
                isSubmitting: false,
                logged: false,
                loginFailed: true
            });
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.state.loginFailed ? <CardPanel className="red">
                    <span className="white-text">
                        Nome e/ou usuário incorretos.
                    </span>
                </CardPanel> : ''}
                <TextInput onChange={this.handleInputChange}
                    required
                    label="Nome de usuário"
                    name="username" />
                <TextInput onChange={this.handleInputChange}
                    required
                    password
                    label="Senha"
                    name="password" />
                <div className="loginButtonsContainer">
                    <Button flat onClick={this.props.createUserCallback} type="button">
                        Criar usuário
                    </Button>
                    <Button className="buttonLoaderWrapper" type="submit">
                        {this.state.logged ? <div><Redirect to='/dashboard' /><Icon right>done</Icon></div> : this.state.isSubmitting ? <Preloader className="loginLoader" size="small" /> : <span>Entrar <Icon right>send</Icon></span>}
                    </Button>
                </div>
            </form>
        );
    }
}

export default LoginForm;