import React from 'react';
import {
    Container, Modal, Button, Preloader, CardPanel, ProgressBar
} from 'react-materialize';
import Materialize from "materialize-css";
import './BookEdit.css';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import NavHeader from '../NavHeader/NavHeader';
import Utils from '../../Utils';


class BookEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogged: true,
            isSubmitting: false,
            submitFailed: false,
            submitSuccess: false,
            book: {},
            querySuccess: true,
            isLoading: true,
            edit: {
                title: false,
                author: false,
                description: false,
                publisher: false
            },
            sendEdit: {
                title: false,
                author: false,
                description: false,
                publisher: false
            },
            isDeleting: false,
            deleted: false
        }

        this.confirmDelete = this.confirmDelete.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
        this.editField = this.editField.bind(this);
        this.sendThumbnail = this.sendThumbnail.bind(this);

    }

    componentWillMount() {
        Utils.isLogged().then(isLogged => {
            this.setState({
                isLogged: isLogged === Utils.UserType.ADMIN
            });
            this.loadDetails(this.props.match.params.id);
        });
    }

    loadDetails(id) {

        this.setState({
            bookId: id
        });

        axios.get(`${Utils.backend}/books/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {

            if (response.data.length === 0) {
                this.setState({
                    querySuccess: false,
                    isLoading: false
                })
            } else {
                this.setState({
                    isLoading: false,
                    book: response.data[0],
                    querySuccess: true
                });
            }

        }).catch(() => {
            this.setState({
                querySuccess: false,
                isLoading: false
            });
        });

    }

    dismissDelete() {
        Materialize.Modal.getInstance(document.getElementsByClassName('modal')[0]).close();
    }

    confirmDelete() {
        this.setState({
            isDeleting: true
        });

        axios.delete(`${Utils.backend}/books/${this.state.bookId}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(() => {
            this.setState({
                isDeleting: false,
                deleted: true
            })
        }).catch(() => {
            Materialize.Modal.getInstance(document.getElementsByClassName('modal')[0]).close();
            this.setState({
                isDeleting: false,
                querySuccess: false
            });
        });

    }

    editField(fieldName) {
        var editState = { ...this.state.edit }
        editState[fieldName] = !this.state.edit[fieldName];
        this.setState({ edit: editState });
    }

    submitUpdate(event) {
        const target = event.target;
        const value = target.value;
        const fieldName = target.name;
        var formData = new FormData();

        formData.append(fieldName, value);

        var tempUpdate = { ...this.state.sendEdit };
        tempUpdate[fieldName] = true;
        this.setState({
            sendEdit: tempUpdate
        })

        axios.put(`${Utils.backend}/books/${this.state.bookId}`, formData, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(() => {
            var editState = { ...this.state.edit };
            var tempBook = { ...this.state.book };
            var tempUpdate = { ...this.state.sendEdit };

            tempBook[fieldName] = value;
            editState[fieldName] = !this.state.edit[fieldName];
            tempUpdate[fieldName] = false;
            this.setState({
                sendEdit: tempUpdate
            })
            this.setState({
                edit: editState,
                book: tempBook
            });
        });

    }

    changeThumbnail() {
        document.getElementById('thumbnailInput').click();
    }

    sendThumbnail() {
        var formData = new FormData();

        formData.append('thumbnail',document.getElementById('thumbnailInput').files[0]);

        axios.put(`${Utils.backend}/books/${this.state.bookId}`, formData, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {
            var tempBook = { ...this.state.book };

            tempBook['thumbnail'] = response.data;

            this.setState({
                book: tempBook
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.isLogged ? '' : <Redirect to='/' />}
                {this.state.submitSuccess ? <Redirect to={`/detalhes/${this.state.bookId}`} /> : ''}
                {this.state.deleted ? <Redirect to='/dashboard' /> : ''}

                <NavHeader />
                {
                    this.state.isLoading ?
                        <Preloader className="fullPageLoader" size="big" /> :
                        <Container className="editBookContainer">

                            {
                                this.state.querySuccess ? '' : <CardPanel className="red">
                                    <span className="white-text">
                                        Ocorreu um erro, tente novamente.
                                    </span>
                                </CardPanel>
                            }
                            <h4 className="formTitle">Editar dados</h4>
                            <div className="editBookDataContainer">

                                <div className="editThumbnail">
                                    <img src={`${Utils.backend}/files/${this.state.book.thumbnail}`} />
                                    <div className="editThumbnailOverlay" onClick={this.changeThumbnail}>
                                        Trocar foto
                                        <i className="material-icons"
                                            onClick={() => { return this.editField('thumbnail') }}>edit</i>
                                    </div>
                                </div>

                                <input onChange={this.sendThumbnail} type="file" id="thumbnailInput" />

                                <div className="editBookFieldContainer">
                                    <h4>Título</h4>
                                    <div className="editBookValueContainer">
                                        {
                                            this.state.edit.title ?
                                                <div className="input-field">
                                                    <input type="text"
                                                        name="title"
                                                        onBlur={this.submitUpdate}
                                                        defaultValue={this.state.book.title} />
                                                    {this.state.sendEdit.title ? <ProgressBar /> : ''}
                                                </div> :
                                                <p className="editBookValue">{this.state.book.title}</p>
                                        }
                                        <i className="material-icons"
                                            onClick={() => { return this.editField('title') }}>
                                            {this.state.edit.title ? 'close' : 'edit'}
                                        </i>
                                    </div>
                                </div>

                                <div className="editBookFieldContainer">
                                    <h4>Autor</h4>
                                    <div className="editBookValueContainer">
                                        {
                                            this.state.edit.author ?
                                                <div className="input-field">
                                                    <input type="text"
                                                        name="author"
                                                        onBlur={this.submitUpdate}
                                                        defaultValue={this.state.book.author} />
                                                    {this.state.sendEdit.author ? <ProgressBar /> : ''}
                                                </div> :
                                                <p className="editBookValue">{this.state.book.author}</p>
                                        }
                                        <i className="material-icons"
                                            onClick={() => { return this.editField('author') }}>
                                            {this.state.edit.author ? 'close' : 'edit'}
                                        </i>
                                    </div>
                                </div>

                                <div className="editBookFieldContainer">
                                    <h4> Descrição</h4>
                                    <div className="editBookValueContainer">
                                        {
                                            this.state.edit.description ?
                                                <div className="input-field">
                                                    <textarea type="text"
                                                        name="description"
                                                        className="materialize-textarea"
                                                        onBlur={this.submitUpdate}
                                                        defaultValue={this.state.book.description} />
                                                    {this.state.sendEdit.description ? <ProgressBar /> : ''}
                                                </div> :
                                                <p className="editBookValue">{this.state.book.description}</p>
                                        }
                                        <i className="material-icons"
                                            onClick={() => { return this.editField('description') }}>
                                            {this.state.edit.description ? 'close' : 'edit'}
                                        </i>
                                    </div>
                                </div>

                                <div className="editBookFieldContainer">
                                    <h4>Editora</h4>
                                    <div className="editBookValueContainer">
                                        {
                                            this.state.edit.publisher ?
                                                <div className="input-field">
                                                    <input type="text"
                                                        name="publisher"
                                                        onBlur={this.submitUpdate}
                                                        defaultValue={this.state.book.publisher} />
                                                    {this.state.sendEdit.publisher ? <ProgressBar /> : ''}
                                                </div> :
                                                <p className="editBookValue">{this.state.book.publisher}</p>
                                        }
                                        <i className="material-icons"
                                            onClick={() => { return this.editField('publisher') }}>
                                            {this.state.edit.publisher ? 'close' : 'edit'}
                                        </i>
                                    </div>
                                </div>
                                <Modal
                                    header="Deletar livro"
                                    bottomSheet
                                    trigger={<Button className="deleteBookButton" flat>Deletar Livro</Button>}
                                    actions={
                                        <div className="submitContainer">
                                            <Button onClick={this.dismissDelete}>Cancelar</Button>
                                            <Button className="buttonLoaderWrapper" onClick={this.confirmDelete} flat>
                                                {this.state.isDeleting ? <Preloader size="small" /> : 'Confirmar'}
                                            </Button>
                                        </div>
                                    }>
                                    Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita.
                                </Modal>
                            </div>
                        </Container>
                }

            </div>
        )
    }
}

export default BookEdit;