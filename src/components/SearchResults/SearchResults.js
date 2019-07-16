import React from 'react';
import {
    Navbar,
    NavItem,
    Icon
} from 'react-materialize';
import './SearchResults.css';
import { Redirect } from "react-router-dom";
import NavHeader from '../NavHeader/NavHeader';


class SearchResults extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const searchQuery = this.props.match.params.title;
        console.log(searchQuery);
    }

    render() {
        return <div></div>
    }
}

export default SearchResults;
