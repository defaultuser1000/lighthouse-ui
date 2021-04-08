import React from 'react';
import {Image, Menu, Header, ItemMeta, MenuItem} from "semantic-ui-react";
import './HeaderNav.scss';
import logo from '../../assets/images/logo.png';
import {APP_NAME} from "../../config/Constants";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown";

export default function HeaderNav() {

    return (
        <Menu borderless className='top-menu' fixed='top'>
            <Menu.Item header className='logo'>
                <ItemMeta as='div'>
                    <Image src={logo} size='tiny' as='a' href='/'/>
                </ItemMeta>
                <Header as='h1' content={APP_NAME}/>
            </Menu.Item>
            <MenuItem position={"right"}>
                <ProfileDropdown/>
            </MenuItem>
        </Menu>
    );
}