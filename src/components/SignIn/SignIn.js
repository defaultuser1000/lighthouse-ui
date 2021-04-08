import React from 'react';

import {authenticationService} from '../../_services/authentication.service';
import {Grid, GridColumn} from "semantic-ui-react";
import './SignIn.scss';
import {Redirect} from "react-router-dom";
import LoginForm from "./LoginForm";
import LoginGallery from "./LoginGallery";
import Loading from "../Loading/Loading";

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 5000);
    }

    render() {
        if (authenticationService.currentUserValue) {
            return <Redirect to='/'/>;
        }

        return (
            <>
                {this.state.loading && <Loading style={{zIndex: 100}}/>}
                <Grid className={'login-page-container'}
                      textAlign='center'
                      style={{height: '100vh'}}
                      verticalAlign={'middle'}
                >
                    <GridColumn className={'login-form-container'} width={'9'}>
                        <LoginForm/>
                    </GridColumn>
                    <Grid.Column className={'gallery-container'} width={'7'}>
                        <LoginGallery/>
                    </Grid.Column>
                </Grid>
            </>
        )
    }
}