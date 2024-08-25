import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import Home from "./core/Home";
import Dashboard from "./user/UserDashboard";
import PrivateRoute from './routes/PrivateRoute';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <PrivateRoute path="/dashboard" exact component={Dashboard} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
