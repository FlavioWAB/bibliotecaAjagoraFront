import React from "react";
import { CardPanel, Preloader, TextInput, Switch, Button, Icon } from "react-materialize";
import "./UserForm.css";
import axios from "axios";

import Utils from '../../Utils';

class UserForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPassword: true,
            isSubmitting: false,
            submitFailed: false,
            submitSuccess: false,
            username: '',
            firstName: '',
            lastName: '',
            password: ''
        }        

        this.showPassword = this.showPassword.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    showPassword(event) {
        this.setState({
            isPassword: !event.target.checked
        });
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

        axios.post(`${Utils.backend}/users`, {
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            admin: false
        }).then(() => {
            this.setState({
                isSubmitting: false,
                submitSuccess: true,
                submitFailed: false
            });
        }).catch((d) => {
            this.setState({
                isSubmitting: false,
                submitFailed: true
            });
        });

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="createForm">
                {this.state.submitSuccess ? this.props.loginCallback() : ''}
                {this.state.submitFailed ? <CardPanel className="red">
                    <span className="white-text">
                        Ocorreu um erro, tente novamente.
                    </span>
                </CardPanel> : ''}
                <TextInput onChange={this.handleInputChange}
                    required
                    label="Nome de usuário"
                    name="username" />
                <TextInput onChange={this.handleInputChange}
                    required
                    label="Nome"
                    name="firstName" />
                <TextInput onChange={this.handleInputChange}
                    required
                    label="Sobrenome"
                    name="lastName" />
                <div className="passwordContainer">
                    <TextInput onChange={this.handleInputChange}
                        required
                        password={this.state.isPassword}
                        label="Senha"
                        name="password" />
                    <Switch className="col" onChange={this.showPassword} offLabel="" onLabel="Mostrar senha" />
                </div>
                <div className="submitContainer">
                    <Button className="buttonLoaderWrapper" type="submit">
                        {this.state.isSubmitting ? <Preloader size="small" /> : <span>Enviar <Icon right>send</Icon></span>}
                    </Button>
                </div>
            </form>
        );
    }
}

export default UserForm;
