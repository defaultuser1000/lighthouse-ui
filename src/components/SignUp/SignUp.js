import React from 'react';
import {
    Button,
    Form, FormButton, FormCheckbox,
    FormField,
    FormGroup,
    Grid,
    GridColumn,
    Header,
    Input,
    Label,
    Message, MessageContent,
    MessageHeader, MessageItem, Modal
} from "semantic-ui-react";
import {Link} from "react-router-dom";
import './SignUp.scss';
import {validateAll} from "indicative/validator";
import {handleResponse} from "../../_helpers/handle-response";
import serverside_errors from "../../config/serverside_errors";
import TermsOfCondition from "./terms/TermsOfCondition";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import Avatar from "react-avatar-edit";

export default class SignUpStep1 extends React.Component {

    state = {
        regInProgress: false,
        data: {
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
            acceptTerms: false
        },
        errors: {},
        registerError: '',
        showTermsModal: false
    };

    rules = {
        username: 'required|alpha_numeric|min:3|max:32',
        email: 'required|email',
        password: 'required|alpha_numeric|min:6|confirmed'
    };

    messages = {
        required: 'The {{ field }} is required',
        'email.email': 'The email is invalid.',
        'password.confirmed': 'The password does not match.'
    };

    handleChange = (event) => {
        let {data} = this.state;
        data[event.target.name] = event.target.value;

        this.setState({data: data});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const {data} = this.state;

        validateAll(data, this.rules, this.messages).then(() => {
            console.log('Validation success');
            if (!this.state.data.acceptTerms) {
                this.setState({showTermsModal: true});
            } else {
                this.createUser();
            }
        }).catch(errors => {
            console.error('Validation errors', errors);

            const formattedErrors = this.state.errors;
            errors.forEach(error => formattedErrors[error.field] = error.message);
            this.setState({errors: formattedErrors});

        });
    };

    checkBoxChange = (event, data) => {
        let userData = this.state.data;
        userData.acceptTerms = data.checked;

        this.setState({data: userData});
    };

    accept = () => {
        if (!this.state.data.acceptTerms) {
            alert('In order to proceed You need to accept our terms and conditions...');
        } else {
            this.createUser();
        }
    };

    createUser = () => {
        const {data} = this.state;

        this.setState({regInProgress: true});
        fetch(
            `/api/users/sign-up`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            }
        ).then((response) => {
            return handleResponse(response);
        }).then((token) => {
            sessionStorage.setItem('register_token', token);
            this.props.history.push('/fill_user_details');
        }).catch((error) => {
            this.setState({showTermsModal: false, registerError: error.message});
        }).finally(() => {
            this.setState({regInProgress: false});
        });
    };

    render() {
        return (
            <>
                <Grid className='sign-up-body'
                      textAlign='center'
                      style={{height: '100vh'}}
                      verticalAlign='middle'
                >
                    <GridColumn className='sign-up-form-container' style={{maxWidth: 430}}>
                        <Header textAlign='center' size='large'>Become our customer</Header>
                        <Form className='sign-up-form'>
                            {
                                this.state.registerError &&
                                <Message negative>
                                    <MessageHeader>Error</MessageHeader>
                                    <MessageContent>
                                        {
                                            serverside_errors(this.state.registerError).map(line =>
                                                <MessageItem>{line}</MessageItem>
                                            )
                                        }
                                    </MessageContent>
                                </Message>
                            }
                            <FormField error={this.state.errors.username} required>
                                <Input
                                    className='rounded-input'
                                    placeholder='Username'
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='text'
                                    name='username'
                                    onChange={this.handleChange}
                                />
                                {
                                    this.state.errors.username &&
                                    <Label basic pointing color='red'>{this.state.errors.username}</Label>
                                }
                            </FormField>
                            <FormField error={this.state.errors.email}>
                                <Input
                                    className='rounded-input'
                                    placeholder='E-Mail'
                                    fluid
                                    icon='mail'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='email'
                                    name='email'
                                    onChange={this.handleChange}
                                />
                                {
                                    this.state.errors.email &&
                                    <Label basic pointing color='red'>{this.state.errors.email}</Label>
                                }
                            </FormField>
                            <FormField error={this.state.errors.password}>
                                <Input
                                    className='rounded-input'
                                    placeholder='Password'
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='password'
                                    name='password'
                                    onChange={this.handleChange}
                                />
                                {
                                    (this.state.errors.password
                                        && this.state.errors.password !== 'The password does not match.') &&
                                    <Label basic pointing color='red'>{this.state.errors.password}</Label>
                                }
                            </FormField>
                            <FormField error={
                                this.state.errors.password
                                && this.state.errors.password === 'The password does not match.'
                            }>
                                <Input className='rounded-input'
                                       placeholder='Confirm Password'
                                       fluid
                                       icon='lock'
                                       iconPosition='left'
                                       autoComplete='off'
                                       type='password'
                                       name='password_confirmation'
                                       onChange={this.handleChange}
                                />
                                {
                                    (this.state.errors.password
                                        && this.state.errors.password === 'The password does not match.') &&
                                    <Label basic pointing color='red'>{this.state.errors.password}</Label>
                                }
                            </FormField>
                            <Button fluid
                                    size='large'
                                    className='login-button'
                                    loading={this.state.regInProgress}
                                    disabled={this.state.regInProgress}
                                    onClick={this.handleSubmit}
                            >Register</Button>
                            <FormGroup widths='equal' className='login-group'>
                                <span className='field'>Already have an account?</span>
                                <Link className='field' to='/sign_in'>Sign in</Link>
                            </FormGroup>
                        </Form>
                    </GridColumn>
                </Grid>
                <Modal open={this.state.showTermsModal} onClose={() => {
                    this.setState({showTermsModal: false})
                }}>
                    <Modal.Header>Terms &amp; Conditions</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <FormGroup>
                                <TermsOfCondition/>
                            </FormGroup>
                            <FormGroup widths='2'>
                                <FormCheckbox label='I agree with terms and conditions'
                                              name='acceptTerms'
                                              checked={this.state.acceptTerms}
                                              onChange={this.checkBoxChange}
                                />
                                <FormButton onClick={this.accept}
                                            loading={this.state.regInProgress}
                                            disabled={this.state.regInProgress}
                                            floated='right'
                                >Next</FormButton>
                            </FormGroup>
                        </Form>
                    </Modal.Content>
                </Modal>
            </>
        );
    }

}

export class SignUpStep2 extends React.Component {

    state = {
        img: null,
        loading: true,
        userData: {
            firstName: '',
            secondName: '',
            lastName: '',
            birthDate: '',
            poneNumber: '',
            instagram: '',
            postalCode: undefined,
            country: '',
            city: '',
            address: '',
            avatar: null
        }
    };

    onClose = () => {
        let {userData} = this.state;
        userData.avatar = null;
        this.setState({userData: userData});
    };

    onCrop = (avatar) => {
        let {userData} = this.state;
        userData.avatar = avatar.replace('data:image/png;base64,', '');
        this.setState({userData: userData});
    };

    onImageLoad = (elem) => {
        let {userData} = this.state;
        userData.avatar = elem.replace('data:image/png;base64,', '');
        this.setState({userData: userData});
    };

    onBeforeFileLoad = (elem) => {
        if (elem.target.files[0].size > 71680) {
            alert("File is too big!");
            elem.target.value = "";
        }
    };

    handleChange = (event, data) => {
        let {userData} = this.state;

        if (event.target === null) {
            let dateValue = data.value;
            userData[data.name] = dateValue ? dateValue.toISOString() : dateValue;
        } else {
            userData[event.target.name] = event.target.value;
        }

        this.setState({userData: userData});
    };

    handleLater = () => {
        this.props.history.push('/');
    };

    handleSubmit = () => {

        let data = this.state.userData;
        const token = sessionStorage.getItem('register_token');

        let inst = data.instagram.split(',');

        let final = [];
        for (let i = 0; i < inst.length; i++) {
            let item = inst[i];
            item = item.trim();
            final.push(item);
        }
        data.instagram = final;

        if (token) {
            fetch(
                `/api/users/setUserDetails?token=${token}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT',
                    body: JSON.stringify(data)
                }
            ).then((response) => {
                return handleResponse(response);
            }).then(() => {
                sessionStorage.removeItem('register_token');
                this.props.history.push('/');
            }).catch((error) => {
                console.error(error);
            });
        }
    };

    componentDidMount() {
        this.setState({loading: false});
    }

    render() {

        return (
            <Grid className='sign-up-body'
                  textAlign='center'
                  style={{height: '100vh'}}
                  verticalAlign='middle'
            >
                <GridColumn className='sign-up-form-container' style={{maxWidth: 600}}>
                    <Header textAlign='center' size='large'>Fill user details</Header>
                    <Form className='sign-up-form'>
                        <FormGroup widths='equal'>
                            <FormField>
                                <Avatar
                                    label='Select avatar'
                                    width={268}
                                    height={268}
                                    onCrop={this.onCrop}
                                    onClose={this.onClose}
                                    onImageLoad={this.onImageLoad}
                                    onBeforeFileLoad={this.onBeforeFileLoad}
                                    src={this.state.userData.avatar}
                                />
                            </FormField>
                            <FormGroup className='field' widths='equal' grouped>
                                <FormField required>
                                    <Input
                                        className='rounded-input'
                                        placeholder='Name'
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        autoComplete='off'
                                        type='text'
                                        name='firstName'
                                        onChange={this.handleChange}
                                    />
                                </FormField>
                                <FormField>
                                    <Input
                                        className='rounded-input'
                                        placeholder='Patronymic'
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        autoComplete='off'
                                        type='text'
                                        name='secondName'
                                        onChange={this.handleChange}
                                    />
                                </FormField>
                                <FormField required>
                                    <Input
                                        className='rounded-input'
                                        placeholder='Surname'
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        autoComplete='off'
                                        type='text'
                                        name='lastName'
                                        onChange={this.handleChange}
                                    />
                                </FormField>
                            </FormGroup>
                        </FormGroup>
                        <FormGroup widths='2'>
                            <SemanticDatepicker className='rounded-input'
                                                iconPosition='left'
                                                showToday={false}
                                                format={'DD-MM-YYYY'}
                                                name='birthDay'
                                                value={this.state.userData.birthDate}
                                                onChange={this.handleChange}
                            />
                            <FormField>
                                <Input className='rounded-input'
                                       placeholder='Phone Number'
                                       fluid
                                       icon='phone'
                                       iconPosition='left'
                                       autoComplete='off'
                                       type='phone'
                                       name='phoneNumber'
                                       onChange={this.handleChange}
                                />
                            </FormField>
                        </FormGroup>
                        <FormField required>
                            <Input
                                className='rounded-input'
                                placeholder='Instagram accounts, coma-separated'
                                fluid
                                icon='instagram'
                                iconPosition='left'
                                autoComplete='off'
                                type='text'
                                name='instagram'
                                onChange={this.handleChange}
                            />
                        </FormField>
                        <FormGroup widths='equal'>
                            <FormField required>
                                <Input
                                    className='rounded-input'
                                    placeholder='Postal Code'
                                    fluid
                                    icon='hashtag'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='number'
                                    name='postalCode'
                                    onChange={this.handleChange}
                                />
                            </FormField>
                            <FormField required>
                                <Input
                                    className='rounded-input'
                                    placeholder='Country'
                                    fluid
                                    icon='globe'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='text'
                                    name='country'
                                    onChange={this.handleChange}
                                />
                            </FormField>
                            <FormField>
                                <Input
                                    className='rounded-input'
                                    placeholder='City'
                                    fluid
                                    icon='address card'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='text'
                                    name='city'
                                    onChange={this.handleChange}
                                />
                            </FormField>
                        </FormGroup>
                        <FormGroup widths='equal'>
                            <FormField>
                                <Input
                                    className='rounded-input'
                                    placeholder='Address'
                                    fluid
                                    icon='home'
                                    iconPosition='left'
                                    autoComplete='off'
                                    type='text'
                                    name='address'
                                    onChange={this.handleChange}
                                />
                            </FormField>
                        </FormGroup>
                        <FormGroup>
                            <Button fluid
                                    size='large'
                                    className='login-button'
                                // loading={this.state.regInProgress}
                                    disabled={this.state.loading}
                                    color='grey'
                                    onClick={this.handleLater}
                            >Later</Button>
                            <Button fluid
                                    size='large'
                                    className='login-button'
                                // loading={this.state.regInProgress}
                                    disabled={this.state.loading}
                                    onClick={this.handleSubmit}
                            >Save</Button>
                        </FormGroup>
                    </Form>
                </GridColumn>
            </Grid>
        );
    }

}