import React from 'react';
import {
    Container,
    CardPanel,
    Button,
    Icon
} from 'react-materialize';
import axios from "axios";
import { Redirect, Link } from "react-router-dom";

import './Dashboard.css';

import RatingStars from '../RatingStars/RatingStars';
import NavHeader from '../NavHeader/NavHeader';
import Utils from '../../Utils';
import BookCard from '../BookCard/BookCard';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ratings: [],
            ratingsTitle: '',
            isAdmin: false,
            ratingsSuccess: false,
            isLogged: true,
            enableSearch: false,
            searchQuery: ''
        };

    }

    componentWillMount() {

        Utils.isLogged().then(isLogged => {
            if (isLogged) {

                this.setState({
                    isAdmin: (isLogged === Utils.UserType.ADMIN),
                    isLogged: true
                });

                axios.get(`${Utils.backend}/ratings${this.state.isAdmin ? '' : '/user'}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then((response) => {

                    if (response.data.length === 0) {
                        this.setState({
                            ratingsSuccess: false
                        });
                    } else {
                        this.setState({
                            ratingsSuccess: true,
                            ratings: response.data
                        });
                    }

                }).catch(() => {
                    this.setState({
                        ratingsSuccess: false
                    });
                });
            } else {
                this.setState({
                    isLogged: false
                });
            }
        });

    }

    render() {
        return (
            // To-do loaders
            <div>
                {this.state.isLogged ? '' : <Redirect to='/' />}
                <NavHeader />
                <Container className="dashboardContainer">
                    {
                        (this.state.isAdmin) ?
                            <Link to="/cadastrar-livro">
                                <Button className="cadastrarLivroButton">
                                    Cadastrar livro
                                    <Icon right>open_in_new</Icon>
                                </Button>
                            </Link> : ''
                    }
                    <h4>{this.state.isAdmin ? 'Últimas avaliações' : 'Suas últimas avaliações'}</h4>

                    {
                        this.state.ratingsSuccess ? this.state.ratings.map((rating) => (
                            <BookCard key={rating.book.title} book={rating.book}
                                actions={[<RatingStars key={'rs' + rating.book.title} bookTitle={rating.book.title} rating={rating.rating} />]} >
                            </BookCard>
                        )) :
                            <CardPanel className="grey noRatings white-text">
                                <Icon large color="white">error_outline</Icon><br></br>
                                <span>
                                    Nada a mostrar.
                                </span>
                            </CardPanel>
                    }
                </Container>
            </div>
        );
    }
}

export default Dashboard;