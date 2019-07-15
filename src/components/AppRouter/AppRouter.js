import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from '../Home/Home';
import Dashboard from '../Dashboard/Dashboard';



function AppRouter() {
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
        </Router>
    );
}

export default AppRouter;