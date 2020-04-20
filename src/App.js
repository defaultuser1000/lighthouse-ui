import React, {Component} from 'react';

import {Home} from './components/Home/Home'
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import {AppLayout} from "./components/AppLayout/AppLayout";
import {Redirect, Route, Switch} from 'react-router-dom';
import SideBar from "./components/SideBar/SideBar";
import Order from "./components/Orders/Order/Order";
import Register from "./components/Register/Register";
import { AuthenticationService } from "./_services/authentication.service";
import { history } from './_helpers/history';
import Login from "./components/Login/Login";
import User from "./components/Users/User/User";

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login" component={() => <Login history={history}/>}/>
                <Route exact path="/register" component={Register}/>
                <AppLayout history={history}>
                    <SideBar/>
                    <PrivateRoute path="/orders/order/:orderId" component={Order}/>
                    <PrivateRoute exact path="/orders" component={Orders}/>
                    <PrivateRoute path="/users/user/:userId" component={User}/>
                    <PrivateRoute exact path="/users" component={Users}/>
                    <PrivateRoute exact path="/" component={Home}/>
                </AppLayout>
            </Switch>
        );
    }
}

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        AuthenticationService.prototype.isUserLoggedIn()
            ? <Component {...props} />
            : <Redirect to='/login'/>
    )}/>
);
