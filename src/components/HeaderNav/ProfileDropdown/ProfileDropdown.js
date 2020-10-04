import React from 'react';
import './ProfileDropdown.scss';
import defaultAvatar from '../../../assets/images/default_avatar.png';

import {Dropdown, Image} from 'semantic-ui-react';
import {authenticationService} from '../../../_services/authentication.service';
import {handleResponse} from "../../../_helpers/handle-response";

export default class ProfileDropdown extends React.Component {

    options = [
        {key: 'user', text: 'Account', icon: 'user', href: '/profile'},
        {key: 'settings', text: 'Settings', icon: 'settings', href: '/profile/settings'},
        {
            key: 'sign-out',
            text: 'Sign Out',
            icon: 'sign out',
            onClick: () => {
                fetch(`/api/users/logout`)
                    .then(response => {
                        handleResponse(response);
                        authenticationService.logout();
                    }).catch(error => {
                        console.log(error);
                    });
            }
        }
    ];

    render() {
        if (localStorage.getItem('userData')) {
            let userData = JSON.parse(localStorage.getItem('userData'));

            let fio = userData !== null && userData.myUserDetails !== null
                ? userData.myUserDetails.fio
                : userData.username;
            let avatar = userData && userData.myUserDetails !== null
                ? 'data:image/png;base64,' + userData.myUserDetails.avatar || defaultAvatar
                : defaultAvatar;

            return (
                <Dropdown
                    trigger={<span className='profile'>{fio} <Image avatar circular size='tiny' src={avatar}/></span>}
                    options={this.options}
                    pointing='top right'
                    icon={null}
                />
            );
        }
    }
}