import React from 'react';
import './Orders.scss';
import '../../styles/shared.scss'
// import 'bootstrap/dist/css/bootstrap.min.css';
import {config} from "../../config/Constants";
import MaterialTable from "material-table";
import {Checkbox, Form, Label, Modal, Select, TextArea} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {AuthenticationService} from "../../_services/authentication.service";

class Orders extends React.Component {

    state = {
        orders: [],
        isLoading: true,
        tableHeight: window.innerHeight - 247,
        showModalNewOrder: false,
        order: {
            orderOwner: {
                fio: '',
                id: null
            },
            orderCreator: {
                fio: '',
                id: null
            },
            scanner: '',
            scanType: '',
            scanSize: '',
            special: '',
            colorTones: '',
            contrast: '',
            density: '',
            frame: '',
            pack: '',
            express: ''
        },
        users: [],
        scannerOptions: {
            scanner: [
                {key: 'f', text: 'Frontier', value: 'frontier'},
                {key: 'i', text: 'Imacon', value: 'imacon'},
                {key: 'n', text: 'Noritsu', value: 'noritsu'},
                {key: 'c', text: 'Lab Choice', value: 'any'}
            ],
            scanType: [
                {key: 'b', text: 'Basic', value: 'basic'},
                {key: 'p', text: 'Premium', value: 'premium'}
            ],
            scanResolution: [
                {key: 'l', text: 'L', value: 'large', description: '35mm 2000*2900, 120type 2000*2600'},
                {key: 'xl', text: 'XL', value: 'xlarge', description: '35mm 3600*5400, 120type 3600*4800'},
                {key: 't', text: 'TIFF', value: 'tiff', description: '35mm 3600*5400, 120type 3600*4800'}
            ]
        },
        orderOptions: {
            colorTones: [
                {key: 'c', text: 'Cold', value: 'cold'},
                {key: 'n', text: 'Neutral', value: 'neutral'},
                {key: 'w', text: 'Warm', value: 'warm'}
            ],
            contrast: [
                {key: 'l', text: 'Low', value: 'low'},
                {key: 'n', text: 'Neutral', value: 'neutral'},
                {key: 'h', text: 'High', value: 'high'}
            ],
            density: [
                {key: 'l', text: 'Low', value: 'low'},
                {key: 'n', text: 'Neutral', value: 'neutral'},
                {key: 'h', text: 'High', value: 'high'}
            ],

        }
    };

    statusColor = new Map([
            ['new', 'blue'],
            ['cancelled', 'red'],
            ['confirmed', 'teal'],
            ['sent', 'purple'],
            ['arrived', 'yellow'],
            ['developed', 'olive'],
            ['scanned', 'orange'],
            ['processed', 'purple'],
            ['ready', 'green']
        ]
    );

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        await fetch('https://lighthouse-back-dev.herokuapp.com' + '/orders')
            .then(results => results.json())
            .then(data => {
                this.setState({orders: data, isLoading: false});
            }).catch(err => {
                console.log(err);
                this.setState({isLoading: false})
            });
        await fetch('https://lighthouse-back-dev.herokuapp.com' + '/users')
            .then(results => results.json())
            .then(data => {
                this.setState({
                    users: data.map((user) => {
                        return {
                            id: user.userId,
                            text: user.fio,
                            value: user.userId
                        };
                    })
                })
            })
            .catch(error => {
                console.log('Error fetching users', error);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let order = {...this.state.order};
        order[name] = value;
        this.setState({ order: order, showModalNewOrder: true });
    }

    handleSelectChange(event) {
        const value = event.target.innerText;
        const name = event.target.parentElement.parentElement.attributes.name.value;
        let order = {...this.state.order};
        if (typeof order[name] === 'object') {
            order[name] = {
                fio: value,
                id: event.target.id
            };
        } else {
            order[name] = value;
        }
        this.setState({ order: order, showModalNewOrder: true });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const order = this.state.order;

        await fetch('https://lighthouse-back-dev.herokuapp.com' + '/orders', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        });
        this.props.history.push('/orders');
    }

    async fetchUsers(event) {
        await fetch('https://lighthouse-back-dev.herokuapp.com' + "/users")
            .then(results => results.json())
            .then(data => {
                this.setState({users: data})
            })
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
                                    <a href={"/orders/order/" + rowData.orderId}>{rowData.orderNumber}</a>
                                )
                            },
                            {
                                title: 'Client',
                                field: 'orderOwner',
                                align: 'left',
                                render: rowData =>
                                    (
                                        [[rowData.orderOwner.firstName], rowData.orderOwner.lastName].join(' ')
                                    )
                            },
                            {
                                title: 'Status',
                                field: 'orderStatus',
                                render: rowData =>
                                    (
                                        <Label
                                            color={rowData.orderStatus ? this.statusColor.get(rowData.orderStatus.name.toLowerCase()) : null}
                                            key={rowData.orderStatus ? this.statusColor.get(rowData.orderStatus.name.toLowerCase()) : null}
                                        >
                                            {rowData.orderStatus.displayName}
                                        </Label>
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
                                onClick: () => (
                                    this.setState({showModalNewOrder: true})
                                )
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
                <Modal open={this.state.showModalNewOrder} onClose={() => {
                    this.setState({showModalNewOrder: false})
                }}>
                    <Modal.Header>Create New Order</Modal.Header>
                    <Modal.Content>
                        <Form size={'large'} onSubmit={this.handleSubmit}>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Select}
                                    label='Order Owner'
                                    name='orderOwner'
                                    options={this.state.users}
                                    value={this.state.order.orderOwner.fio || ''}
                                    placeholder='Order Owner'
                                    onChange={this.handleSelectChange}
                                >
                                </Form.Field>
                                <Form.Field
                                    control={Select}
                                    label='Order Creator'
                                    options={this.state.users}
                                    placeholder='Order Creator'
                                    name='orderCreator'
                                    onChange={this.handleSelectChange}
                                />
                            </Form.Group>
                            <Form.Group widths={"three"}>
                                <Form.Field
                                    control={Select}
                                    label='Scanner'
                                    options={this.state.scannerOptions.scanner}
                                    placeholder='Scanner'
                                    name='scanner'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Scan Type'
                                    options={this.state.scannerOptions.scanType}
                                    placeholder='Scan Type'
                                    name='scanType'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Scan Resolution'
                                    options={this.state.scannerOptions.scanResolution}
                                    placeholder='Scan Resolution'
                                    name='scanSize'
                                    onChange={this.handleSelectChange}
                                />
                            </Form.Group>
                            <Form.Group widths={"three"}>
                                <Form.Field
                                    control={Select}
                                    label='Color Tones'
                                    options={this.state.orderOptions.colorTones}
                                    placeholder='Color Tones'
                                    name='colorTones'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Contrast'
                                    options={this.state.orderOptions.contrast}
                                    placeholder='Contrast'
                                    name='contrast'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Density'
                                    options={this.state.orderOptions.density}
                                    placeholder='Density'
                                    name='density'
                                    onChange={this.handleSelectChange}
                                />
                            </Form.Group>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Select}
                                    label='Frame'
                                    options={this.state.orderOptions.colorTones}
                                    placeholder='Frame'
                                    name='frame'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Package'
                                    options={this.state.orderOptions.contrast}
                                    placeholder='Package'
                                    name='package'
                                    onChange={this.handleSelectChange}
                                />
                            </Form.Group>
                            <Form.Field
                                name='special'
                                control={TextArea}
                                label='Special'
                                onChange={this.handleInputChange}
                            />
                            <Form.Field
                                control={Checkbox}
                                label='Express Scanning'
                                name='express'
                                onChange={this.handleInputChange}
                            />
                            <Form.Button type={'submit'}>Save</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </>
        );
    }
}

export default withRouter(Orders);