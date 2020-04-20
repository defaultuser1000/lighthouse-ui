import React from 'react';
import './Users.scss';
import MaterialTable from 'material-table';
import {Link} from "react-router-dom";
import {Image} from "semantic-ui-react";
import defaultAvatar from '../../assets/images/default_avatar.png';

export default class Users extends React.Component {

    state = {users: [], isLoading: true, tableHeight: window.innerHeight - 247};

    componentDidMount() {
        fetch('/users')
            .then(results => results.json())
            .then(data => {
                this.setState({users: data, isLoading: false});
            }).catch(err => console.log(err))
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
                                    <Image avatar size='mini' src={'data:image/png;base64,' + rowData.avatar || defaultAvatar}/>
                                </Link>
                            )
                        },
                        {title: 'Name', field: 'fio'},
                        {title: 'Country, Town', render: rowData => {return [rowData.country, rowData.city].join(', ')}},
                        {
                            title: 'Orders Count',
                            render: rowData => {return rowData.ownedOrders.length}
                        },
                    ]
                    }
                    data={this.state.users}
                    actions={[
                        {
                            icon: 'save',
                            tooltip: 'Save User',
                            onClick: (event, rowData) => alert("You saved " + rowData.name)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 10,
                        pageSizeOptions: [10, 25, 50, { value: this.state.users.length, label: 'All' }],
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
}