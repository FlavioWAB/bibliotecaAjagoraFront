import React from 'react';
import {
    Container,
    CardPanel,
    Navbar,
    Button,
    Icon,
    Card,
    CardTitle
} from 'react-materialize';
import axios from "axios";
import './Dashboard.css';
import RatingStars from '../RatingStars/RatingStars';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ratings: [],
            ratingsTitle: '',
            isAdmin: false,
            ratingsSuccess: false
        };

        this.backend = 'http://localhost:5000/api/v1';
        // TO-DO retirar login, verificar logo de cara.
        axios.post(this.backend + '/authentication/login', {
            username: 'flavios',
            password: 'flavio'
        }, {
                withCredentials: true
            }).then(() => {
                axios.get(this.backend + '/authentication/logged', {
                    withCredentials: true
                }).then((response) => {
                    let data = response.data;
                    if (data) {

                        this.setState({
                            isAdmin: (data === 1)
                        });

                        axios.get(this.backend + '/ratings' + (this.state.isAdmin ? '' : '/user'), {
                            withCredentials: true
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
                        // TO-DO redirecionar para a página de login
                        console.log(data);
                    }
                }).catch((response) => {
                    // TO-DO redirecionar para a página de login
                    console.log(response);
                });
            })
    }

    render() {
        return (
            // To-do loaders
            <div>
                <Navbar alignLinks="right" search>
                </Navbar>

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