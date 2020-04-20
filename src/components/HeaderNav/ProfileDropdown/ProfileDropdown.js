import React from 'react';
import './ProfileDropdown.scss';
import defaultAvatar from '../../../assets/images/default_avatar.png';

import {Dropdown, Image} from 'semantic-ui-react';
import {AuthenticationService} from '../../../_services/authentication.service';

export default class ProfileDropdown extends React.Component {

    options = [
        {key: 'user', text: 'Account', icon: 'user', href: '/profile'},
        {key: 'settings', text: 'Settings', icon: 'settings', href: '/profile/settings'},
        {
            key: 'sign-out',
            text: 'Sign Out',
            icon: 'sign out',
            onClick: () => {
                fetch(`/users/logout`)
                    .then(response => {
                        if (response.status === 204) {
                            AuthenticationService.prototype.logout();
                        } else {
                            throw new Error(response.statusText);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    ];

    render() {
        let fio = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).fio || 'Empty FIO result' : '';
        let avatar = localStorage.getItem('userData') ? 'data:image/png;base64,' + JSON.parse(localStorage.getItem('userData')).avatar || defaultAvatar : defaultAvatar;

        return (
            <Dropdown
                trigger={<span className='profile'>{fio} <Image avatar size='tiny' src={avatar}/></span>}
                options={this.options}
                pointing='top right'
                icon={null}
            />
        );
    }
}