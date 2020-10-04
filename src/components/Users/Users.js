import React from 'react';
import './Users.scss';
import MaterialTable from 'material-table';
import {Link} from "react-router-dom";
import {Image} from "semantic-ui-react";
import defaultAvatar from '../../assets/images/default_avatar.png';
import {authenticationService} from "../../_services/authentication.service";

export default class Users extends React.Component {

    state = {users: [], isLoading: true, tableHeight: window.innerHeight - 247};

    componentDidMount() {

    }

    render() {
        return (
            <div className='users-table'>
                <MaterialTable
                    isLoading={this.state.isLoading}
                    title="Users"
                    columns={[
                        {
                            width: 5,
                            title: 'Avatar',
                            field: 'imageUrl',
                            render: rowData => (
                                <Link to={'/users/user/' + rowData.userId}>
                                    <Image avatar size='mini'
                                           src={rowData.myUserDetails !== null
                                               ? 'data:image/png;base64,' + rowData.myUserDetails.avatar || defaultAvatar
                                               : defaultAvatar}
                                    />
                                </Link>
                            )
                        },
                        {
                            title: 'Name',
                            render: rowData => {
                                return <Link to={'/users/user/' + rowData.userId}>
                                    {
                                        rowData.myUserDetails !== null
                                            ? rowData.myUserDetails.fio
                                            : 'EMPTY'
                                    }
                                </Link>
                            }
                        },
                        {
                            title: 'Country, Town',
                            render: rowData => {
                                return rowData.myUserDetails !== null
                                    ? [rowData.myUserDetails.country, rowData.myUserDetails.city].join(', ') || 'EMPTY'
                                    : 'EMPTY'
                            }
                        },
                        // {
                        //     title: 'Orders Count',
                        //     render: rowData => {
                        //         return rowData.ownedOrders.length
                        //     }
                        // },
                    ]
                    }
                    data={query =>
                        new Promise((resolve, reject) => {
                            let url = '/api/admin/users?';
                            url += 'pageSize=' + query.pageSize;
                            url += '&page=' + query.page;

                            fetch(url)
                                .then(results => {
                                    if (results.ok)
                                        return results.json();

                                    if (results.status === 401) {
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
                                console.log(err);
                                this.setState({isLoading: false});
                            });
                        })
                    }
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit User',
                            // onClick: (event, rowData) => alert("You saved " + rowData.myUserDetails.firstName)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 20,
                        pageSizeOptions: [20],
                        minBodyHeight: this.state.tableHeight,
                        maxBodyHeight: this.state.tableHeight,
                        exportButton: true,
                        exportFileName: 'users_' +
                            new Date().getFullYear() +
                            new Date().getUTCMonth() +
                            new Date().getUTCDate() +
                            new Date().getHours() +
                            new Date().getMinutes() +
                            new Date().getSeconds()
                    }}
                />
            </div>
        );
    }
};