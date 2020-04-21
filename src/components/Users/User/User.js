import React from 'react';
import './User.scss'
import {Segment, Breadcrumb, Divider, Form, ButtonGroup, Button} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import {AuthenticationService} from "../../../_services/authentication.service";

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId,
            user: {},
            isLoading: true,
            error: {}
        };
    }

    componentDidMount() {
        fetch('https://lighthouse-back-dev.herokuapp.com' + `/users/user/` + this.props.match.params.userId)
            .then(results => {
                if (results.status === 200) {
                    return results.json();
                } else if (results.status === 401) {
                    throw new Error(results.status.toString())
                }
            })
            .then(data => {
                this.setState({
                    user: data,
                    isLoading: false
                });
            }).catch(err => {
                AuthenticationService.prototype.logout();
                return (<Redirect to="/login"/>);
        })
    }

    render() {
        return (
            <div className={'user d-flex justify-content-center align-items-center'}>
                <Segment>
                    <React.Fragment>
                        <Breadcrumb size='huge'>
                            <Breadcrumb.Section href='/'>Home</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section href='/users'>Users</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section active>User</Breadcrumb.Section>
                        </Breadcrumb>
                    </React.Fragment>
                    <React.Fragment>
                        <ButtonGroup>
                            <Button loading={this.state.isLoading} icon='refresh' onClick={() => {
                                window.location.reload()
                            }}></Button>
                        </ButtonGroup>
                    </React.Fragment>
                    <Divider/>
                    {/*<button onClick={() => {*/}
                    {/*    useAlert().show('Oh look, an alert!');*/}
                    {/*}}>Show</button>*/}
                    <React.Fragment>
                        <Form loading={this.state.isLoading}
                              size={'large'}>
                            {/*<Form.Group widths={"two"}>*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='Order Owner'*/}
                            {/*        value={[this.state.orderOwner.firstname, this.state.orderOwner.lastname].join(' ')}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='Order Creator'*/}
                            {/*        value={[this.state.orderCreator.firstname, this.state.orderCreator.lastname].join(' ')}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*</Form.Group>*/}
                            {/*<Form.Field*/}
                            {/*    control={Input}*/}
                            {/*    label='Scanner'*/}
                            {/*    value={this.state.user.scanner}*/}
                            {/*    editable='false'*/}
                            {/*/>*/}
                            {/*<Form.Group widths={"two"}>*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='Skin Tones'*/}
                            {/*        value={this.state.user.skinTones}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='Contrast'*/}
                            {/*        value={this.state.user.contrast}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*</Form.Group>*/}
                            {/*<Form.Group widths={"two"}>*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='B&W Contrast'*/}
                            {/*        value={this.state.user.bwContrast}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*    <Form.Field*/}
                            {/*        control={Input}*/}
                            {/*        label='Express'*/}
                            {/*        value={this.state.user.express}*/}
                            {/*        editable='false'*/}
                            {/*    />*/}
                            {/*</Form.Group>*/}
                            {/*<Form.Field*/}
                            {/*    control={TextArea}*/}
                            {/*    label='Special'*/}
                            {/*    value={this.state.user.special}*/}
                            {/*    editable='false'*/}
                            {/*/>*/}
                        </Form>
                    </React.Fragment>
                </Segment>
            </div>
        );
    }
}