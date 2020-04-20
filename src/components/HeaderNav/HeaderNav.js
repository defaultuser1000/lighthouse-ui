import React from 'react';
import {Image, Menu, Form, Input, Header, ItemMeta} from "semantic-ui-react";
import './HeaderNav.scss';
import logo from '../../assets/images/logo.png';
import {APP_NAME} from "../../config/Constants";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown";

export default function HeaderNav(props) {

    return (
        <Menu borderless className='top-menu' fixed='top'>
            <Menu.Item header className='logo'>
                <ItemMeta as='div'>
                    <Image src={logo} size='tiny' as='a' href='/'/>
                </ItemMeta>
                <Header as='h1' content={APP_NAME}/>
            </Menu.Item>
            <Menu.Menu className='nav-container'>
                <Menu.Item className='search-input'>
                    <Form>
                        <Form.Field>
                            <Input placeholder='Search'
                                   size='small'
                                   action='Go'/>
                        </Form.Field>
                    </Form>
                </Menu.Item>
            </Menu.Menu>
            <Menu.Item>
                <ProfileDropdown/>
            </Menu.Item>
        </Menu>
    );
}