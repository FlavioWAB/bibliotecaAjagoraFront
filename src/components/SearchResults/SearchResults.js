import React from 'react';
import {
    Preloader, Button, Container, CardPanel, Icon
} from 'react-materialize';
import './SearchResults.css';
import { Redirect, Link } from "react-router-dom";
import Materialize from "materialize-css";
import axios from 'axios';

import NavHeader from '../NavHeader/NavHeader';
import Utils from '../../Utils';
import BookCard from '../BookCard/BookCard';


class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: true,
            books: [],
            searchQuery: '',
            isSearching: true,
            searchSuccess: true
        }
    }

    componentWillMount() {
        Utils.isLogged().then(isLogged => {
            this.setState({
                isLogged: isLogged
            });
            this.populateSearch(this.props.match.params.title);
        });
    }

    componentWillReceiveProps(props) {
        this.populateSearch(props.match.params.title);
        // Workaround (A.K.A. Gambiarra) pra fechar a barra lateral quando ocorrer uma busca na página de busca.
        Materialize.Sidenav.getInstance(document.getElementById('mobile-nav')).close();
    }

    populateSearch(query) {
        this.setState({
            searchQuery: query,
            isSearching: true
        });
        axios.get(`${Utils.backend}/books/title/${query}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {

            if (response.data.length === 0) {
                this.setState({
                    searchSuccess: false,
                    isSearching: false
                })
            } else {
                this.setState({
                    books: response.data,
                    searchSuccess: true,
                    isSearching: false
                })
            }

        }).catch(() => {
            this.setState({
                searchSuccess: false,
                isSearching: false
            });
        });
    }

    render() {
        return (
            <div>
                {this.state.isLogged ? '' : <Redirect to='/' />}
                <NavHeader />
                <Container className="searchResultsContainer">
                    <h4 className="searchQueryLabel">Resultados para "{this.state.searchQuery}"</h4>
                    {
                        this.state.isSearching ?
                            <Preloader className="searchLoader" size="big" color="blue" /> :
                            this.state.searchSuccess ?
                                <div>

                                    {this.state.books.map((book) => (
                                        <BookCard book={book} actions={[
                                            <div className="bookDetailsContainer">
                                                <Link to={`/detalhes/${book.id}`}><Button>Detalhes</Button></Link>
                                            </div>
                                        ]}></BookCard>
                                    ))}
                                </div> :
                                <CardPanel className="grey noRatings white-text">
                                    <Icon large color="white">error_outline</Icon><br></br>
                                    <span>
                                        Nenhum livro corresponde à pesquisa.
                                    </span>
                                </CardPanel>
                    }
                </Container>
            </div>
        )
    }
}

export default SearchResults;
