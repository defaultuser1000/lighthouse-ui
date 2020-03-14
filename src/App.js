import React, {Component} from 'react';

import {Home} from './components/Home/Home'
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import {AppLayout} from "./components/AppLayout/AppLayout";
import {Route, Switch} from 'react-router-dom';
import SideBar from "./components/SideBar/SideBar";
import Order from "./components/Orders/Order/Order";

export default class App extends Component {
    render() {
        return (
            <AppLayout>
                <SideBar/>
                <Switch>
                    <Route path="/orders/order/" component={Order}/>
                    <Route exact path="/orders" component={Orders}/>
                    <Route exact path="/users" component={Users}/>
                    <Route exact path="/" component={Home}/>
                </Switch>
            </AppLayout>
        );
    }
}
