import React from 'react';
import {
    Container, Button, Icon, TextInput, Textarea, Preloader, CardPanel
} from 'react-materialize';
import './BookForm.css';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import NavHeader from '../NavHeader/NavHeader';
import FileInput from '../FileInput/FileInput';
import Utils from '../../Utils';


class BookForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogged: true,
            isSubmitting: false,
            submitFailed: false,
            submitSuccess: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        Utils.isLogged().then(isLogged => {
            this.setState({
                isLogged: isLogged === Utils.UserType.ADMIN
            });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        })
        var data = new FormData(event.target);

        axios.post(`${Utils.backend}/books`, data, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {
            this.setState({
                isSubmitting: false,
                submitFailed: false,
                bookId: response.data.id,
                submitSuccess: true
            });
        }).catch(() => {
            this.setState({
                isSubmitting: false,
                submitFailed: true
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.isLogged ? '' : <Redirect to='/' />}
                {this.state.submitSuccess ? <Redirect to={`/detalhes/${this.state.bookId}`} /> : ''}

                <NavHeader />
                <Container>
                    <h4 className="formTitle">Cadastrar livro</h4>
                    {this.state.submitFailed ? <CardPanel className="red">
                        <span className="white-text">
                            Ocorreu um erro, tente novamente.
                        </span>
                    </CardPanel> : ''}
                    <form onSubmit={this.handleSubmit} className="createBookForm">
                        <TextInput required label="Título" name="title" />
                        <TextInput required label="Autor" name="author" />
                        <TextInput required label="Editora" name="publisher" />
                        <Textarea required label="Descrição" name="description" />
                        <FileInput required name="thumbnail" />
                        <div className="submitContainer">
                            <Button className="buttonLoaderWrapper" type="submit">
                                {this.state.isSubmitting ? <Preloader size="small" /> : <span>Enviar <Icon right>send</Icon></span>}
                            </Button>
                        </div>
                    </form>
                </Container>
            </div>
        )
    }
}

export default BookForm;