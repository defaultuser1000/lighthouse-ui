import React from 'react';
import './Users.scss';
import MaterialTable from 'material-table';
import {USERS_FETCH_LINK} from "../../config/Constants";
import {Link} from "react-router-dom";
import faker from "faker";
import {Image} from "semantic-ui-react";

export default class Users extends React.Component {

    state = {users: [], isLoading: true, tableHeight: window.innerHeight - 247};

    componentDidMount() {
        fetch(USERS_FETCH_LINK)
            .then(results => results.json())
            .then(data => {
                this.setState({users: data.users, isLoading: false});
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
                            title: 'Avatar',
                            field: 'imageUrl',
                            render: rowData => (
                                <Link to={'/users/' + rowData.id}>
                                    <Image avatar size='mini' src={faker.internet.avatar()}/>
                                </Link>
                            )
                        },
                        {title: 'Name', field: 'name'},
                        {title: 'Surname', field: 'surname'},
                        {title: 'Birth Year', field: 'birthYear', type: 'numeric'},
                        {
                            title: 'Birth Place',
                            field: 'birthCity',
                            lookup: {34: 'İstanbul', 63: 'Şanlıurfa'},
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