import React, {Component} from 'react';

import {Home} from './components/Home/Home'
import Orders from './components/Orders/Orders';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import {AppLayout} from "./components/AppLayout/AppLayout";
import {Redirect, Route, Switch} from 'react-router-dom';
import SideBar from "./components/SideBar/SideBar";
import Order from "./components/Orders/Order/Order";
import Register from "./components/Register/Register";

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100) // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100) // fake async
    }
};

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login" component={() => <Login fakeAuth={fakeAuth}/>}/>
                <Route exact path="/register" component={Register}/>
                <AppLayout>
                    <SideBar/>
                    <Route path="/orders/order/" component={Order}/>
                    <PrivateRoute exact path="/orders" component={Orders}/>
                    <PrivateRoute exact path="/users" component={Users}/>
                    <PrivateRoute exact path="/" component={Home}/>
                </AppLayout>
            </Switch>
        );
    }
}

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        fakeAuth.isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to='/login'/>
    )}/>
);
