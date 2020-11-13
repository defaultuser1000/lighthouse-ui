import React from 'react';
import './Order.scss'
import ContentLoader from "react-content-loader"
import {
    Segment,
    Breadcrumb,
    Divider,
    Form,
    Input,
    TextArea,
    ButtonGroup,
    Button,
    Label,
    SegmentGroup, Header
} from "semantic-ui-react";
import {handleResponse} from "../../../_helpers/handle-response";
import FilmsTable from "../Modal/FilmsTable/FilmsTable";
import {statusColor} from "../../../config/Constants";
import OrderFiles from "./OrderFiles/OrderFiles";

export default class Order extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            isAdmin: props.isAdmin,
            order: {
                orderStatus: {
                    displayName: ''
                },
                scanner: {
                    name: ''
                },
                orderType: {
                    name: ''
                },
                scanSize: {
                    size: ''
                },
                orderFilms: [],
                special: '',
                colorTones: '',
                contrast: '',
                density: '',
                frame: '',
                pack: '',
                express: '',
                afterOrderProcessed: '',
                transportCompany: {
                    name: ''
                },
                address: ''
            },
            orderOwner: {},
            orderCreator: {},
            isLoading: true,
            isPrinting: false,
            error: {},
            orderEditable: false
        };
        this.getOrderPdf = this.getOrderPdf.bind(this);
    }

    componentDidMount() {
        fetch(`/api/orders/order/` + this.props.match.params.orderId, {credentials: 'include'})
            .then(response => {
                return handleResponse(response);
            }).then(data => {
            this.setState({
                order: data,
                orderOwner: data.orderOwner,
                orderCreator: data.orderCreator,
                isLoading: false
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                error: {message: err},
                isLoading: false
            });
        });
    }

    getOrderPdf() {
        const order = this.state.order;
        this.setState({isPrinting: true});
        fetch(`/api/orders/order/` + order.orderId + `/generateReport`, {
            method: 'GET',
            responseType: 'blob',
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                return response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'Order #' + order.orderNumber + ' form.pdf';
                    a.click();
                });
            }
        }).finally(() => {
            this.setState({isPrinting: false});
        });
    }

    render() {
        return (
            <div className={'order d-flex justify-content-center align-items-center'}>
                <SegmentGroup horizontal>
                    <Segment className={'order-details'}>
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
                                            <rect x="5" y="0" rx="10" ry="10" width="80" height="20"/>
                                        </ContentLoader> :
                                        this.state.order.orderNumber
                                }</Breadcrumb.Section>
                            </Breadcrumb>
                        </React.Fragment>
                        <React.Fragment>
                            <Label
                                className={'status'}
                                color={this.state.order.orderStatus ? statusColor.get(this.state.order.orderStatus.displayName.toLowerCase()) : null}
                                key={this.state.order.orderStatus ? statusColor.get(this.state.order.orderStatus.displayName.toLowerCase()) : null}
                            >
                                {this.state.order.orderStatus.displayName}
                            </Label>
                            <ButtonGroup>
                                <Button loading={this.state.isLoading || this.state.isPrinting} icon={'refresh'}
                                        onClick={() => {
                                            window.location.reload()
                                        }}/>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button loading={this.state.isLoading || this.state.isPrinting} icon={'print'}
                                        onClick={this.getOrderPdf}/>
                            </ButtonGroup>
                        </React.Fragment>
                        <Divider/>
                        <Segment className={'order-details-content'} basic>
                            <Form className={'order-details-scrollable'}
                                  loading={this.state.isLoading}
                                  size={'large'}
                            >
                                {this.state.isAdmin && <Form.Group widths={"two"}>
                                    <Form.Field
                                        control={Input}
                                        label='Order Owner'
                                        value={[this.state.orderOwner.firstname, this.state.orderOwner.lastname].join(' ')}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label='Order Creator'
                                        value={[this.state.orderCreator.firstname, this.state.orderCreator.lastname].join(' ')}
                                        readOnly={!this.state.orderEditable}
                                    />
                                </Form.Group>}
                                <Form.Group widths={'equal'}>
                                    <Form.Field
                                        control={Input}
                                        label='Scanner'
                                        value={this.state.order.scanner.name}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label={'Order Type'}
                                        value={this.state.order.orderType.name}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label={'Scan Size'}
                                        value={this.state.order.scanSize.size}
                                        readOnly={!this.state.orderEditable}
                                    />
                                </Form.Group>
                                <Form.Group widths={"equal"}>
                                    <Form.Field
                                        control={Input}
                                        label='Skin Tones'
                                        value={this.state.order.colorTones}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label='Contrast'
                                        value={this.state.order.contrast}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label='Density'
                                        value={this.state.order.density}
                                        readOnly={!this.state.orderEditable}
                                    />
                                </Form.Group>
                                <Form.Group widths={"equal"}>
                                    <Form.Field
                                        control={Input}
                                        label='Frame'
                                        value={this.state.order.frame ? this.state.order.frame : 'No'}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label='Package'
                                        value={this.state.order.pack}
                                        readOnly={!this.state.orderEditable}
                                    />
                                    <Form.Field
                                        control={Input}
                                        label='Express'
                                        value={this.state.order.express ? this.state.order.express : 'No'}
                                        readOnly={!this.state.orderEditable}
                                    />
                                </Form.Group>
                                <Form.Field
                                    control={TextArea}
                                    rows={5}
                                    label='Special'
                                    value={this.state.order.special}
                                    readOnly={!this.state.orderEditable}
                                />
                                {this.state.order.orderFilms.length > 0 &&
                                <Form.Field>
                                    <label>Order Films</label>
                                    <FilmsTable scanResolutions={this.state} rows={this.state.order.orderFilms}
                                                editable={false}/>
                                </Form.Field>
                                }
                            </Form>
                        </Segment>
                    </Segment>
                    <Segment className={'order-files'}>
                        <React.Fragment>
                            <Header className={'order-files-header'}>Order Files</Header>
                        </React.Fragment>
                        <Divider/>
                        <React.Fragment>
                            <OrderFiles key={Math.random()} orderId={this.state.order.orderId}/>
                        </React.Fragment>
                    </Segment>
                </SegmentGroup>
            </div>
        );
    }
}