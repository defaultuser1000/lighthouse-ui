import React from 'react';
import './Order.scss'
import {ORDER_1_FETCH_LINK} from "../../../config/Constants";
import ContentLoader from "react-content-loader"
import {Breadcrumb, Divider, Form, Input, TextArea} from "semantic-ui-react";

export default class Order extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: {},
            orderOwner: {},
            orderCreator: {},
            isLoading: true
        };
    }

    componentDidMount() {
        fetch(ORDER_1_FETCH_LINK)
            .then(results => results.json())
            .then(data => {
                this.setState({
                    order: data.order,
                    orderOwner: data.order.orderOwner,
                    orderCreator: data.order.orderCreator,
                    isLoading: false
                });
            }).catch(err => console.log(err))
    }

    render() {
        return (
            <div className={'order d-flex justify-content-center align-items-center'}>
                <React.Fragment>
                    <React.Fragment>
                        <Breadcrumb size='huge'>
                            <Breadcrumb.Section link href='/'>Home</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section link href='/orders'>Orders</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right chevron'/>
                            <Breadcrumb.Section active>Order #{
                                this.state.isLoading ?
                                    <ContentLoader
                                        speed={1.5}
                                        width={90}
                                        height={20}
                                        viewBox="0 0 90 20"
                                        backgroundColor="#f9f9f9"
                                        foregroundColor="#dbdbdb"
                                    >
                                        <rect x="5" y="5" rx="3" ry="3" width="90" height="20"/>
                                    </ContentLoader> :
                                    this.state.order.orderNumber
                            }</Breadcrumb.Section>
                        </Breadcrumb>
                    </React.Fragment>
                    <Divider/>
                    <React.Fragment>
                        <Form loading={this.state.isLoading}
                              size={'large'}>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='Order Owner'
                                    value={[this.state.orderOwner.firstname, this.state.orderOwner.lastname].join(' ')}
                                    editable={false}
                                />
                                <Form.Field
                                    control={Input}
                                    label='Order Creator'
                                    value={[this.state.orderCreator.firstname, this.state.orderCreator.lastname].join(' ')}
                                    editable={false}
                                />
                            </Form.Group>
                            <Form.Field
                                control={Input}
                                label='Scanner'
                                value={this.state.order.scanner}
                            />
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='Skin Tones'
                                    value={this.state.order.skinTones}
                                    editable={false}
                                />
                                <Form.Field
                                    control={Input}
                                    label='Contrast'
                                    value={this.state.order.contrast}
                                    editable={false}
                                />
                            </Form.Group>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Input}
                                    label='B&W Contrast'
                                    value={this.state.order.bwContrast}
                                    editable={false}
                                />
                                <Form.Field
                                    control={Input}
                                    label='Express'
                                    value={this.state.order.express}
                                    editable={false}
                                />
                            </Form.Group>
                            <Form.Field
                                control={TextArea}
                                label='Special'
                                value={this.state.order.special}
                                editable={false}
                            />
                        </Form>
                    </React.Fragment>
                </React.Fragment>
            </div>
        );
    }
}