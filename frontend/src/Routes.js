import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import Home from "./core/Home";
import UserDashboard from "./user/UserDashboard";
import AdminDashboard from "./user/AdminDashboard";
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AddCategory from "./admin/AddCategory";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <PrivateRoute path="/user/dashboard" exact component={UserDashboard} />
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
                <AdminRoute
                    path="/create/category"
                    exact
                    component={AddCategory}
                />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
