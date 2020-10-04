import React from 'react';
import './Orders.scss';
import '../../styles/shared.scss'
import MaterialTable from "material-table";
import {Checkbox, Form, Header, Label, Modal, Select, Table, TextArea} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {authenticationService} from "../../_services/authentication.service";
import {statusColor} from '../../config/Constants';
import FilmsTable from "./Modal/FilmsTable/FilmsTable";

class Orders extends React.Component {

    state = {
        page: 0,
        pageSize: 20,
        totalCount: 0,
        orders: [],
        isLoading: true,
        tableHeight: window.innerHeight - 247,
        showModalNewOrder: false,
        order: {
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
        scannerOptions: {},
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
            frame: [
                {key: 'y', text: 'Yes', value: 'true'},
                {key: 'n', text: 'No', value: 'false'}
            ],
            package: [
                {key: 'c', text: 'Cut slive', value: 'Cut slive'},
                {key: 'r', text: 'Roll slive', value: 'Roll slive'}
            ]
        }
    };

    adminColumns = [
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
                    <a href={"/users/user/" + rowData.orderOwner.userId}
                       key={rowData.orderOwner.userId}>
                        {
                           rowData.orderOwner.myUserDetails !== null
                               ? rowData.orderOwner.myUserDetails.fio
                               : 'EMPTY'
                       }
                    </a>
                )
        },
        {
            title: 'Status',
            field: 'orderStatus',
            sorting: false,
            cellStyle: {
                align: 'center'
            },
            render: rowData =>
                (
                    <Label
                        color={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
                        key={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
                    >
                        {rowData.orderStatus.displayName}
                    </Label>
                )

        },
        {title: 'Created At', field: 'creationDate', type: 'date'},
        {title: 'Modified At', field: 'modificationDate', type: 'date', defaultSort: 'desc'}
    ];

    userColumns = [
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
            title: 'Status',
            field: 'orderStatus',
            sorting: false,
            cellStyle: {
                align: 'center'
            },
            render: rowData =>
                (
                    <Label
                        color={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
                        key={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
                    >
                        {rowData.orderStatus.displayName}
                    </Label>
                )

        },
        {title: 'Created At', field: 'creationDate', type: 'date'},
        {title: 'Modified At', field: 'modificationDate', type: 'date', defaultSort: 'desc'}
    ];

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state.isAdmin = authenticationService.isAdmin;
    }

    componentDidMount() {

        fetch('/api/orders/getNewOrderFieldsValues')
            .then(response => {
                if (response.ok)
                    return response.json();

                if (response.status === 401) {
                    authenticationService.logout();
                }
            }).then(data => {
            let scanners = data['scanners'];
            let scanTypes = data['scanTypes'];
            let scanResolution = data['scanResolution'];

            let scannersMap = scanners.map(scanner => {
                const container = {};
                container['key'] = scanners.indexOf(scanner);
                container['text'] = scanner;
                container['value'] = scanner.toLowerCase();
                return container;
            });
            scannersMap.push({key: 'c', text: 'Lab Choice', value: 'any'});

            let scanTypesMap = scanTypes.map(scanType => {
                const container = {};
                container['key'] = scanTypes.indexOf(scanType);
                container['text'] = scanType;
                container['value'] = scanType.toLowerCase();
                return container;
            });

            let scanResolutionMap = scanResolution.map(scanResolutionItem => {
                const container = {};
                container['key'] = scanResolution.indexOf(scanResolutionItem);
                container['text'] = scanResolutionItem.size;
                container['value'] = scanResolutionItem.size.toLowerCase();
                container['description'] = scanResolutionItem.description ? scanResolutionItem.description : '';
                return container;
            });

            let scannerOptions = {
                scanners: scannersMap,
                scanTypes: scanTypesMap,
                scanResolution: scanResolutionMap
            };

            this.setState(
                {
                    scannerOptions: scannerOptions
                });
        }).catch(err => {
            console.log(err);
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let order = {...this.state.order};
        order[name] = value;
        this.setState({order: order, showModalNewOrder: true});
    }

    handleSelectChange(event) {
        let value = '';
        let name = '';

        try {
            value = event.target.innerText;
            name = event.target.parentElement.parentElement.attributes.name.value;
        } catch (error) {
            try {
                value = event.target.parentElement.getElementsByClassName('text')[0].innerText;
                name = event.target.parentElement.parentElement.parentElement.attributes.name.value;
            } catch (e) {
                return;
            }
        }

        let order = {...this.state.order};
        if (typeof order[name] === 'object') {
            order[name] = {
                fio: value,
                id: event.target.id
            };
        } else {
            order[name] = value;
        }
        this.setState({order: order, showModalNewOrder: true});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const order = this.state.order;

        await fetch('/orders', {
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
        await fetch("/api/users")
            .then(response => response.json())
            .then(data => {
                this.setState({users: data})
            })
    }

    async getOrderPdf(order) {
        this.setState({isLoading: true});
        await fetch(`/api/orders/order/` + order.orderId + `/generateReport`, {method: 'GET', responseType: 'blob'})
            .then(response => {
                if (response.ok) {
                    return response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = 'Order #' + order.orderNumber + ' form.pdf';
                        a.click();
                        this.setState({isLoading: false});
                    });
                }
            });
    }

    render() {

        return (
            <>
                <div className='orders-table'>
                    <MaterialTable
                        isLoading={ this.state.isLoading }
                        title="Orders"
                        columns={ this.state.isAdmin ? this.adminColumns : this.userColumns }
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
                                onClick: (event, rowData) => (this.getOrderPdf(rowData))
                            }

                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 20,
                            search: false,
                            pageSizeOptions: [20],
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
                        data={query =>
                            new Promise((resolve, reject) => {
                                let url = '/api/orders?';
                                url += 'pageSize=' + query.pageSize;
                                url += '&page=' + query.page;

                                fetch(url)
                                    .then(response => {
                                        if (response.ok)
                                            return response.json();

                                        if (response.status === 401) {
                                            authenticationService.logout();
                                        }
                                    }).then(data => {
                                        resolve({
                                            data: data.content,
                                            page: data.number,
                                            pageSize: data.size,
                                            totalCount: data.totalElements
                                        });
                                        this.setState({
                                            isLoading: false
                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        this.setState({isLoading: false});
                                    });
                            })
                        }
                    />
                </div>
                <Modal open={this.state.showModalNewOrder} onClose={() => {
                    this.setState({showModalNewOrder: false})
                }}>
                    <Modal.Header>Create New Order</Modal.Header>
                    <Modal.Content>
                        <Form size={'large'} onSubmit={this.handleSubmit}>
                            {this.state.isAdmin && <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Select}
                                    label='Order Owner'
                                    name='orderOwner'
                                    options={this.state.users}
                                    value={this.state.order.orderOwner || ''}
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
                            </Form.Group>}
                            <Form.Group widths={"three"}>
                                <Form.Field
                                    control={Select}
                                    label='Scanner'
                                    options={this.state.scannerOptions.scanners}
                                    placeholder='Scanner'
                                    name='scanner'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Scan Type'
                                    options={this.state.scannerOptions.scanTypes}
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
                                    options={this.state.orderOptions.frame}
                                    placeholder='Frame'
                                    name='frame'
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Package'
                                    options={this.state.orderOptions.package}
                                    placeholder='Package'
                                    name='pack'
                                    onChange={this.handleSelectChange}
                                />
                            </Form.Group>
                            <Header>Order Films</Header>
                            <FilmsTable rows={[]}/>
                            <Form.Field
                                name='special'
                                control={TextArea}
                                label='Special'
                                onChange={this.handleInputChange}
                            />
                            <Form.Field
                                control={Checkbox}
                                label='Express Scanning (+100% cost)'
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