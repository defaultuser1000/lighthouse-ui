import React from 'react';
import './Order.scss'
import ContentLoader from "react-content-loader"
import {Segment, Breadcrumb, Divider, Form, Input, TextArea, ButtonGroup, Button} from "semantic-ui-react";

export default class Order extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            isAdmin: props.isAdmin,
            order: {},
            orderOwner: {},
            orderCreator: {},
            isLoading: true,
            error: {}
        };
    }

    componentDidMount() {
        fetch(`/api/orders/order/` + this.props.match.params.orderId)
            .then(results => results.json())
            .then(data => {
                this.setState({
                    order: data,
                    orderOwner: data.orderOwner,
                    orderCreator: data.orderCreator,
                    isLoading: false
                });
            }).catch(err => {
                console.log(err);
                this.setState({
                    error: { message: err },
                    isLoading: false
                });
            })
    }

    render() {
        return (
            <div className={'order d-flex justify-content-center align-items-center'}>
                <Segment>
                    <React.Fragment>
                        <Breadcrumb size='huge'>
                            <Breadcrumb.Section href='/'>Home</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section href='/orders'>Orders</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section active>Order #{
                                this.state.isLoading ?
                                    <ContentLoader
                                        speed={2}
                                        width={90}
                                        height={20}
                                        viewBox="0 0 90 20"
                                        backgroundColor="#f9f9f9"
                                        foregroundColor="#d8d8d8"
                                    >
                                        <rect x="5" y="0" rx="10" ry="10" width="80" height="20" />
                                    </ContentLoader> :
                                    this.state.order.orderNumber
                            }</Breadcrumb.Section>
                        </Breadcrumb>
                    </React.Fragment>
                    <React.Fragment>
                        <ButtonGroup>
                            <Button loading={this.state.isLoading} icon='refresh' onClick={() => {window.location.reload()}}></Button>
                        </ButtonGroup>
                    </React.Fragment>
                    <Divider/>
                    {/*<button onClick={() => {*/}
                    {/*    useAlert().show('Oh look, an alert!');*/}
                    {/*}}>Show</button>*/}
                    <React.Fragment>
                        <Form loading={this.state.isLoading}
                              size={'large'}>
                            {this.state.isAdmin && <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='Order Owner'
                                    value={[this.state.orderOwner.firstname, this.state.orderOwner.lastname].join(' ')}
                                    editable='false'
                                />
                                <Form.Field
                                    control={Input}
                                    label='Order Creator'
                                    value={[this.state.orderCreator.firstname, this.state.orderCreator.lastname].join(' ')}
                                    editable='false'
                                />
                            </Form.Group>}
                            <Form.Field
                                control={Input}
                                label='Scanner'
                                value={this.state.order.scanner}
                                editable='false'
                            />
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='Skin Tones'
                                    value={this.state.order.skinTones}
                                    editable='false'
                                />
                                <Form.Field
                                    control={Input}
                                    label='Contrast'
                                    value={this.state.order.contrast}
                                    editable='false'
                                />
                            </Form.Group>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='B&W Contrast'
                                    value={this.state.order.bwContrast}
                                    editable='false'
                                />
                                <Form.Field
                                    control={Input}
                                    label='Express'
                                    value={this.state.order.express}
                                    editable='false'
                                />
                            </Form.Group>
                            <Form.Field
                                control={TextArea}
                                label='Special'
                                value={this.state.order.special}
                                editable='false'
                            />
                        </Form>
                    </React.Fragment>
                </Segment>
            </div>
        );
    }
}