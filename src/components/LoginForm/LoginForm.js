import React from 'react';
import { CardPanel, Icon, TextInput, Button, Preloader } from 'react-materialize';
import './LoginForm.css';
import axios from "axios";


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

        this.backend = 'https://library-rating.herokuapp.com/api/v1';

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
        })

        axios.post(this.backend + '/authentication/login', {
            username: this.state.username,
            password: this.state.password
        }).then(() => {
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
                <TextInput onChange={this.handleInputChange} required label="Nome de usuário" name="username" />
                <TextInput onChange={this.handleInputChange} error="Wrong Email sir" required password={true} label="Senha" name="password" />
                <Button type="submit" waves="light">
                    {this.state.logged ? <Icon right>done</Icon> : this.state.isSubmitting ? <Preloader color="yellow" size="small" /> : <span>Entrar <Icon right>send</Icon></span>}
                </Button>
            </form>
        );
    }
}

export default LoginForm;