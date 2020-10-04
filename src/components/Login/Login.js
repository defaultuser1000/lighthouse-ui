import React from 'react';

import {authenticationService} from '../../_services/authentication.service';
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import './Login.scss';
import {Redirect} from "react-router-dom";

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authInProgress: false,
            error: '',
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.loginClicked = this.loginClicked.bind(this);
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    loginClicked() {
        this.setState({ authInProgress: true });
        authenticationService.login(this.state.username, this.state.password)
            .then(result => {
                if (result.hasLoginFailed) {
                    this.setState({
                        authInProgress: false,
                        hasLoginFailed: result.hasLoginFailed,
                        error: result.error
                    });
                } else {
                    this.setState({ authInProgress: false });
                }
            });
    }

    render() {
        if (authenticationService.currentUserValue) {
            return <Redirect to='/'/>;
        }

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>
                        <Segment stacked>
                            <Header as='h2' color='teal' textAlign='center'>Log-in to your account</Header>
                            {this.state.hasLoginFailed &&
                            <Message
                                negative
                                header='Error'
                                content={this.state.error}
                            />
                            }
                            {this.state.showSuccessMessage &&
                            <Message
                                success
                                header='You successfully logged in!'
                            />
                            }
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                type='username'
                                name='username'
                                autoComplete='on'
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                autoComplete='on'
                                onChange={this.handleChange}
                            />
                            <Button
                                fluid
                                color='teal'
                                size='large'
                                onClick={this.loginClicked}
                                loading={this.state.authInProgress}
                                disabled={this.state.authInProgress}
                            >Login</Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='/register'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}