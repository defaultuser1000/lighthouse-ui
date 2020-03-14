import faker from 'faker';
import React from 'react';
import './ProfileDropdown.scss';
import {Dropdown, Image} from 'semantic-ui-react';

const trigger = (
    <span className='profile'>
        {faker.name.findName('Bogdanova', 'Marina')} <Image avatar size='tiny' src={faker.internet.avatar()}/>
        {/*{faker.name.findName('Bogdanova', 'Marina', 'female')}*/}
    </span>
);

const options = [
    {key: 'user', text: 'Account', icon: 'user', href: '/profile'},
    {key: 'settings', text: 'Settings', icon: 'settings', href: '/profile/settings'},
    {key: 'sign-out', text: 'Sign Out', icon: 'sign out', href: '/logout'}
];

const ProfileDropdown = () => (
    <Dropdown
        trigger={trigger}
        options={options}
        pointing='top right'
        icon={null}
    />
);

export default ProfileDropdown;