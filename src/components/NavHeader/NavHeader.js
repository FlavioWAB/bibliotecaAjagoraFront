import React from 'react';
import {
    Navbar,
    NavItem,
    Icon
} from 'react-materialize';
import './NavHeader.css';
import { Redirect, Link } from "react-router-dom";

class NavHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogged: true,
            enableSearch: false,
            searchSubmit: false
        };
        this.searchQuery = '';
        this.logout = this.logout.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    logout() {
        localStorage.removeItem('token');
        this.setState({
            isLogged: false
        });
    }

    handleSearchChange(e) {
        this.searchQuery = e.target.value;
    }

    handleSearch(e) {
        e.preventDefault();
        this.setState({
            searchSubmit: true
        });
    }

    render() {
        return (
            <Navbar brand={<Link to="/dashboard"><span className="ajagoraBrand">Ajágora</span></Link>} alignLinks="right">
                {this.state.isLogged ? '' : <Redirect to='/' />}
                {this.state.searchSubmit ? <Redirect to={`/procurar/${this.searchQuery}`} /> : ''}
                <nav className="noShadow">
                    <div className="nav-wrapper">
                        <form onSubmit={this.handleSearch}>
                            <div className="input-field col">
                                <input ref="searchInput" type="search" onChange={this.handleSearchChange} />
                                <label className="label-icon">
                                    <i className="material-icons">search</i>
                                </label>
                                <i className="material-icons">close</i>
                            </div>
                        </form>
                    </div>
                </nav>
                <NavItem onClick={this.logout}>
                    Sair<Icon right>exit_to_app</Icon>
                </NavItem>
            </Navbar>
        )
    }
}

export default NavHeader;