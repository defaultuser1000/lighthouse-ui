import React, {Component} from 'react';

import {Home} from './components/Home/Home'
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import {AppLayout} from "./components/AppLayout/AppLayout";
import {Redirect, Route, Switch} from 'react-router-dom';
import SideBar from "./components/SideBar/SideBar";
import Order from "./components/Orders/Order/Order";
import Register from "./components/Register/Register";
import {authenticationService} from "./_services/authentication.service";
import { history } from './_helpers/history';
import Login from "./components/Login/Login";
import User from "./components/Users/User/User";
import Profile from "./components/Profile/Profile";
// import { useAlert } from "react-alert";

export default class App extends Component {

    // alert = useAlert();

    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: authenticationService.isAdmin
        }));
    }

    render() {
        authenticationService.checkAuth();
        return (
            <Switch>
                <Route exact path="/login" component={() => <Login history={history}/>}/>
                <Route exact path="/register" component={Register}/>
                <AppLayout history={history}>
                    <SideBar/>
                    <PrivateRoute path="/orders/order/:orderId" component={Order}/>
                    <PrivateRoute exact path="/orders" component={Orders}/>
                    <PrivateRoute exact path="/profile" component={Profile}/>
                    <PrivateRoute path="/users/user/:userId" component={User} roles={['ADMIN']}/>
                    <PrivateRoute exact path="/users" component={Users} roles={['ADMIN']}/>
                    <PrivateRoute exact path="/" component={Home}/>
                </AppLayout>
            </Switch>
        );
    }
}

const PrivateRoute = ({component: Component, roles, ...rest}) => (
    <Route {...rest} render={(props) => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{pathname: '/login', state: { from: props.location } }} />
        }

        let userRoles = currentUser.roles.map(item => {
            return item.name;
        });

        let checker = (arr, target) => target.every(v => arr.includes(v));

        if (roles && !checker(userRoles, roles)) {
            return <Redirect to={{ pathname: '/' }}/>
        }

        return <Component {...props} />
    }}/>
);
