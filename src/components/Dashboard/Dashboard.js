import React from 'react';
import {
    Container,
    CardPanel,
    Button,
    Icon,
    Card,
    CardTitle
} from 'react-materialize';
import axios from "axios";
import './Dashboard.css';
import RatingStars from '../RatingStars/RatingStars';
import { Redirect } from "react-router-dom";
import NavHeader from '../NavHeader/NavHeader';

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

        this.UserType = {
            UNLOGGED: 0,
            ADMIN: 1,
            USER: 2
        }

        this.backend = 'http://localhost:5000/api/v1';

    }

    componentWillMount() {
        let token = localStorage.getItem('token');
        if (typeof token !== 'undefined') {
            axios.get(`${this.backend}/authentication/isLogged`, {
                headers: {
                    Authorization: token
                }
            }).then((response) => {
                if (response.data) {

                    this.setState({
                        isAdmin: (response.data === this.UserType.ADMIN),
                        isLogged: true
                    });

                    axios.get(`${this.backend}/ratings${this.state.isAdmin ? '' : '/user'}`, {
                        headers: {
                            Authorization: token
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

            }).catch((response) => {
                this.setState({
                    isLogged: false
                });
            });
        }
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
                            <Button className="cadastrarLivroButton">
                                Cadastrar livro
                            <Icon right>open_in_new</Icon>
                            </Button> : ''
                    }
                    <h4>{this.state.isAdmin ? 'Últimas avaliações' : 'Suas últimas avaliações'}</h4>

                    {
                        this.state.ratingsSuccess ? this.state.ratings.map((rating) => (
                            <Card key={rating.book.title}
                                title={rating.book.title}
                                actions={[<RatingStars key={'rs' + rating.book.title} bookTitle={rating.book.title} rating={rating.rating} />]}
                                horizontal
                                header={<CardTitle image={this.backend + '/files/' + rating.book.thumbnail} />}>
                                Por {rating.book.author}<br />
                            </Card>
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