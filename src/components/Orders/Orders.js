import React from 'react';
import './Orders.scss';
import '../../styles/shared.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {ORDERS_FETCH_LINK} from "../../config/Constants";
import MaterialTable from "material-table";
import {Button as SemButton} from "semantic-ui-react";

import {Button, Col, Container, Modal, Row} from "react-bootstrap";

export default class Orders extends React.Component {

    state = {
        orders: [],
        isLoading: true,
        tableHeight: window.innerHeight - 247
    };

    modalShow = false;

    // constructor(props) {
    //     super(props);
    //     this.onRowClick = this.onRowClick.bind(this);
    // }
    //
    // onRowClick(event, rowData) {
    //     this.props.onViewItem(this.props.endpoint, rowData.id)
    // }

    componentDidMount() {
        fetch(ORDERS_FETCH_LINK)
            .then(results => results.json())
            .then(data => {
                this.setState({orders: data.orders, isLoading: false});
            }).catch(err => console.log(err))
    }

    render() {

        return (
            <>
                <div className='orders-table'>
                    <MaterialTable
                        isLoading={this.state.isLoading}
                        title="Orders"
                        columns={[
                            {
                                width: 5,
                                title: '#',
                                align: 'left',
                                field: 'orderNumber',
                                render: rowData => (
                                    <th scope="row"><a href={"/orders/order/" + rowData.id}>{rowData.orderNumber}</a>
                                    </th>
                                )
                            },
                            {
                                title: 'Client',
                                field: 'orderOwner',
                                align: 'left',
                                render: rowData =>
                                    (
                                        [rowData.orderOwner.firstname, rowData.orderOwner.lastname].join(' ')
                                    )
                            },
                            {
                                title: 'Status',
                                field: 'orderStatus',
                                render: rowData => (
                                    <span
                                        className={['status', 'status-pill', 'status-' + rowData.orderStatus.toLowerCase()].join(' ')}>
                                    {rowData.orderStatus}
                                </span>
                                )
                            },
                            {title: 'Created At', field: 'creationDate', type: 'date'},
                            {title: 'Modified At', field: 'modificationDate', type: 'date', defaultSort: 'desc'}
                        ]}
                        data={this.state.orders}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Create new order',
                                position: 'toolbar',
                                onClick: () => (<SemButton onClick={
                                    this.modalShow = true
                                    // this.props.history.push('/orders/create')
                                }/>)
                            },
                            {
                                icon: 'print',
                                tooltip: 'Print Order Form',
                                position: 'row',
                                onClick: (event, rowData) => (window.alert("You printed form Order #" + rowData.orderNumber + " (" + rowData.orderForm + ")"))
                            }
                            // ,
                            // {
                            //     icon: 'refresh',
                            //     tooltip: 'Refresh Data',
                            //     isFreeAction: true,
                            //     onClick: () => this.tableRef.current.onQueryChange()
                            // }

                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 10,
                            pageSizeOptions: [10, 25, 50, {value: this.state.orders.length, label: 'All'}],
                            minBodyHeight: this.state.tableHeight,
                            maxBodyHeight: this.state.tableHeight,
                            exportButton: true,
                            exportFileName: 'orders_' +
                                new Date().getFullYear() +
                                new Date().getUTCMonth() +
                                new Date().getUTCDate() +
                                new Date().getHours() +
                                new Date().getMinutes() +
                                new Date().getSeconds()
                        }}
                    />
                </div>

                {/*Modal form for new order*/}
                <Modal show={this.modalShow} aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Using Grid in Modal
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row className="show-grid">
                                <Col xs={12} md={8}>
                                    <code>.col-xs-12 .col-md-8</code>
                                </Col>
                                <Col xs={6} md={4}>
                                    <code>.col-xs-6 .col-md-4</code>
                                </Col>
                            </Row>

                            <Row className="show-grid">
                                <Col xs={6} md={4}>
                                    <code>.col-xs-6 .col-md-4</code>
                                </Col>
                                <Col xs={6} md={4}>
                                    <code>.col-xs-6 .col-md-4</code>
                                </Col>
                                <Col xs={6} md={4}>
                                    <code>.col-xs-6 .col-md-4</code>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.modalShow = false}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}