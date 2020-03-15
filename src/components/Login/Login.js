import React from 'react';
import './Login.scss';
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import {Redirect} from "react-router-dom";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false
        };
        this.fakeAuth = props.fakeAuth;
    }

    login = () => {
        this.fakeAuth.authenticate(() => {
            this.setState(() => ({
                redirectToReferrer: true
            }))
        })
    };

    render() {
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to='/'/>
        }

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>
                        <Segment stacked>
                            <Header as='h2' color='teal' textAlign='center'>Log-in to your account</Header>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                type='email'
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                            />

                            <Button color='teal' fluid size='large' onClick={this.login}>Login</Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='/register'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
        // {/*<div className='login-main-div'>*/}
        // {/*    <Form>*/}
        // {/*        <Form.Field>*/}
        // {/*            <label>First Name</label>*/}
        // {/*            <input placeholder='First Name'/>*/}
        // {/*        </Form.Field>*/}
        // {/*        <Form.Field>*/}
        // {/*            <label>Last Name</label>*/}
        // {/*            <input placeholder='Last Name'/>*/}
        // {/*        </Form.Field>*/}
        // {/*        <Button type='submit' onClick={this.login}>Submit</Button>*/}
        // {/*    </Form>*/}
        // {/*</div>*/}
    }
}