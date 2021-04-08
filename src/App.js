import React, {Component} from 'react';

import {Home} from './components/Home/Home'
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import {AppLayout} from "./components/AppLayout/AppLayout";
import {Redirect, Route, Switch} from 'react-router-dom';
import Order from "./components/Orders/Order/Order";
import {authenticationService} from "./_services/authentication.service";
import {history} from './_helpers/history';
import SignIn from "./components/SignIn/SignIn"
import User from "./components/Users/User/User";
import Profile from "./components/Profile/Profile";
import NotFound from "./components/NotFound";
import SignUpStep1 from "./components/SignUp/SignUp";
import TCAccept from "./components/SignUp/terms/TCAccept";
import {SignUpStep2} from "./components/SignUp/SignUp";

export default class App extends Component {

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
        // authenticationService.checkAuth();
        return (
            <Switch>
                <Route exact path="/sign_in" component={() => <SignIn history={history}/>}/>
                <Route exact path="/sign_up" component={SignUpStep1}/>
                <Route exact path="/fill_user_details" component={SignUpStep2}/>
                <Route exact path="/terms_and_conditions" component={TCAccept}/>
                <PrivateRoute path="/orders/order/:orderId" component={Order}/>
                <PrivateRoute exact path="/orders" component={Orders}/>
                <PrivateRoute exact path="/profile" component={Profile}/>
                <PrivateRoute path="/users/user/:userId" component={User} roles={['ADMIN']}/>
                <PrivateRoute exact path="/users" component={Users} roles={['ADMIN']}/>
                <PrivateRoute exact path="/" component={Home}/>
                <PrivateRoute exact path="/" component={Home}/>
                <Route component={NotFound}/>
            </Switch>
        );
    }
}

const PrivateRoute = ({component: Component, roles, ...rest}) => (
    <Route {...rest} render={(props) => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{pathname: '/sign_in', state: {from: props.location}}}/>
        }

        let userRoles = currentUser.roles.map(item => {
            return item.name;
        });

        let checker = (arr, target) => target.every(v => arr.includes(v));

        if (roles && !checker(userRoles, roles)) {
            return <Redirect to={{pathname: '/'}}/>
        }

        return (
            <AppLayout history={history}>
                <Component {...props} />
            </AppLayout>
        );
    }}/>
);
