import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../Home/Home";
import Dashboard from "../Dashboard/Dashboard";
import UserForm from "../UserForm/UserForm";
import SearchResults from "../SearchResults/SearchResults";
import BookDetails from "../BookDetails/BookDetails";
import BookEdit from "../BookEdit/BookEdit";
import BookForm from "../BookForm/BookForm";

function AppRouter() {
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/criar-usuario" component={UserForm} />
            <Route path="/procurar/:title" component={SearchResults} />
            <Route path="/detalhes/:id" component={BookDetails} />
            <Route path="/editar-livro/:id" component={BookEdit} />
            <Route exact path="/cadastrar-livro/" component={BookForm} />
        </Router>
    );
}

export default AppRouter;