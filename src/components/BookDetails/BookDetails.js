import React from 'react';
import {
    Preloader, Container, MediaBox, Row, Col, Button, Icon
} from 'react-materialize';
import './BookDetails.css';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';

import NavHeader from '../NavHeader/NavHeader';
import Utils from '../../Utils';
import RatingStars from '../RatingStars/RatingStars';


class BookDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: true,
            isLoading: true,
            isAdmin: false,
            selectedRating: '',
            book: {}
        }

        this.setRatings = this.setRatings.bind(this);
        this.clearRatings = this.clearRatings.bind(this);
        this.sendRating = this.sendRating.bind(this);
    }

    componentWillMount() {
        Utils.isLogged().then(isLogged => {
            this.setState({
                isLogged: isLogged,
                isAdmin: isLogged === Utils.UserType.ADMIN
            });
            this.loadDetails(this.props.match.params.id);
        });
    }

    loadDetails(id) {

        this.setState({
            isLoading: true,
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
                axios.get(`${Utils.backend}/ratings/user/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then((ratingResponse) => {
                    this.setState({
                        book: response.data[0],
                        querySuccess: true,
                        isLoading: false,
                        hasRating: true,
                        userRating: ratingResponse.data.rating,
                        selectedRating: ratingResponse.data.rating,
                    });
                }).catch(() => {
                    this.setState({
                        book: response.data[0],
                        querySuccess: true,
                        isLoading: false,
                        hasRating: false
                    });
                });
            }

        }).catch(() => {
            this.setState({
                querySuccess: false,
                isLoading: false
            });
        });
    }

    setRatings(index) {
        this.setState({
            selectedRating: index
        })
    }

    clearRatings() {
        if (this.state.hasRating) {
            this.setState({
                selectedRating: this.state.userRating
            })
        } else {
            this.setState({
                selectedRating: ''
            })
        }
    }

    sendRating() {
        var rating = this.state.selectedRating;

        if (this.state.hasRating) {
            axios.put(`${Utils.backend}/ratings`, {
                bookId: this.props.match.params.id,
                rating: rating
            }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then((response) => {
                    this.setState({
                        hasRating: true,
                        userRating: rating
                    })
                });

        } else {
            axios.post(`${Utils.backend}/ratings`, {
                bookId: this.props.match.params.id,
                rating: rating
            }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then((response) => {
                    this.setState({
                        hasRating: true,
                        userRating: rating
                    })
                });
        }
    }

    render() {
        return (
            <div>
                {this.state.isLogged ? '' : <Redirect to='/' />}
                <NavHeader />
                <Container>
                    {
                        this.state.isLoading ?
                            <Preloader className="fullPageLoader" size="big" /> :
                            <section className="detalhesContainer">
                                <Row className="flexRow">
                                    <Col l={6} className="bookDetailsThumbnailCol">
                                        {
                                            this.state.isAdmin ?
                                                <Link to={`/editar-livro/${this.state.bookId}`}>
                                                    <Button className="editButton">
                                                        Editar<Icon right>edit</Icon>
                                                    </Button>
                                                </Link> : ''
                                        }
                                        <MediaBox>
                                            <img src={`${Utils.backend}/files/${this.state.book.thumbnail}`}
                                                height="400px"
                                                alt="Capa do livro" />
                                        </MediaBox>
                                    </Col>
                                    <Col className="titleColumn" l={6}>
                                        <span className="bookDetailsTitle">
                                            {this.state.book.title}
                                        </span><br />
                                        <span className="bookDetailsAuthor">
                                            Por {this.state.book.author}
                                        </span>
                                        <div className="ratingDetailsContainer">
                                            <div className="ratingReportContainer">
                                                <span className="ratingDetailsCount">
                                                    {
                                                        this.state.isAdmin ?
                                                            `${this.state.book.ratingCount} ${this.state.book.ratingCount === 1 ? 'Avaliação' : 'Avaliações'}`
                                                            : 'Avalie este livro'
                                                    }
                                                </span>

                                                {
                                                    this.state.isAdmin ?
                                                        <span className="ratingDetailsTotal">
                                                            <RatingStars bookTitle={this.state.book.title} rating={this.state.book.rating} />
                                                            {parseFloat(this.state.book.rating).toFixed(1)}
                                                        </span> :
                                                        <span className="ratingDetailsTotal">
                                                            <span className="ratingSpan">
                                                                {
                                                                    [1, 2, 3, 4, 5].map((index) => (
                                                                        <i className="ratingStar material-icons"
                                                                            onMouseEnter={() => { return this.setRatings(index) }}
                                                                            onMouseLeave={this.clearRatings}
                                                                            onClick={this.sendRating}
                                                                            key={`star${index}`}>
                                                                            {
                                                                                this.state.selectedRating < index ? 'star_outline' : 'star'
                                                                            }
                                                                        </i>
                                                                    ))
                                                                }

                                                            </span>
                                                            {this.state.selectedRating}
                                                        </span>
                                                }
                                            </div>
                                        </div>
                                        <p className="bookDetailsDescription">{this.state.book.description}<br /><br />Publicado por {this.state.book.publisher}</p>
                                    </Col>
                                </Row>
                            </section>

                    }
                </Container>
            </div >
        )
    }
}

export default BookDetails;
