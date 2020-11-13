import React from 'react';
import './Orders.scss';
import '../../styles/shared.scss'
import MaterialTable from "material-table";
import {Checkbox, Form, Input, Label, Modal, Select, TextArea} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {authenticationService} from "../../_services/authentication.service";
import {statusColor} from '../../config/Constants';
import FilmsTable from "./Modal/FilmsTable/FilmsTable";
import {handleResponse} from "../../_helpers/handle-response";

class Orders extends React.Component {

    state = {
        userAddress: '',
        page: 0,
        pageSize: 20,
        totalCount: 0,
        orders: [],
        isLoading: true,
        tableHeight: window.innerHeight - 247,
        showModalNewOrder: false,
        order: {
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
        users: [],
        scannerOptions: {},
        transportCompanyOptions: [],
        orderOptions: {
            colorTones: [
                {key: 'c', text: 'Cold', value: 'Cold'},
                {key: 'n', text: 'Neutral', value: 'Neutral'},
                {key: 'w', text: 'Warm', value: 'Warm'}
            ],
            contrast: [
                {key: 'l', text: 'Low', value: 'Low'},
                {key: 'n', text: 'Neutral', value: 'Neutral'},
                {key: 'h', text: 'High', value: 'High'}
            ],
            density: [
                {key: 'l', text: 'Low', value: 'Low'},
                {key: 'n', text: 'Neutral', value: 'Neutral'},
                {key: 'h', text: 'High', value: 'High'}
            ],
            frame: [
                {key: 'y', text: 'Yes', value: 'true'},
                {key: 'n', text: 'No', value: 'false'}
            ],
            package: [
                {key: 'c', text: 'Cut slive', value: 'Cut slive'},
                {key: 'r', text: 'Roll slive', value: 'Roll slive'}
            ],
            afterOrderExecution: [
                {key: 'u', text: 'Could be utilized', value: 'utilize'},
                {key: 's', text: 'Must be saved and will be picked up within 3 months', value: 'save-self-return'},
                {key: 'r', text: 'Must send after scanning', value: 'send-after-scan'}
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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state.isAdmin = authenticationService.isAdmin;
        let userDetails = authenticationService.currentUserValue.myUserDetails;
        this.state.userAddress = [userDetails.postalCode, userDetails.country, userDetails.city, userDetails.address]
            .filter(el => el !== null).join(', ');
    }

    componentDidMount() {

        fetch('/api/transportCompanies')
            .then(response => {
                return handleResponse(response);
            })
            .then(data => {
                let options = data.map(company => {
                    const container = {};
                    const browserLocale = navigator.language.replace('-', '_');
                    container['key'] = company.companyId;
                    container['text'] = company.companyNames.filter(name => name.locale === browserLocale)[0].name;
                    container['value'] = company.code;
                    return container;
                });


                this.setState({ transportCompanyOptions: options })
            })
            .catch(error => {
                console.error(error);
            });

        fetch('/api/orders/getNewOrderFieldsValues')
            .then(response => {
                return handleResponse(response);
            }).then(data => {
            let scanners = data['scanners'];
            let scanTypes = data['scanTypes'];
            let scanResolution = data['scanResolution'];

            let scannersMap = scanners.map(scanner => {
                const container = {};
                container['key'] = scanners.indexOf(scanner);
                container['text'] = scanner;
                container['value'] = scanner;
                return container;
            });
            scannersMap.push({key: 'c', text: 'Lab Choice', value: 'any'});

            let scanTypesMap = scanTypes.map(scanType => {
                const container = {};
                container['key'] = scanTypes.indexOf(scanType);
                container['text'] = scanType;
                container['value'] = scanType;
                return container;
            });

            let scanResolutionMap = scanResolution.map(scanResolutionItem => {
                const container = {};
                container['key'] = scanResolution.indexOf(scanResolutionItem);
                container['text'] = scanResolutionItem.size;
                container['value'] = scanResolutionItem.size;
                container['description'] = scanResolutionItem.description ? scanResolutionItem.description : '';
                return container;
            });

            let scannerOptions = {
                scanners: scannersMap,
                orderTypes: scanTypesMap,
                scanResolution: scanResolutionMap
            };

            this.setState(
                {
                    scannerOptions: scannerOptions
                });
        }).catch(err => {
            console.error(err);
        });
    }

    handleChange = (e, { name, value }) => {

        let order = {...this.state.order};

        switch (name) {
            case "scanner":
            case "orderType":
            case "transportCompany":
                order[name] = {
                    name: value
                };
                break;
            case "scanSize":
                order[name] = {
                    size: value
                };
                break;
            default: {
                order[name] = value;
                if (name === 'afterOrderProcessed' && value === 'send-after-scan') {
                    order.address = this.state.userAddress
                }
                if (name === 'afterOrderProcessed' && value !== 'send-after-scan') {
                    order['transportCompany'] = {
                        name: ''
                    };
                    order['address'] = '';
                }
                break;
            }
        }

        this.setState({ order: order, showModalNewOrder: true });
    };

    filmAdded = (film) => {
        let currentOrder = this.state.order;
        currentOrder.orderFilms.push(film);
        this.setState({ order: currentOrder });
    };

    handleSubmit(event) {
        event.preventDefault();
        const order = this.state.order;

        if (order.scanner.name !== '' && order.orderType.name !== '' && order.scanSize.size !== ''
            && order.colorTones !== '' && order.contrast !== '' && order.density !== '' && order.frame !== ''
            && order.pack !== '' && order.express !== '' && (order.afterOrderProcessed !== ''
            || (order.afterOrderProcessed === 'send-after-scan' && order.transportCompany.name !== ''))
        ) {
            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order),
            }).then(response => {
                return handleResponse(response);
            }).then(data => {
                console.log(data);
                this.props.history.push('/orders');
            }).catch(error => {
                console.error(error.message);
            });
        }
    }

    async fetchUsers(event) {
        await fetch("/api/users")
            .then(response => {
                return handleResponse(response);
            }).then(data => {
                this.setState({users: data})
            });
    }

    getOrderPdf(order) {
        this.setState({ isLoading: true });
        fetch(`/api/orders/order/${order.orderId}/generateReport`, {
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
                this.setState({ isLoading: false });
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
                                        return handleResponse(response);
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
                    // TODO: Сделать подтверждение всплывающим окном, если заказ был заполнен
                    this.setState({ order: {}, showModalNewOrder: false })
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
                                    onChange={this.handleChange}
                                >
                                </Form.Field>
                                <Form.Field
                                    control={Select}
                                    label='Order Creator'
                                    options={this.state.users}
                                    placeholder='Order Creator'
                                    name='orderCreator'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>}
                            <Form.Group widths={"three"}>
                                <Form.Field
                                    control={Select}
                                    label='Scanner'
                                    options={this.state.scannerOptions.scanners}
                                    placeholder='Scanner'
                                    required={true}
                                    name='scanner'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Order Type'
                                    options={this.state.scannerOptions.orderTypes}
                                    placeholder='Order Type'
                                    required={true}
                                    name='orderType'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Scan Resolution'
                                    options={this.state.scannerOptions.scanResolution}
                                    placeholder='Scan Resolution'
                                    required={true}
                                    name='scanSize'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group widths={"three"}>
                                <Form.Field
                                    control={Select}
                                    label='Color Tones'
                                    options={this.state.orderOptions.colorTones}
                                    placeholder='Color Tones'
                                    required={true}
                                    name='colorTones'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Contrast'
                                    options={this.state.orderOptions.contrast}
                                    placeholder='Contrast'
                                    required={true}
                                    name='contrast'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Density'
                                    options={this.state.orderOptions.density}
                                    placeholder='Density'
                                    required={true}
                                    name='density'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group widths={"two"}>
                                <Form.Field
                                    control={Select}
                                    label='Frame'
                                    options={this.state.orderOptions.frame}
                                    placeholder='Frame'
                                    required={true}
                                    name='frame'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    control={Select}
                                    label='Package'
                                    options={this.state.orderOptions.package}
                                    placeholder='Package'
                                    required={true}
                                    name='pack'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <Form.Field
                                    control={Select}
                                    label={'After order execution'}
                                    options={this.state.orderOptions.afterOrderExecution}
                                    placceholder={'select option'}
                                    required={true}
                                    name={'afterOrderProcessed'}
                                    onChange={this.handleChange}
                                />
                                {this.state.order.afterOrderProcessed === 'send-after-scan' &&
                                <Form.Field
                                    control={Select}
                                    label={'Transport Company'}
                                    options={this.state.transportCompanyOptions}
                                    placeholder={'Select transport company'}
                                    required={true}
                                    name={'transportCompany'}
                                    onChange={this.handleChange}
                                />
                                }
                            </Form.Group>
                            {this.state.order.afterOrderProcessed === 'send-after-scan' &&
                                <Form.Field
                                    control={Input}
                                    label={'Address'}
                                    placeholder={'Enter address where order should be sent'}
                                    value={this.state.userAddress}
                                    required={true}
                                    name={'address'}
                                    onChange={this.handleChange}
                                />
                            }
                            <Form.Field>
                                <label>Order Films</label>
                                <FilmsTable rows={this.state.order.orderFilms} scanResolutions={this.state.scannerOptions.scanResolution} editable={true}/>
                            </Form.Field>
                            <Form.Field
                                name='special'
                                control={TextArea}
                                label='Special'
                                onChange={this.handleChange}
                            />
                            <Form.Field
                                control={Checkbox}
                                label='Express Scanning (+100% cost)'
                                name='express'
                                onChange={this.handleChange}
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