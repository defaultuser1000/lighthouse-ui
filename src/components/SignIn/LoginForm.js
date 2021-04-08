import React from 'react';

import {
    Button,
    Form,
    FormGroup,
    Grid,
    Image,
    Input, Message
} from "semantic-ui-react";
import logo from '../../assets/images/logo.png';
import {Link} from "react-router-dom";
import "./LoginForm.scss"
import {authenticationService} from "../../_services/authentication.service";

export default class LoginForm extends React.Component {

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
        return (
            <Grid textAlign='center'
                  style={{height: '100vh'}}
                  verticalAlign='middle'
            >
                <Grid.Column style={{maxWidth: 340}}>
                    <Image className='logo' src={logo} size='medium'/>
                    <Form className='login-form'>
                        {this.state.hasLoginFailed &&
                        <Message
                            negative
                            header='Error'
                            content={this.state.error}
                        />
                        }
                        <Input className='rounded-input'
                               fluid
                               icon='user'
                               iconPosition='left'
                               placeholder='Username'
                               type='username'
                               name='username'
                               autoComplete='on'
                               onChange={this.handleChange}
                        />
                        <Input className='rounded-input'
                               fluid
                               icon='lock'
                               iconPosition='left'
                               placeholder='Password'
                               type='password'
                               name='password'
                               autoComplete='on'
                               onChange={this.handleChange}
                        />
                        <FormGroup widths='equal'>
                        {/*    <FormCheckbox label='Remember me' name='remember'/>*/}
                            <Link className='field' to='/forgot-password'>Forgot password?</Link>
                        </FormGroup>
                        <Button className='login-button'
                                fluid
                                size='large'
                                onClick={this.loginClicked}
                                loading={this.state.authInProgress}
                                disabled={this.state.authInProgress}>Login</Button>
                        <FormGroup widths='equal' className='register-group'>
                            <span className='field'>Don't have an account?</span>
                            <Link className='field' to='/sign_up' id='register-link'>Register here</Link>
                        </FormGroup>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }

}